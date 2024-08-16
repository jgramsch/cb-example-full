import { NextResponse } from "next/server";
import {
	fetchConversions,
	convertCurrency,
	ConversionParams,
} from "@/actions/currency";

export async function POST(request: Request) {
	try {
		const body: ConversionParams = await request.json();
		// const convTree: Map<string, Map<string, number>> = await fetchConversions();
		const result: number = await convertCurrency(body);
		return NextResponse.json({ result }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
	}
}

export async function OPTIONS() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
