// src/components/shared/PasswordInput.tsx
// Componente de input de senha com funcionalidade de mostrar/ocultar senha
'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
}

export function PasswordInput({
    placeholder,
    id,
    ...props
}: PasswordInputProps) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <Input
                id={id}
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                className="pr-10"
                autoComplete={show ? 'off' : 'current-password'}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={show}
                aria-controls={id}
                tabIndex={0}
            >
                {show ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                )}
            </button>
        </div>
    );
}
