import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deleteTime } from '@/app/admin/tempo/actions';
import { Messages, AdminTable } from '@/components/admin-table';
import { FormDrawer } from '@/components/form-drawer';
import { TimeFields } from '@/components/forms/time-fields';
import { formatDate } from '@/lib/dates';
import { withForm } from '@/lib/forms';
import { prisma } from '@/lib/prisma';
import { primaryButton } from '@/lib/styles';

export const metadata = { title: 'Tempo' };

export default async function TimePage({
	searchParams,
}: {
	searchParams: Promise<{ notice?: string; error?: string; form?: string }>;
}) {
	const params = await searchParams;
	const timeRecords = await prisma.dim_Tempo.findMany({
		orderBy: { Data: 'asc' },
	});
	const creating = params.form === 'novo';
	const editingKey = Number(params.form);
	const editing = timeRecords.find(
		(timeRecord) => timeRecord.TempoKey === editingKey
	);
	if (params.form && !creating && !editing) notFound();

	return (
		<div className='space-y-4'>
			<div className='flex flex-wrap items-end justify-between gap-3'>
				<div>
					<h1 className='text-2xl font-semibold text-slate-900'>Tempo</h1>
					<p className='mt-1 text-sm text-slate-600'>
						Dim_Tempo. Uma linha por data de aplicação.
					</p>
				</div>
				<Link
					href={withForm('/admin/tempo', params, 'novo')}
					className={primaryButton}
				>
					Incluir
				</Link>
			</div>
			<Messages
				notice={params.notice}
				error={creating || editing ? undefined : params.error}
			/>
			<AdminTable
				headers={['Chave', 'Data', 'Ano', 'Mês', 'Semana']}
				deleteAction={deleteTime}
				rows={timeRecords.map((timeRecord) => ({
					id: String(timeRecord.TempoKey),
					href: withForm('/admin/tempo', params, String(timeRecord.TempoKey)),
					columns: [
						String(timeRecord.TempoKey),
						formatDate(timeRecord.Data),
						String(timeRecord.Ano),
						timeRecord.NomeMes,
						String(timeRecord.SemanaSemestre),
					],
				}))}
			/>
			<FormDrawer
				open={creating || Boolean(editing)}
				title={editing ? 'Editar data' : 'Incluir data'}
				closeHref={withForm('/admin/tempo', params)}
			>
				<Messages error={params.error} />
				<div className='mt-4'>
					<TimeFields timeRecord={editing} />
				</div>
			</FormDrawer>
		</div>
	);
}
