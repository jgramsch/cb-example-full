"use client";
import labels from "@/defaults/crude-labels";
import theme from "@/defaults/crude-theme";
import { currencySelectorDTO } from "@/actions/currency";
import {
	Box,
	Button,
	Typography,
	TextField,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";

type CurrencySelectorProps = {
	onCurrencyChange: (currencyCode: string) => void;
};

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
	onCurrencyChange,
}) => {
	const [currencies, setCurrencies] = useState<currencySelectorDTO[]>();
	const [selectedCurrency, setSelectedCurrency] = useState<string>("");

	useEffect(() => {
		// Fetch currencies here
		const fetchCurrencies = async () => {
			// Replace this with your actual fetch function
			// const fetchedCurrencies = await fetchCurrenciesFromAPI();
			// setCurrencies(fetchedCurrencies);
			// if (fetchedCurrencies.length > 0) {
			// 	setSelectedCurrency(fetchedCurrencies[0].code);
			// }
		};

		fetchCurrencies();
	}, []);

	const handleChange = (event: SelectChangeEvent<string>) => {
		setSelectedCurrency(event.target.value);
		onCurrencyChange(event.target.value);
	};

	return (
		<Select
			value={selectedCurrency}
			onChange={handleChange}
			displayEmpty
			renderValue={(value) => {
				const currency = currencies.find((c) => c.code === value);
				return currency ? (
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Image
							src={currency.flagSrc}
							alt={currency.country}
							width={24}
							height={16}
							style={{ marginRight: 8 }}
						/>
						<Typography>{currency.code}</Typography>
					</Box>
				) : null;
			}}
			sx={{ minWidth: 120 }}
		>
			{currencies.map((currency) => (
				<MenuItem key={currency.code} value={currency.code}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Image
							src={currency.flagSrc}
							alt={currency.country}
							width={24}
							height={16}
							style={{ marginRight: 8 }}
						/>
						<Typography>
							{currency.code} - {currency.country}
						</Typography>
					</Box>
				</MenuItem>
			))}
		</Select>
	);
};
