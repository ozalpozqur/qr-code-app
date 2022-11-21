import { ImageResponse } from '@vercel/og';
import { NextApiRequest } from 'next';
import OgImage from '../../components/OGImage';

export const config = {
	runtime: 'experimental-edge',
};

export default function handle(req: NextApiRequest) {
	const { searchParams } = new URL(req.url || '');
	const userId = searchParams.get('userId');

	if (!userId) {
		return new Response('Missing userId', { status: 400 });
	}

	return new ImageResponse(<OgImage title={userId} />, {
		width: 1200,
		height: 627,
	});
}
