import { createClient } from 'altogic';
import type { User as AltogicUser } from 'altogic';

const ENV_URL = 'https://zkye-u9w7.c3-na.altogic.com';
const CLIENT_KEY = '405df63307ab43e4af931ba463a88452';

const altogic = createClient(ENV_URL, CLIENT_KEY, {
	signInRedirect: '/login',
});

export interface User extends AltogicUser {
	userId: string;
	appId: string;
	hasReceived: boolean;
	receivedAt: string;
}

export default altogic;
