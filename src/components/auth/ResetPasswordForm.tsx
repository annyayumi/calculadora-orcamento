'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
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
import { PasswordInput } from '../shared/PasswordInput';
import { ShieldCheck } from 'lucide-react';

const schema = z
    .object({
        password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });

type FormData = z.infer<typeof schema>;

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: FormData) {
        if (!token) {
            setError('Token inválido. Solicite um novo link.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: data.password }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error ?? 'Erro ao redefinir senha.');
                return;
            }

            router.push('/login?reset=success');
        } catch {
            setError('Erro inesperado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md p-5 border-primary/20 shadow-2xl">
            <CardHeader className="text-center mb-4">
                <CardTitle className="text-2xl font-bold">
                    <ShieldCheck className="inline-block text-primary mr-2 -translate-y-px" />
                    Nova senha
                </CardTitle>
                <CardDescription>
                    Escolha uma senha segura com ao menos 8 caracteres.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nova senha</Label>
                        <PasswordInput
                            id="password"
                            placeholder="Mínimo 8 caracteres"
                            {...register('password')}
                        />
                        <FieldError message={errors.password?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirmar nova senha
                        </Label>
                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Repita a senha"
                            {...register('confirmPassword')}
                        />
                        <FieldError message={errors.confirmPassword?.message} />
                    </div>

                    <FieldError message={error ?? undefined} size="md" />

                    <Button
                        type="submit"
                        className="w-full py-5"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Salvando...' : 'Redefinir senha'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
