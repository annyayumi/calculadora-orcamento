// src/app/dashboard/layout.tsx
// Layout do dashboard, incluindo sidebar e header

import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    console.log('SESSION DEBUG:', JSON.stringify(session, null, 2));

    return (
        <SessionProvider session={session}>
            <DashboardShell session={session}>{children}</DashboardShell>
        </SessionProvider>
    );
}
