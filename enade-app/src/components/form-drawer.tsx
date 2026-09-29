'use client';

import { Drawer } from 'antd';
import { useRouter } from 'next/navigation';

export function FormDrawer({
	open,
	title,
	closeHref,
	children,
}: {
	open: boolean;
	title: string;
	closeHref: string;
	children: React.ReactNode;
}) {
	const router = useRouter();

	return (
		<Drawer
			title={title}
			open={open}
			destroyOnHidden
			onClose={() => router.push(closeHref)}
		>
			{open ? children : null}
		</Drawer>
	);
}
