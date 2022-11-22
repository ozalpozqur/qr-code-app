import Logo from '../components/Logo';
import GenerateQR from '../components/GenerateQR';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import axios from '../libs/axios';

interface HomeProps {
	appId: string | null;
	appURL: string;
	code: string | null;
}
export default function Index({ appId, appURL, code }: HomeProps) {
	return (
		<section className="flex flex-col gap-4 sm:gap-6 py-4">
			<Head>
				<title>Altogic QR Code Generator</title>
			</Head>
			<Logo className="h-16" />
			<GenerateQR appURL={appURL} appId={appId} code={code} />
		</section>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { appId } = context.query;
	const NextRequestMetaSymbol = Reflect.ownKeys(context.req).find(
		key => key.toString() === 'Symbol(NextRequestMeta)'
	);
	// @ts-ignore
	const appURL = context.req[NextRequestMetaSymbol].__NEXT_INIT_URL;
	const apiURL = new URL(appURL).origin + '/api/add-user';
	let status: string | null = null;

	if (appId) {
		const {
			data: { code },
		} = await axios.post(apiURL, { appId });
		status = code;
	}

	return {
		props: {
			appId: appId ? appId.toString() : null,
			appURL,
			code: status ?? null,
		},
	};
}
