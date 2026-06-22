// src/proxy.ts
// Middleware para proteger rotas e redirecionar usuários com base no estado de autenticação

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const roleRoutes: Record<string, string[]> = {
    '/dashboard/it': ['IT_SUPPORT'],
    '/dashboard/users': ['ADMIN'],
    '/dashboard/logs': ['ADMIN', 'IT_SUPPORT'],
    '/dashboard/products/edit': ['ADMIN'],
    '/dashboard/settings': ['ADMIN'],
};

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const pathname = req.nextUrl.pathname;

    const isAuthRoute =
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password');

    if (!isLoggedIn && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (isLoggedIn) {
        const role = req.auth?.user?.role;

        for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
            if (pathname.startsWith(route)) {
                if (!role || !allowedRoles.includes(role)) {
                    return NextResponse.json(
                        { error: 'Acesso negado.' },
                        { status: 403 }
                    );
                }
            }
        }
    }
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
