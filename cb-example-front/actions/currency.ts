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
				// console.log("TODO: this country is being left out ");
				// console.log(country_name);
				// console.log(cnt.isoCode);
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

class ConversionController {
	_countries!: CountriesDTO;
	_conversionTree!: Map<string, Map<string, number>>;

	set countries(countries: CountriesDTO) {
		this._countries = countries;
	}
	get countries() {
		return this._countries;
	}

	url: string;
	constructor(
		host: string = "http://127.0.0.1",
		port: number = 8000,
		route: string = "api/",
	) {
		this._conversionTree = new Map<string, Map<string, number>>();
		this.url = host + ":" + port.toString() + "/" + route;
	}

	async fetchConversions() {
		if (!this._countries) {
			throw Error("countries attribute hasn't been set");
		}

		// filter duplicate sender currencies

		const sender_set = new Set<string>();
		const receiver_set = new Set<string>();
		const sender_currencies: Array<string> = this._countries.senders
			.filter((value) => {
				if (sender_set.has(value.currency)) {
					return false;
				}
				sender_set.add(value.currency);
				return true;
			})
			.map((value) => value.currency);
		const receiver_currencies: Array<string> = this._countries.receivers
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
					const response = await axios.post(this.url, value, {
						responseType: "json",
					});
					return response.data as ConversionResponse;
				} catch (error) {
					// console.log("failed to fetch conversion");
					// console.log(value.input_currency);
					// console.log(value.output_currencies);
					// console.log(error);
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

		//Popuate tree
		conversionData.forEach((response) => {
			const senderCurrency = response.sender_code.toUpperCase();

			if (!this._conversionTree.has(senderCurrency)) {
				this._conversionTree.set(senderCurrency, new Map<string, number>());
			}

			const outputCurrencies = this._conversionTree.get(senderCurrency);
			const conversions = new Map<string, number>(
				Object.entries(response.conversions),
			);
			conversions.forEach((rate, receiverCurrency) => {
				outputCurrencies?.set(receiverCurrency.toUpperCase(), rate);
			});
		});
		// console.log(this._conversionTree);
	}
	async convertCurrency(params: ConversionParams): Promise<number> {
		if (this._conversionTree.keys.length <= 0) {
			console.log("fetching conversions");
			await this.fetchConversions();
		}
		// consult rate
		const rate = this._conversionTree
			.get(params.input.currency)
			?.get(params.output_currency) as number;
		// return result
		return params.input.amount * rate * 0.95;
	}
}

// Testing plus instance export construction
const Conversions = new ConversionController();

// getSendersAndReceivers().then((result) => {
// 	// console.log(result.senders.length);
// 	// console.log(result.receivers.length);
// 	Conversions.countries = result;
// 	console.log("converting 1000 usd to clp and back");
// 	Conversions.convertCurrency({
// 		input: { currency: "USD", amount: 1000 },
// 		output_currency: "CLP",
// 	}).then((result) => {
// 		console.log(result);
// 		Conversions.convertCurrency({
// 			input: { currency: "CLP", amount: 1000 },
// 			output_currency: "USD",
// 		}).then((result) => {
// 			console.log(result);
// 		});
// 	});
// });

export default Conversions;
