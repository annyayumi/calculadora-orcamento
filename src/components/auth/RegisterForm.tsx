'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Info, Sprout } from 'lucide-react';

export function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoError, setLogoError] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            setLogoError('Formato inválido. Use PNG, JPG ou SVG.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setLogoError('Arquivo muito grande. O limite é 2MB.');
            return;
        }

        setLogoError(null);
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    }

    async function onSubmit(data: RegisterFormData) {
        setIsLoading(true);
        setError(null);

        try {
            let logoUrl: string | undefined;

            if (logoFile) {
                const formData = new FormData();
                formData.append('file', logoFile);
                formData.append('slug', data.slug);

                const uploadRes = await fetch('/api/upload/logo', {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadRes.json();

                if (!uploadRes.ok) {
                    setError(
                        uploadData.error ?? 'Erro ao fazer upload da logo.'
                    );
                    return;
                }

                logoUrl = uploadData.url;
            }
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, logoUrl }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error ?? 'Erro ao criar conta. Tente novamente.'
                );
                return;
            }

            router.push('/dashboard');
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
                    <Sprout className="inline-block text-primary mr-2 -translate-y-px" />
                    Criar conta
                </CardTitle>
                <CardDescription>
                    Cadastre a sua empresa e comece a gerar orçamentos em
                    segundos.
                </CardDescription>
                <p className="text-xs italic text-muted-foreground border-t border-border pt-3 mt-1">
                    * Todos os campos devem ser preenchidos.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Nome da empresa:</Label>
                        <Input
                            id="companyName"
                            placeholder="Exemplo Distribuidora Ltda"
                            {...register('companyName')}
                        />
                        {errors.companyName && (
                            <p className="text-sm text-destructive">
                                {errors.companyName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ:</Label>
                        <Input
                            id="cnpj"
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                            {...register('cnpj')}
                            onChange={(e) => {
                                const digits = e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 14);
                                const formatted = digits
                                    .replace(/^(\d{2})(\d)/, '$1.$2')
                                    .replace(
                                        /^(\d{2})\.(\d{3})(\d)/,
                                        '$1.$2.$3'
                                    )
                                    .replace(/\.(\d{3})(\d)/, '.$1/$2')
                                    .replace(/(\d{4})(\d)/, '$1-$2');
                                setValue('cnpj', formatted);
                                e.target.value = formatted;
                            }}
                        />
                        {errors.cnpj && (
                            <p className="text-sm text-destructive">
                                {errors.cnpj.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="slug"
                            className="inline-flex items-center gap-1 leading-none"
                        >
                            Identificador único
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="inline-flex cursor-help text-muted-foreground translate-y-px">
                                        <Info className="h-3.5 w-3.5" />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Escolha um identificador único para sua
                                        empresa. Ele será usado para gerar o
                                        endereço de acesso.
                                        <strong>
                                            Exemplo: yagro.com.br/sua-empresa
                                        </strong>
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Input
                            id="slug"
                            placeholder="exemplo-distribuidora"
                            {...register('slug')}
                            onChange={(e) =>
                                setValue(
                                    'slug',
                                    e.target.value
                                        .toLowerCase()
                                        .replace(/\s+/g, '-')
                                )
                            }
                        />
                        {errors.slug && (
                            <p className="text-sm text-destructive">
                                {errors.slug.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Logotipo da empresa{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                                (opcional)
                            </span>
                        </Label>

                        <div
                            onClick={() => logoInputRef.current?.click()}
                            className="flex items-center gap-3 w-full border border-dashed rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            {logoPreview ? (
                                <div className="relative w-12 h-12 rounded-md overflow-hidden border bg-muted shrink-0">
                                    <Image
                                        src={logoPreview}
                                        alt="Preview da logo"
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-md border bg-muted flex items-center justify-center shrink-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-muted-foreground"
                                    >
                                        <rect
                                            width="18"
                                            height="18"
                                            x="3"
                                            y="3"
                                            rx="2"
                                            ry="2"
                                        />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                </div>
                            )}

                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium">
                                    {logoPreview
                                        ? logoFile?.name
                                        : 'Clique para selecionar'}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {logoPreview
                                        ? 'Clique para trocar a imagem'
                                        : 'PNG, JPG ou SVG · máx. 2MB'}
                                </span>
                            </div>

                            {logoPreview && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLogoFile(null);
                                        setLogoPreview(null);
                                        if (logoInputRef.current)
                                            logoInputRef.current.value = '';
                                    }}
                                    className="ml-auto text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                    aria-label="Remover logo"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml"
                            className="hidden"
                            onChange={handleLogoChange}
                        />

                        {logoError && (
                            <p className="text-sm text-destructive">
                                {logoError}
                            </p>
                        )}
                    </div>

                    <hr className="my-8" />

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo:</Label>
                        <Input
                            id="name"
                            placeholder="Seu nome completo"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail:</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemplo@empresa.com.br"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha:</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirmar senha:
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Repita a senha"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full py-5"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Criando conta...' : 'Criar conta'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Já tem uma conta?{' '}
                        <a
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Entrar
                        </a>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
