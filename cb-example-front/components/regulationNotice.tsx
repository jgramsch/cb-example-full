import React from "react";
import labels from "@/defaults/crude-labels";
import theme from "@/defaults/crude-theme";
import { Typography, Box, Grid } from "@mui/material";

const RegulationNotice: React.FC = () => {
	const textColor = theme.text.primary;
	return (
		<Box
			display={"flex"}
			flexDirection={"column"}
			paddingTop={"64px"}
			gap={"20px"}
		>
			<Typography variant="h4" color={textColor}>
				{labels.regulationNotice.title}
			</Typography>
			<Grid justifyContent={"space-around"} container spacing={"16px"}>
				<Grid item xs={3}>
					<Typography variant="body1" color={textColor}>
						{labels.regulationNotice.paragraph}
					</Typography>
				</Grid>
				{labels.regulationNotice.lawCodes.map(
					(value: string, index: number) => (
						<Grid item xs={1} key={index}>
							<Typography variant="body2" color={textColor}>
								{value}
							</Typography>
						</Grid>
					)
				)}
			</Grid>
		</Box>
	);
};

export default RegulationNotice;
