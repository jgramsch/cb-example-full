"use client";
import labels from "@/defaults/crude-labels";
import theme from "@/defaults/crude-theme";
import {
	Box,
	Button,
	Typography,
	TextField,
	MenuItem,
	SelectChangeEvent,
} from "@mui/material";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import CurrencyField from "./currencyIO";
import CurrencySelector from "./currencySelector";
import { CountriesDTO } from "@/actions/currency";
// Selector

// Main component
const CurrencyTransfer: React.FC = () => {
	const [countryData, setCountryData] = useState<CountriesDTO>();
	const [senderCurrency, setSenderCurrency] = useState<string>();
	const [receiverCurrency, setReceiverCurrency] = useState<string>();
	const [amount, setAmount] = useState<number>();
	const [conversionResult, setConversionResult] = useState<number>();

	// Fetch country data
	useEffect(() => {
		const fetchCountryData = async () => {
			console.log("response");
			const response = await fetch("/api/countries");
			console.log(response);
			const data: CountriesDTO = await response.json();
			setCountryData(data);
		};

		fetchCountryData();
	}, []);

	//fetch conversions  call
	const handleConvert = useCallback(async () => {
		const response = await fetch("/api/conversion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				input: { currency: senderCurrency, amount: amount },
				output_currency: receiverCurrency,
			}),
		});
		const result = await response.json();
		setConversionResult(result.result);
	}, [senderCurrency, receiverCurrency]);

	//functions passed to subcomponents
	const handleAmountChange = async (value: number) => {
		setAmount(value);
	};
	const handleSenderSelected = async (value: string) => {
		setSenderCurrency(value);
	};
	const handleReceiverSelected = async (value: string) => {
		setReceiverCurrency(value);
	};

	return (
		<Box
			key={"converter-info-and-button"}
			display={"flex"}
			flexDirection={"column"}
			justifyContent={"start"}
			height={"80px"}
		>
			<Box
				key={"component-and-button"}
				display={"flex"}
				justifyContent={"space-around"}
				flexDirection={{ xs: "column", md: "row" }}
			>
				<Box
					key={"converter"}
					display={"flex"}
					flexDirection={"row"}
					sx={{
						backgroundColor: "#e1eaf2",
						borderRadius: "8px",
					}}
				>
					<CurrencyField type="input" />
					<CurrencySelector
						onCurrencyChange={handleSenderSelected}
						currencies={countryData ? countryData.senders : []}
					/>
					<CurrencyField type="output" defaultAmount={conversionResult} />
					<CurrencySelector
						onCurrencyChange={handleReceiverSelected}
						currencies={countryData ? countryData.receivers : []}
					/>
				</Box>
				<Button
					variant="contained"
					color="warning"
					sx={{
						fontWeight: "bold",
						borderRadius: "20px",
						padding: "10px 20px",
						marginTop: "auto",
					}}
				>
					¡Transfiere!
				</Button>
			</Box>
			<Box
				display={"flex"}
				flexDirection={{ xs: "column", md: "row" }}
				justifyContent={"space-around"}
				alignItems={"center"}
			>
				<Typography variant="body2">Fecha de llegada: {"---"}</Typography>
				<Typography variant="body2">Tipo de Cambio: {"---"}</Typography>
			</Box>
		</Box>
	);
};

export default CurrencyTransfer;
