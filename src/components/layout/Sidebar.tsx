// src/components/layout/Sidebar.tsx
// Sidebar responsivo para navegação lateral no dashboard

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session | null;
}

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['ADMIN', 'IT_SUPPORT', 'COLLABORATOR'],
    },
];

export function Sidebar({ isOpen, onClose, session }: SidebarProps) {
    const pathname = usePathname();
    const role = session?.user?.role;

    const filteredItems = navItems.filter((item) =>
        item.roles.includes(role ?? '')
    );

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-64 flex flex-col',
                    'bg-sidebar border-r border-sidebar-border',
                    'transition-transform duration-200 ease-in-out',
                    'lg:translate-x-0 lg:static lg:z-auto',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex items-center justify-between gap-3 px-5 h-14 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logotipo.png"
                            alt="YaGro"
                            width={32}
                            height={32}
                            className="rounded-md"
                        />
                        <span className="font-semibold text-sidebar-foreground text-lg">
                            YaGro
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
                        aria-label="Fechar menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {filteredItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                )}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4 py-4 border-t border-sidebar-border">
                    {session?.user?.companyLogo ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md overflow-hidden border border-sidebar-border shrink-0 bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={session.user.companyLogo}
                                    alt="Logo da empresa"
                                    className="w-full h-full object-contain p-0.5"
                                />
                            </div>
                            <span className="text-xs text-sidebar-foreground/60 truncate">
                                {role === 'ADMIN' && 'Administrador'}
                                {role === 'IT_SUPPORT' && 'Suporte TI'}
                                {role === 'COLLABORATOR' && 'Colaborador'}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-sidebar-foreground/50 uppercase tracking-wider">
                            {role === 'ADMIN' && 'Administrador'}
                            {role === 'IT_SUPPORT' && 'Suporte TI'}
                            {role === 'COLLABORATOR' && 'Colaborador'}
                        </span>
                    )}
                </div>
            </aside>
        </>
    );
}
