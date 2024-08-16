import { NextResponse } from "next/server";
import { CountriesDTO, getSendersAndReceivers } from "@/actions/currency";

export async function GET() {
	try {
		const data = (await getSendersAndReceivers()) as CountriesDTO;
		console.log(data);
		NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch country data" },
			{ status: 500 },
		);
	}
}
