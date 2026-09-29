import Link from 'next/link';
import { logoutUrl } from '@/lib/auth0';
import { wordmarkClass } from '@/lib/styles';

type ShellUser = { name: string; role: 'ADMIN' | 'ALUNO' } | null;

const adminLinks = [
	{ href: '/admin', label: 'Acompanhamento' },
	{ href: '/admin/questoes', label: 'Questões' },
	{ href: '/admin/simulados', label: 'Simulados' },
	{ href: '/admin/alunos', label: 'Alunos' },
	{ href: '/admin/tempo', label: 'Tempo' },
	{ href: '/admin/respostas', label: 'Respostas' },
];

const studentLinks = [
	{ href: '/', label: 'Simulados' },
	{ href: '/evolucao', label: 'Evolução' },
];

export function Shell({
	user,
	pathname,
	children,
}: {
	user: ShellUser;
	pathname: string;
	children: React.ReactNode;
}) {
	const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;
	const home = user?.role === 'ADMIN' ? '/admin' : '/';

	return (
		<div className='min-h-dvh bg-[#eef1ea] text-slate-900'>
			<div className='flex min-h-dvh'>
				<aside className='sticky top-0 hidden h-dvh w-56 shrink-0 flex-col px-4 py-6 md:flex'>
					<Link href={home} className={`px-3 ${wordmarkClass}`}>
						ENADE
					</Link>
					<nav className='mt-8 flex flex-1 flex-col gap-1'>
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={navClass(pathname, link.href)}
							>
								{link.label}
							</Link>
						))}
					</nav>
					<Account user={user} />
				</aside>

				<div className='min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8'>
					<div className='mb-6 md:hidden'>
						<div className='flex items-center justify-between'>
							<Link href={home} className={wordmarkClass}>
								ENADE
							</Link>
							{user ? (
								<a href={logoutUrl()} className='text-sm text-slate-700'>
									Sair
								</a>
							) : (
								<Link href='/login' className='text-sm text-slate-700'>
									Entrar
								</Link>
							)}
						</div>
						<nav className='mt-4 flex gap-2 overflow-x-auto'>
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`${navClass(pathname, link.href)} shrink-0`}
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
}

function Account({ user }: { user: ShellUser }) {
	return (
		<div className='mt-6'>
			<p className='px-2 text-xs text-slate-400'>Preparação ENADE 2026</p>
			{user ? (
				<>
					<div className='mt-3 rounded-2xl bg-[#e6ebe3] px-3 py-3'>
						<p className='truncate text-sm font-semibold text-slate-900'>
							{user.name}
						</p>
						<p className='text-xs text-slate-500'>
							{user.role === 'ADMIN' ? 'Administrador' : 'Aluno'}
						</p>
					</div>
					<a
						href={logoutUrl()}
						className='mt-3 inline-block px-2 text-sm text-slate-700'
					>
						Sair
					</a>
				</>
			) : (
				<Link href='/login' className='mt-3 inline-block px-2 text-sm text-slate-700'>
					Entrar
				</Link>
			)}
		</div>
	);
}

function navClass(pathname: string, href: string) {
	const active =
		href === '/' || href === '/admin'
			? pathname === href
			: pathname === href || pathname.startsWith(`${href}/`);
	return active
		? 'rounded-lg bg-[#dce8d6] px-3 py-2.5 text-sm font-medium text-slate-900'
		: 'rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-[#e7ebe4]';
}
