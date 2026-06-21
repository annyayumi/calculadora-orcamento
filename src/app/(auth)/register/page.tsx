// src/app/(auth)/register/page.tsx
// página da rota /register

import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-secondary ">
            <RegisterForm />
        </main>
    );
}
