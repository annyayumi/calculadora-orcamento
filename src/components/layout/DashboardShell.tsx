// src/components/layout/DashboardShell.tsx
// Componente de layout do dashboard, incluindo sidebar e header

'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardShellProps {
    children: React.ReactNode;
    session: Session | null;
}

export function DashboardShell({ children, session }: DashboardShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-dvh overflow-hidden bg-background">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                session={session}
            />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    session={session}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
