// src/components/auth/LoginForm.tsx
// Formulário de login para autenticação de usuários

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
import { LogIn } from 'lucide-react';
import { FieldError } from '../shared/FieldError';
import { PasswordInput } from '../shared/PasswordInput';

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('E-mail ou senha incorretos. Verifique seus dados.');
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch {
            setError('Erro inesperado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-lg p-5 border-primary/20 shadow-2xl">
            <CardHeader className="text-center mb-4">
                <CardTitle className="text-2xl font-bold">
                    {' '}
                    <LogIn className="inline-block text-primary mr-2 -translate-y-px" />{' '}
                    Entrar
                </CardTitle>
                <CardDescription>
                    Acesse sua conta para gerar orçamentos
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail:</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemplo@empresa.com.br"
                            {...register('email')}
                        />
                        <FieldError message={errors.email?.message} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha:</Label>
                            <a
                                href="/forgot-password"
                                className="text-xs text-muted-foreground hover:text-primary"
                            >
                                Esqueceu a senha?
                            </a>
                        </div>
                        <PasswordInput
                            id="password"
                            placeholder="Sua senha"
                            {...register('password')}
                        />
                        <FieldError message={errors.password?.message} />
                    </div>

                    <FieldError message={error ?? undefined} size="md" />

                    <Button
                        type="submit"
                        className="w-full py-5"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Não tem uma conta?{' '}
                        <a
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            Criar conta
                        </a>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
