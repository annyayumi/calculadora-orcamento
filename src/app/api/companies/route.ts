import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Dados inválidos.' },
                { status: 400 }
            );
        }

        const { companyName, cnpj, slug, name, email, password } = parsed.data;

        const cnpjClean = cnpj.replace(/[^\d]/g, '');

        const slugExists = await prisma.company.findUnique({ where: { slug } });
        if (slugExists) {
            return NextResponse.json(
                { error: 'Este identificador já está em uso. Escolha outro.' },
                { status: 409 }
            );
        }

        const cnpjExists = await prisma.company.findUnique({
            where: { cnpj: cnpjClean },
        });
        if (cnpjExists) {
            return NextResponse.json(
                { error: 'Este CNPJ já está cadastrado.' },
                { status: 409 }
            );
        }

        const emailExists = await prisma.user.findUnique({ where: { email } });
        if (emailExists) {
            return NextResponse.json(
                { error: 'Este e-mail já está cadastrado.' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const company = await prisma.company.create({
            data: {
                name: companyName,
                cnpj: cnpjClean,
                slug,
                users: {
                    create: {
                        name,
                        email,
                        password: hashedPassword,
                        role: 'ADMIN',
                        code: generateCode(),
                    },
                },
            },
        });

        return NextResponse.json({ companyId: company.id }, { status: 201 });
    } catch (error) {
        console.error('[POST /api/companies]', error);
        return NextResponse.json(
            { error: 'Erro interno. Tente novamente.' },
            { status: 500 }
        );
    }
}

function generateCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const l = Array.from(
        { length: 3 },
        () => letters[Math.floor(Math.random() * 26)]
    ).join('');
    const d = Array.from(
        { length: 3 },
        () => digits[Math.floor(Math.random() * 10)]
    ).join('');
    return `${l}${d}`;
}
