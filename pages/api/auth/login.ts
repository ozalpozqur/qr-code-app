import { NextApiRequest, NextApiResponse } from 'next';
import altogic from '../../../libs/altogic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ errors: { items: [{ message: 'Method not allowed' }] } });

	const { email, password } = JSON.parse(req.body);
	const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);

	if (errors) return res.status(errors.status).json({ errors });
	if (!user || !session) return res.status(500).json({ errors: { items: [{ message: 'Something went wrong' }] } });

	altogic.auth.setSessionCookie(session.token, req, res);
	altogic.auth.setSession(session);
	res.status(200).json({ user, session });
}
