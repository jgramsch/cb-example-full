import Header from "@/components/header";
import CurrencyTransfer from "@/components/converter";
import RegulationNotice from "@/components/regulationNotice";
export default function Home() {
	return (
		<>
			<Header />
			<CurrencyTransfer />
			<RegulationNotice />
		</>
	);
}
