// src/app/layout.tsx
// Layout raiz do aplicativo, definindo a estrutura HTML e provendo o contexto de sessão para toda a aplicação

import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import './globals.css';

const fraunces = Fraunces({
    variable: '--font-display',
    subsets: ['latin'],
    axes: ['opsz'],
    display: 'swap',
});

const inter = Inter({
    variable: '--font-body',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'YA Orçamentos',
    description: 'Cálculo de orçamentos para produtores rurais',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-BR"
            className={`${fraunces.variable} ${inter.variable} h-full`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col antialiased">
                <SessionProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
