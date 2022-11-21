import altogic from '../../libs/altogic';
import { NextApiRequest, NextApiResponse } from 'next';
import { APIError } from 'altogic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
	const { appId, email, name, profilePicture, userId } = req.body;

	const { data, errors } = await altogic.db.model('users').create({
		appId,
		email,
		name,
		userId,
		profilePicture,
		password: crypto.randomUUID(),
	});

	if (errors && isEmailAlreadyRegistered(errors)) {
		return res.json({
			code: 'email_already_registered',
		});
	}

	res.status(200).json({ data, code: 'success' });
}

function isEmailAlreadyRegistered(errors: APIError) {
	// @ts-ignore
	return errors.items.some(error => error.code === 'not_unique' && error.details.field === 'email');
}
