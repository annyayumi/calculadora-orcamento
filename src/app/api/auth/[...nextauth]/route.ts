// src/app/api/auth/[...nextauth]/route.ts
// Rota de autenticação usando NextAuth.js

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
