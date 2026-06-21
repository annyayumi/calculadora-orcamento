// src/types/next-auth.d.ts
// Extensão de tipos para NextAuth

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            companyId: string;
            code: string;
        } & DefaultSession['user'];
    }
}
