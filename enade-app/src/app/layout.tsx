import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { headers } from 'next/headers';
import { AntdProvider } from '@/components/antd-provider';
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

	if (!user) {
		return (
			<html lang='pt-BR'>
				<body
					className={`${geist.className} bg-[#ece8fb] text-slate-900 antialiased`}
				>
					<AntdProvider>{children}</AntdProvider>
				</body>
			</html>
		);
	}

	return (
		<html lang='pt-BR'>
			<body className={`${geist.className} antialiased`}>
				<AntdProvider>
					<Shell user={{ name: user.name, role: user.role }} pathname={pathname}>
						{children}
					</Shell>
				</AntdProvider>
			</body>
		</html>
	);
}
