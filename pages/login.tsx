import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import type { APIError } from 'altogic';
import Logo from '../components/Logo';

function Login() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<APIError | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const { errors, user, session } = await response.json();
			if (errors) {
				setErrors(errors);
			} else {
				await router.push('/profile');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="flex flex-col items-center py-6 h-96 gap-4">
			<Logo className="h-16" />
			<form className="flex flex-col gap-2 w-full md:w-96" onSubmit={handleSubmit}>
				<h1 className="self-start text-3xl font-bold">Login to your account</h1>
				{errors &&
					errors.items?.map(({ message }) => (
						<div key={message} className="bg-red-600 text-white text-[13px] p-2">
							<p>{message}</p>
						</div>
					))}
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
				<div className="flex justify-end gap-4">
					<button
						type="submit"
						className="border self py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
						disabled={loading}
					>
						Login
					</button>
				</div>
			</form>
		</section>
	);
}

export default Login;
