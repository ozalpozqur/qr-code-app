import altogic from '../../libs/altogic';
import { NextApiRequest, NextApiResponse } from 'next';
import { APIError } from 'altogic';
import axios from '../../libs/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
	const { appId } = req.body;

	const url = `https://api.altogic.com/dev-profile?appId=${appId}`;

	const { data } = await axios.get(url, {
		headers: {
			Authorization: process.env.ALTOGIC_JWT,
		},
	});

	if (data.error) {
		return res.status(404).json({ code: 'not_found' });
	}

	const { data: user, errors } = await createUser(data);

	if (errors && isUserAlreadyRegistered(errors)) {
		return res.status(400).json({
			code: 'email_already_registered',
		});
	}

	res.status(201).json({ user, code: 'success' });
}

function createUser(user: any) {
	const data = {
		appId: user.appId,
		email: user.email,
		name: user.username,
		userId: user.userId,
		...(user.imageURL && { profilePicture: user.imageURL }),
		signUpAt: user.memberSince,
		password: crypto.randomUUID(),
	};

	if (user.firstName) {
		data.name = user.firstName;
		if (user.lastName) {
			data.name += ` ${user.lastName}`;
		}
	}

	return altogic.db.model('users').create(data);
}

function isUserAlreadyRegistered(errors: APIError) {
	return errors.items.some(
		error =>
			error.code === 'not_unique' &&
			// @ts-ignore
			(error.details.field === 'email' || error.details.field === 'userId' || error.details.field === 'appId')
	);
}

function addUser() {}
