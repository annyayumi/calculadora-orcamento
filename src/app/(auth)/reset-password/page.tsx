import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-secondary">
            <Suspense>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
}
