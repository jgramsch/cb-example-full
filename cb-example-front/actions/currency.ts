"use server";

export interface conversionParameters {
	valueInput: number;
	inputCurrencyCode: string;
	outputCurrencyCode: string;
}

export interface conversionResponse {
	valueResponse: number;
}

export interface currencySelectorDTO {
	flagSrc: string;
	currencyCode: string;
	country: string;
}

type CurrencyInfoSO = {
	currencyCode: string;
	countryName: string;
	conversion?: number;
};

class ConverterController {
	constructor() {}
}

const getAvailableSenders = async (currency: string) => {};
const getAvailableReceivers = async () => {};
