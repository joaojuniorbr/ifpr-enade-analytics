import { cache } from 'react';
import { redirect } from 'next/navigation';
import { isAuth0Configured, adminEmails, getAuth0 } from '@/lib/auth0';

export type SessionUser = {
	id: string;
	email: string;
	name: string;
	role: 'ADMIN' | 'ALUNO';
};

type Identity = {
	sub: string;
	email?: string | null;
	email_verified?: boolean;
	name?: string | null;
	given_name?: string | null;
	nickname?: string | null;
};

function displayName(user: Identity, email: string): string {
	for (const value of [user.name, user.given_name, user.nickname]) {
		if (typeof value === 'string' && value.trim()) {
			return value.trim().slice(0, 120);
		}
	}
	const local = email.split('@')[0]?.trim();
	return (local || 'Aluno').slice(0, 120);
}

function userFromSession(user: Identity): SessionUser | null {
	const email = user.email?.trim().toLowerCase();
	const id = user.sub?.trim();
	if (!email || !id || id.length > 128 || user.email_verified === false)
		return null;

	return {
		id,
		email,
		name: displayName(user, email),
		role: adminEmails().includes(email) ? 'ADMIN' : 'ALUNO',
	};
}

export const getAuthSession = cache(async () => {
	if (!isAuth0Configured()) return null;
	return getAuth0().getSession();
});

export const getOptionalUser = cache(
	async (): Promise<SessionUser | null> => {
		const session = await getAuthSession();
		if (!session?.user) return null;
		return userFromSession(session.user);
	}
);

export async function requireUser(): Promise<SessionUser> {
	const user = await getOptionalUser();
	if (!user) redirect('/login');
	return user;
}

export async function requireAdmin(): Promise<SessionUser> {
	const user = await requireUser();
	if (user.role !== 'ADMIN') redirect('/');
	return user;
}
