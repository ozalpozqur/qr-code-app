import { NextApiRequest, NextApiResponse } from 'next';
import altogic from '../../../libs/altogic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
	altogic.auth.removeSessionCookie(req, res);
	return res.redirect('/login');
}
