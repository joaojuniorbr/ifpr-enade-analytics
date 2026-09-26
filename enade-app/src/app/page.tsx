import Image from 'next/image';
import Link from 'next/link';
import { DashboardCharts } from '@/components/dashboard-charts';
import { toChartPoints } from '@/lib/format';
import { getOptionalUser } from '@/lib/auth';
import { loadAdminDashboard } from '@/lib/dashboard';

export default async function Home() {
	const [user, dashboard] = await Promise.all([
		getOptionalUser(),
		loadAdminDashboard(),
	]);
	const firstName = user?.name.split(' ')[0];

	return (
		<div className='space-y-4'>
			<section className='grid items-center gap-6 overflow-hidden rounded-[28px] bg-[#6d4aff] p-6 text-white md:grid-cols-[1.3fr_0.7fr] md:p-8'>
				<div>
					<p className='text-sm text-white/75'>
						{firstName
							? `Bem-vindo de volta, ${firstName}`
							: 'Preparação ENADE 2026'}
					</p>
					<h1 className='mt-2 text-3xl font-semibold tracking-tight'>
						Modelo estrela do simulado
					</h1>
					<p className='mt-3 max-w-xl text-sm leading-6 text-white/80'>
						O banco guarda questão, aluno anônimo, tempo e simulado. A
						coordenação acompanha os acertos e mantém esses cadastros. O
						dashboard da disciplina continua no Power BI Desktop.
					</p>
					<div className='mt-5'>
						{user?.role === 'ADMIN' ? (
							<Link
								href='/admin'
								className='inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#6d4aff]'
							>
								Abrir acompanhamento
							</Link>
						) : user ? (
							<p className='text-sm text-white/80'>
								Sua conta entrou, mas o cadastro do modelo é só de
								administrador.
							</p>
						) : (
							<Link
								href='/login'
								className='inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#6d4aff]'
							>
								Entrar
							</Link>
						)}
					</div>
				</div>
				<Image
					src='/undraw-dados.svg'
					alt=''
					width={640}
					height={480}
					unoptimized
					className='mx-auto h-auto w-full max-w-xs rounded-3xl bg-white/95 p-4'
				/>
			</section>
			<DashboardCharts
				axes={toChartPoints(dashboard.byAxis)}
				classes={toChartPoints(dashboard.byClass)}
				exams={toChartPoints(dashboard.byExam)}
			/>
		</div>
	);
}
