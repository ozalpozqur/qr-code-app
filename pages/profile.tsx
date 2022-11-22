import { GetServerSidePropsContext } from 'next';
import altogic from '../libs/altogic';
import type { User } from 'altogic';
import Logo from '../components/Logo';
import Head from 'next/head';

interface ProfileProps {
	user: User;
}
export default function Profile({ user }: ProfileProps) {
	return (
		<section className="h-full text-center flex items-center justify-center flex-col gap-4">
			<Head>
				<title>Profile - Altogic</title>
			</Head>
			<h1 className="font-bold text-4xl md:text-7xl !leading-[140%]">
				Hoş geldin <br /> {user.name}
			</h1>
			<a
				className="border px-3 py-2 hover:bg-gray-500 hover:text-white text-lg transition"
				href="/api/auth/logout"
			>
				Çıkış yap.
			</a>
			<Logo className="absolute bottom-5 h-16" />
		</section>
	);
}

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
	const { user } = await altogic.auth.getUserFromDBbyCookie(req, res);

	if (!user) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	return {
		props: { user },
	};
}
