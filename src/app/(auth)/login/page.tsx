// src/app/(auth)/login/page.tsx
// Página de login para autenticação de usuários

import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-secondary ">
            <LoginForm />
        </main>
    );
}
