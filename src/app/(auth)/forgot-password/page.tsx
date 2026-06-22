// src/app/(auth)/forgot-password/page.tsx
// Página de redefinição de senha

import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-secondary">
            <ForgotPasswordForm />
        </main>
    );
}
