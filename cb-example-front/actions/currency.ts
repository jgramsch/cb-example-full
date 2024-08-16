"use server";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

// TODO: change interfaces into types when viable
interface CBResponse {
	isoCode: string;
	currency: string;
	id: string;
	popular?: boolean;
	queryCountries: CountriesDTO;
}

interface ConversionRequest {
	input_currency: string;
	output_currencies: Array<string>;
}
interface ConversionResponse {
	date: string;
	sender_code: string;
	conversions: Map<string, number>;
}

export interface CountryInfo {
	flagSrc: string;
	currency: string;
	country: string;
}

export interface ConversionParams {
	input: { currency: string; amount: number };
	output_currency: string;
	conversionTree: Map<string, Map<string, number>>;
	countries: CountriesDTO;
}

export interface CountriesDTO {
	senders: Array<CountryInfo>;
	receivers: Array<CountryInfo>;
}

const fetchSenders = async (): Promise<Array<CBResponse>> => {
	const senders_url =
		"https://elb.currencybird.cl/apigateway-cb/api/public/incomingCountries";
	try {
		return (
			await axios.get(senders_url, {
				responseType: "json",
			})
		).data as Array<CBResponse>;
	} catch (error) {
		console.error(error);
		return [];
	}
};
const fetchReceivers = async (): Promise<Array<CBResponse>> => {
	const receivers_url =
		"https://elb.currencybird.cl/apigateway-cb/api/public/sendCountries";
	try {
		return (
			await axios.get(receivers_url, {
				responseType: "json",
			})
		).data as Array<CBResponse>;
	} catch (error) {
		console.error(error);
		return [];
	}
};

const fetchFlagAndCountry = async (cnt: CBResponse): Promise<CountryInfo> => {
	const flagsDir = path.join(process.cwd(), "public", "flags");
	const getCountryNames = new Intl.DisplayNames(["es"], { type: "region" });
	const country_name = getCountryNames.of(cnt.isoCode);
	if (!fs.existsSync(flagsDir)) {
		fs.mkdirSync(flagsDir, { recursive: true });
	}
	const flagUrl = `https://flagcdn.com/w40/${cnt.isoCode.toLowerCase()}.png`;
	const filePath = path.join(flagsDir, `${cnt.isoCode.toLowerCase()}.png`);
	if (!fs.existsSync(filePath)) {
		try {
			const response = await axios.get(flagUrl, {
				responseType: "arraybuffer",
			});
			fs.writeFileSync(filePath, response.data);
		} catch (error) {
			// TODO: arreglar bug isla ascencion y bandera
			if (country_name != cnt.isoCode) {
			} else {
				// console.log("Trick country? ", country_name);
			}
			return {
				currency: "",
				country: "",
				flagSrc: "",
			};
			// console.error(error);
		}
	}
	return {
		currency: cnt.currency,
		country: country_name ? country_name : "",
		flagSrc: `/flags/${cnt.isoCode.toLowerCase()}.png`,
	};
};

const prepareCountryData = async (
	countryInfo: Array<CBResponse>,
): Promise<Array<CountryInfo>> => {
	const result = await Promise.all(
		countryInfo.map(async (country) => {
			return await fetchFlagAndCountry(country);
		}),
	);
	return result.filter((value) => !(value.currency === ""));
};

export const getSendersAndReceivers = async (): Promise<CountriesDTO> => {
	const senders = await fetchSenders();
	const receivers = await fetchReceivers();
	return {
		senders: await prepareCountryData(senders),
		receivers: await prepareCountryData(receivers),
	};
};

export async function fetchConversions(countries: CountriesDTO) {
	const url = "http://127.0.0.1:8000/api/";

	// filter duplicate sender currencies

	const sender_set = new Set<string>();
	const receiver_set = new Set<string>();
	const sender_currencies: Array<string> = countries.senders
		.filter((value) => {
			if (sender_set.has(value.currency)) {
				return false;
			}
			sender_set.add(value.currency);
			return true;
		})
		.map((value) => value.currency);
	const receiver_currencies: Array<string> = countries.receivers
		.filter((value) => {
			if (receiver_set.has(value.currency)) {
				return false;
			}
			receiver_set.add(value.currency);
			return true;
		})
		.map((value) => value.currency);

	// prepare requests
	const requestArray: Array<ConversionRequest> = sender_currencies.map(
		(value): ConversionRequest => {
			return {
				input_currency: value,
				output_currencies: ["CLP"],
			};
		},
	);
	requestArray.push({
		input_currency: "CLP",
		output_currencies: receiver_currencies,
	});

	// fetch from api
	const conversionData: Array<ConversionResponse> = await Promise.all(
		requestArray.map(async (value) => {
			try {
				const response = await axios.post(url, value, {
					responseType: "json",
				});
				return response.data as ConversionResponse;
			} catch (error) {
				return {
					date: "",
					sender_code: "",
					conversions: new Map<string, number>(),
				};
			}
		}),
	);

	if (conversionData.length <= 0) {
		return;
	}

	const conversionTree = new Map<string, Map<string, number>>();

	//Popuate tree
	conversionData.forEach((response) => {
		const senderCurrency = response.sender_code.toUpperCase();

		if (conversionTree.has(senderCurrency)) {
			conversionTree.set(senderCurrency, new Map<string, number>());
		}

		const outputCurrencies = conversionTree.get(senderCurrency);
		const conversions = new Map<string, number>(
			Object.entries(response.conversions),
		);
		conversions.forEach((rate, receiverCurrency) => {
			outputCurrencies?.set(receiverCurrency.toUpperCase(), rate);
		});
	});
	// console.log(this._conversionTree);
	return conversionTree;
}

export async function convertCurrency(
	params: ConversionParams,
): Promise<number> {
	// consult rate
	const rate = params.conversionTree
		.get(params.input.currency)
		?.get(params.output_currency) as number;
	// return result
	return params.input.amount * rate * 0.95;
}
