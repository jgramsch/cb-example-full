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
import CurrencyField from "./currencyIO";
// Selector

// Main component
const CurrencyTransfer: React.FC = () => {
	const [amount, setAmount] = useState(500000); // Default value
	const [exchangeRate] = useState(254.7); // Exchange rate, could be dynamic
	const [arrivalDate] = useState("2024-08-12"); // Arrival date, could be dynamic
	const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(Number(event.target.value));
	};
	const convertedAmount = (amount / exchangeRate).toFixed(2);

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

					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<TextField
							select
							value="CLP"
							variant="outlined"
							size="small"
							sx={{ width: "80px", marginBottom: 1 }}
						>
							<MenuItem value="CLP">CLP</MenuItem>
							<MenuItem value="ARS">ARS</MenuItem>
							{/* Add more currency options here */}
						</TextField>
						<Typography variant="h6">{convertedAmount}</Typography>
					</Box>

					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
						}}
					>
						<TextField
							select
							value="PEN"
							variant="outlined"
							size="small"
							sx={{ width: "80px", marginBottom: 1 }}
						>
							<MenuItem value="PEN">PEN</MenuItem>
						</TextField>
					</Box>
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
				<Typography variant="body2">Fecha de llegada: {arrivalDate}</Typography>
				<Typography variant="body2">Tipo de Cambio: {exchangeRate}</Typography>
			</Box>
		</Box>
	);
};

export default CurrencyTransfer;
