import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main className="container mx-auto px-4 min-h-full grid">
			<Component {...pageProps} />
		</main>
	);
}
