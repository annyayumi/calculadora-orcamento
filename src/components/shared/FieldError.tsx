// src/components/shared/FieldError.tsx
// Componente para exibir mensagens de erro em formulários

import { CircleX } from 'lucide-react';

interface FieldErrorProps {
    message?: string;
    size?: 'sm' | 'md';
}

export function FieldError({ message, size = 'sm' }: FieldErrorProps) {
    if (!message) return null;

    const isLarge = size === 'md';

    return (
        <div
            className={`flex items-center gap-1.5 text-destructive bg-destructive/10 px-3 rounded-md ${isLarge ? 'text-sm py-2.5 border border-destructive/20 gap-2' : 'text-xs py-1.5'}`}
        >
            <CircleX width={isLarge ? 15 : 13} height={isLarge ? 15 : 13} />
            {message}
        </div>
    );
}
