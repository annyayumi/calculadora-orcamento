// src/components/layout/Header.tsx
// Header do dashboard com menu de usuário e logout

// src/components/layout/Header.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Menu, LogOut, User, Sun, Moon } from 'lucide-react';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
    onMenuClick: () => void;
    session: Session | null;
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Alternar tema"
        >
            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
}

export function Header({ onMenuClick, session }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-background border-b border-border">
            <button
                onClick={onMenuClick}
                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Abrir menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-1">
                <ThemeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 h-9 px-3"
                        >
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                                <User className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div className="hidden sm:flex flex-col items-start">
                                <span className="text-sm font-medium leading-none">
                                    {session?.user?.name}
                                </span>
                                <span className="text-xs text-muted-foreground leading-none mt-0.5">
                                    {session?.user?.code}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">
                                    {session?.user?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {session?.user?.email}
                                </span>
                                <span className="text-xs font-mono text-muted-foreground">
                                    {session?.user?.code}
                                </span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a
                                href="/dashboard/profile"
                                className="cursor-pointer"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Meu perfil
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
