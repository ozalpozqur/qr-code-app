import { NextApiRequest, NextApiResponse } from 'next';
import altogic from '../../../libs/altogic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ errors: { items: [{ message: 'Method not allowed' }] } });
	const { email, password, name } = req.body;

	const domain = email.split('@')[1];

	if (domain.trim() !== 'altogic.com') {
		return res.status(400).json({ errors: { items: [{ message: 'Invalid email' }] } });
	}

	const { user, session, errors } = await altogic.auth.signUpWithEmail(email, password, name);
	if (errors) return res.status(errors.status).json({ errors });

	if (session) {
		altogic.auth.setSessionCookie(session.token, req, res);
		altogic.auth.setSession(session);
		return res.json({ user, session });
	}
	return res.json({ user });
}
