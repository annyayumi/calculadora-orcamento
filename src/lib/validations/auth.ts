// src/lib/validations/auth.ts
// Schema Zod de validação

import { z } from 'zod';

function validarCNPJ(cnpj: string) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj[i]) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(cnpj[12]) !== digit) return false;

    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj[i]) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return parseInt(cnpj[13]) === digit;
}

export const registerSchema = z
    .object({
        companyName: z
            .string()
            .min(2, 'Nome da empresa deve ter ao menos 2 caracteres'),
        cnpj: z
            .string()
            .min(1, 'CNPJ é obrigatório')
            .refine((val) => validarCNPJ(val), 'CNPJ inválido'),
        slug: z
            .string()
            .min(2, 'Identificador deve ter ao menos 2 caracteres')
            .max(30, 'Identificador deve ter no máximo 30 caracteres')
            .regex(
                /^[a-z0-9-]+$/,
                'Use apenas letras minúsculas, números e hífens'
            ),
        logoUrl: z.string().url().optional(),
        name: z.string().min(2, 'Seu nome deve ter ao menos 2 caracteres'),
        email: z.string().email('E-mail inválido'),
        password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;
