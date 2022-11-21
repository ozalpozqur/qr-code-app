import { useRouter } from 'next/router';

export default function ReadQR() {
	const { userId } = useRouter().query;
	return (
		<div>
			<h1>Read QR</h1>
			{userId}
		</div>
	);
}
