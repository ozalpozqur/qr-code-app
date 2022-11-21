import Logo from '../components/Logo';
import GenerateQR from '../components/GenerateQR';

export default function Home() {
	return (
		<section className="flex flex-col gap-3 sm:gap-6 py-6">
			<Logo className="h-16" />
			<GenerateQR />
		</section>
	);
}
