import { GetServerSidePropsContext } from 'next';
import altogic from '../libs/altogic';
import type { User } from 'altogic';

interface ProfileProps {
	user: User;
}
export default function Profile({ user }: ProfileProps) {
	console.log(user);
	return (
		<section>
			<h1>Profile Page {user?.name} </h1>
			<pre>{JSON.stringify(user, null, 2)}</pre>
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
