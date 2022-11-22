import altogic from '../libs/altogic';
import { GetServerSidePropsContext } from 'next';
import { APIError } from 'altogic';

interface Props {
	errors: APIError | null;
}
export default function AuthRedirect({ errors }: Props) {
	return (
		<section className="h-screen flex flex-col gap-4 justify-center items-center">
			{errors && (
				<div className="text-center">
					{errors.items?.map((error, index) => (
						<p className="text-red-500 text-3xl" key={index}>
							{error.message}
						</p>
					))}
				</div>
			)}
		</section>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { access_token } = context.query as { access_token: string };
	const { user, session } = await altogic.auth.getAuthGrant(access_token);

	if (user && session) {
		altogic.auth.setSessionCookie(session.token, context.req, context.res);
		altogic.auth.setSession(session);

		return {
			redirect: {
				destination: '/profile',
				permanent: false,
			},
		};
	}

	return {
		redirect: {
			destination: '/login',
			permanent: false,
		},
	};
}
