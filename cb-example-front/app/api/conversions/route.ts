import type { NextApiRequest, NextApiResponse } from "next";
import Conversions, { ConversionParams } from "@/actions/currency";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		if (req.method === "POST") {
			const params: ConversionParams = req.body;
			const result: number = await Conversions.convertCurrency(params);
			res.status(200).json({ result });
		} else {
			res.status(405).json({ error: "Method not allowed" });
		}
	} catch (error) {
		res.status(500).json({ error: "Conversion failed" });
	}
}
