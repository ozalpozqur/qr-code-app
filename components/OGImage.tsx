import Logo from './Logo';

interface OgImageProps {
	title: string;
}
export default function OgImage({ title }: OgImageProps) {
	return (
		<section tw="bg-blue-500 flex flex-col items-center justify-center text-8xl w-full h-full text-white">
			<Logo />
			{title}
		</section>
	);
}
