import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
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
        >
            <body className="min-h-full flex flex-col antialiased">
                {children}
            </body>
        </html>
    );
}
