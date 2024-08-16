"use client";
import labels from "@/defaults/crude-labels";
import theme from "@/defaults/crude-theme";
import { CountryInfo } from "@/actions/currency";
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
	currencies: Array<CountryInfo>;
};

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
	onCurrencyChange,
	currencies,
}) => {
	const [selectedCurrency, setSelectedCurrency] = useState<string>("");

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
				const currency = currencies.find((c) => c.currency === value);
				return currency ? (
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Image
							src={currency.flagSrc}
							alt={currency.country}
							width={24}
							height={16}
							style={{ marginRight: 8 }}
						/>
						<Typography>{currency.currency}</Typography>
					</Box>
				) : null;
			}}
			sx={{ minWidth: 120 }}
		>
			{currencies.map((currency) => (
				<MenuItem key={currency.currency} value={currency.currency}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Image
							src={currency.flagSrc}
							alt={currency.country}
							width={24}
							height={16}
							style={{ marginRight: 8 }}
						/>
						<Typography>
							{currency.currency} - {currency.country}
						</Typography>
					</Box>
				</MenuItem>
			))}
		</Select>
	);
};

export default CurrencySelector;
