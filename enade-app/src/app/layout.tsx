import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { headers } from 'next/headers';
import { Shell } from '@/components/shell';
import { getOptionalUser } from '@/lib/auth';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: {
		default: 'ENADE Analytics',
		template: '%s · ENADE Analytics',
	},
	description: 'Aplicação de simulados para preparação ao ENADE.',
	robots: { index: false, follow: false },
};

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = (await headers()).get('x-pathname') ?? '';
	const user = pathname === '/login' ? null : await getOptionalUser();

	if (pathname === '/login') {
		return (
			<html lang='pt-BR'>
				<body
					className={`${geist.className} bg-[#ece8fb] text-slate-900 antialiased`}
				>
					{children}
				</body>
			</html>
		);
	}

	return (
		<html lang='pt-BR'>
			<body className={`${geist.className} antialiased`}>
				<Shell
					user={user ? { name: user.name, role: user.role } : null}
					pathname={pathname}
				>
					{children}
				</Shell>
			</body>
		</html>
	);
}
