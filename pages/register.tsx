import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { APIError } from 'altogic';
import Logo from '../components/Logo';
import axios from '../libs/axios';
import { GetServerSidePropsContext } from 'next';
import altogic from '../libs/altogic';
import Head from 'next/head';

export default function Register() {
	const router = useRouter();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<APIError | null>(null);
	const [loading, setLoading] = useState(false);
	const [isNeedVerify, setIsNeedVerify] = useState(false);

	async function submitHandler(e: FormEvent) {
		e.preventDefault();
		setLoading(true);
		setErrors(null);
		const { data } = await axios.post('/api/auth/register', {
			name,
			email,
			password,
		});
		const { user, session, errors } = data;
		setLoading(false);
		if (errors) {
			setErrors(errors);
			return;
		}
		if (!session) {
			setIsNeedVerify(true);
			setName('');
			setEmail('');
			setPassword('');
			return;
		}
		if (user && session) {
			await router.push('/profile');
		}
	}

	return (
		<section className="flex flex-col items-center justify-center h-96 gap-4">
			<Head>
				<title>Register Page - Altogic</title>
			</Head>
			<Logo className="h-16" />
			<form className="flex flex-col gap-2 w-full md:w-96" onSubmit={submitHandler}>
				<h1 className="self-start text-3xl font-bold">Create an account</h1>
				{errors &&
					errors.items.map(({ message }) => (
						<div key={message} className="bg-red-600 text-white text-[13px] p-2">
							<p>{message}</p>
						</div>
					))}
				{isNeedVerify && (
					<div className="bg-green-500 text-white p-2">
						Hesabınız başarıyla oluşturuldu. Lütfen e-posta adresinize gelen doğrulama bağlantısına
						tıklayarak hesabınızı doğrulayın.
					</div>
				)}
				<input
					value={name}
					onChange={e => setName(e.target.value)}
					type="text"
					placeholder="Type your name"
					required
				/>
				<input
					value={email}
					onChange={e => setEmail(e.target.value)}
					type="email"
					placeholder="Type your email"
					required
				/>
				<input
					value={password}
					onChange={e => setPassword(e.target.value)}
					autoComplete="new-password"
					type="password"
					placeholder="Type your password"
					required
				/>
				<div className="flex justify-between gap-4">
					<Link className="text-indigo-600" href="/login">
						Already have an account?
					</Link>
					<button
						type="submit"
						className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
						disabled={loading}
					>
						Create account
					</button>
				</div>
			</form>
		</section>
	);
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { user } = await altogic.auth.getUserFromDBbyCookie(context.req, context.res);

	if (user) {
		return {
			redirect: {
				destination: '/profile',
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}
