// src/proxy.ts
// Middleware para proteger rotas e redirecionar usuários com base no estado de autenticação

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthRoute =
        req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/register') ||
        req.nextUrl.pathname.startsWith('/forgot-password');

    if (!isLoggedIn && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
