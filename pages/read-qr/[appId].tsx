import { GetServerSidePropsContext } from 'next';
import altogic from '../../libs/altogic';
import Head from 'next/head';
import { Player } from '@lottiefiles/react-lottie-player';
import Logo from '../../components/Logo';
import { getUserByAppId, updateUser } from '../../helpers';
import Error from 'next/error';

interface Props {
	isAuthenticated: boolean;
	errorCode: number;
	alreadyTaken: boolean;
}
export default function ReadQR({ isAuthenticated, errorCode, alreadyTaken }: Props) {
	if (errorCode) return <Error statusCode={errorCode} />;

	return (
		<div>
			<Head>
				<title>Altogic QR Code Reader</title>
			</Head>
			<div className="h-full relative flex-col py-6 flex items-center justify-center">
				{isAuthenticated ? (
					<div>Daha önceden kazanmış</div>
				) : alreadyTaken ? (
					<AlreadyTakenMessage />
				) : (
					<CongratulatoryMessage />
				)}
				<Logo className="absolute bottom-5 h-16" />
			</div>
		</div>
	);
}

function CongratulatoryMessage() {
	return (
		<>
			<Player
				className="absolute top-0 left-1/2 -translate-x-1/2 w-full -z-10"
				autoplay
				loop
				src="/confetti.json"
			/>
			<div className="space-y-10">
				<h1 className="text-4xl sm:text-6xl text-center font-oswald leading-normal sm:leading-[130%] relative z-10">
					TEBRİKLER <br />
					SWAG KİT KAZANDINIZ
				</h1>
				<h5 className="text-center text-xl">
					Hediyenizi almak için <strong>Altogic</strong> standına gelip <strong>QR(Kare)</strong> kodunuzu
					okutunuz.
				</h5>
			</div>
			<Player autoplay loop src="/confetti.json" />
		</>
	);
}
function AlreadyTakenMessage() {
	return (
		<>
			<h1 className="text-4xl sm:text-6xl text-center font-oswald leading-normal sm:leading-[130%] relative z-10">
				ZATEN SWAG KİT <br />
				HEDİYENİZİ TESLİM ALDINIZ
			</h1>
			<Player autoplay loop src="/sad.json" />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { user: isAuthenticated } = await altogic.auth.getUserFromDBbyCookie(context.req, context.res);
	const { appId } = context.params as { appId: string };
	let errorCode = null;
	let alreadyTaken = false;

	const { user, errors } = await getUserByAppId(appId);

	if (errors) {
		errorCode = errors.status;
	} else if (user) {
		if (isAuthenticated && !user.hasReceived) {
			await updateUser(user._id, { hasReceived: true, receivedAt: new Date().toISOString() });
		}
		alreadyTaken = user.hasReceived;
	} else {
		errorCode = 404;
	}

	return {
		props: {
			errorCode,
			isAuthenticated,
			alreadyTaken,
		},
	};
}
