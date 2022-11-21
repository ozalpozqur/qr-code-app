import Logo from '../components/Logo';
import GenerateQR from '../components/GenerateQR';
import Head from 'next/head';

export default function Home() {
	return (
		<section className="flex flex-col gap-4 sm:gap-6 py-4">
			<Head>
				<title>Altogic QR Code Generator</title>
			</Head>
			<Logo className="h-16" />
			<GenerateQR />
		</section>
	);
}
