import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
    token: z.string().min(1),
    password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Dados inválidos.' },
                { status: 400 }
            );
        }

        const { token, password } = parsed.data;

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Link inválido.' },
                { status: 400 }
            );
        }

        if (resetToken.usedAt) {
            return NextResponse.json(
                { error: 'Este link já foi utilizado.' },
                { status: 400 }
            );
        }

        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json(
                { error: 'Este link expirou. Solicite um novo.' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
        });

        // Invalida o token após uso
        await prisma.passwordResetToken.update({
            where: { token },
            data: { usedAt: new Date() },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[POST /api/auth/reset-password]', error);
        return NextResponse.json(
            { error: 'Erro interno. Tente novamente.' },
            { status: 500 }
        );
    }
}
