"use client";
import labels from "@/defaults/crude-labels";
import theme from "@/defaults/crude-theme";
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

const CurrencyField: React.FC<{
	type: "input" | "output";
	defaultAmount?: number;
	actionListener?: (input: number) => void;
}> = (
	props = {
		type: "output",
	},
) => {
	// static
	const input = props.type === "input";
	const text =
		props.type === "input"
			? labels.converter.interface.input
			: labels.converter.interface.output;

	const textColor = theme.converter.interface.text;
	const background = theme.converter.interface.background;

	//dynamic
	const [amount, setAmount] = useState<number>(
		props.defaultAmount ? props.defaultAmount : 0,
	);

	// hooks and functions
	const digestValue = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(Number(event.target.value));
	};

	useEffect(() => {
		if (props.actionListener) {
			props.actionListener(amount);
		} else {
			console.log("TODO: add action listener missing error message");
		}
	}, [props.actionListener, amount]);

	//component
	return (
		<Box
			display={"flex"}
			flexDirection={"column"}
			gap={"12px"}
			sx={{ backgroundColor: background }}
		>
			<Typography variant="body1" color={textColor}>
				{text}
			</Typography>
			{input && (
				<TextField
					type="number"
					onChange={digestValue}
					value={amount}
					variant="standard"
					InputProps={{
						startAdornment: <p>$</p>,
						disableUnderline: true, // Disable the underline that appears by default in the standard variant
					}}
					sx={{
						backgroundColor: "transparent", // Ensure background is transparent
						"& .MuiInputBase-root": {
							border: "none", // Remove any borders
						},
					}}
				/>
			)}
			{!input && (
				<Typography variant="body1" color={textColor}>
					$ {amount}
				</Typography>
			)}
		</Box>
	);
};

export default CurrencyField;
