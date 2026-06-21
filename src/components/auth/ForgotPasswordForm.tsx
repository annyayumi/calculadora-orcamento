'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldError } from '../shared/FieldError';
import { KeyRound } from 'lucide-react';

const schema = z.object({
    email: z.string().email('E-mail inválido'),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error ?? 'Erro ao enviar e-mail.');
                return;
            }

            setSent(true);
        } catch {
            setError('Erro inesperado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    if (sent) {
        return (
            <Card className="w-full max-w-md p-5 border-primary/20 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        E-mail enviado!
                    </CardTitle>
                    <CardDescription>
                        Se este e-mail estiver cadastrado, você receberá um link
                        para redefinir sua senha em instantes. Verifique também
                        a caixa de spam.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <a
                        href="/login"
                        className="block text-center text-sm text-primary hover:underline"
                    >
                        Voltar para o login
                    </a>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md p-5 border-primary/20 shadow-2xl">
            <CardHeader className="text-center mb-4">
                <CardTitle className="text-2xl font-bold">
                    <KeyRound className="inline-block text-primary mr-2 -translate-y-px" />
                    Esqueceu a senha?
                </CardTitle>
                <CardDescription>
                    Digite seu e-mail e enviaremos um link para redefinir sua
                    senha.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemplo@empresa.com.br"
                            {...register('email')}
                        />
                        <FieldError message={errors.email?.message} />
                    </div>

                    <FieldError message={error ?? undefined} size="md" />

                    <Button
                        type="submit"
                        className="w-full py-5"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Enviando...'
                            : 'Enviar link de redefinição'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Lembrou a senha?{' '}
                        <a
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Voltar para o login
                        </a>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
