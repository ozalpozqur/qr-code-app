import { NextApiRequest, NextApiResponse } from 'next';
import altogic from '../../../libs/altogic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	altogic.auth.removeSessionCookie(req, res);
	return res.redirect('/login');
}
