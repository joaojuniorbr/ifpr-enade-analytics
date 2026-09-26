import { Auth0Client } from '@auth0/nextjs-auth0/server';

function isSet(name: string): boolean {
	return Boolean(process.env[name]?.trim());
}

export function isAuth0Configured(): boolean {
	return (
		isSet('AUTH0_DOMAIN') &&
		isSet('AUTH0_CLIENT_ID') &&
		isSet('AUTH0_CLIENT_SECRET') &&
		isSet('AUTH0_SECRET') &&
		isSet('APP_BASE_URL')
	);
}

export function adminEmails(): string[] {
	return (process.env.ADMIN_EMAILS ?? '')
		.split(',')
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean);
}

export function logoutUrl(): string {
	const base =
		process.env.APP_BASE_URL?.split(',')[0]?.trim() || 'http://localhost:3000';
	const destination = new URL('/login', base).toString();
	return `/auth/logout?returnTo=${encodeURIComponent(destination)}`;
}

let client: Auth0Client | undefined;

export function getAuth0(): Auth0Client {
	if (!isAuth0Configured()) {
		throw new Error('Auth0 não configurado.');
	}
	if (!client) {
		client = new Auth0Client({
			enableAccessTokenEndpoint: false,
		});
	}
	return client;
}
