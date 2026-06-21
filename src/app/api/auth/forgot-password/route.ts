import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'E-mail é obrigatório.' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Sempre retorna sucesso para não revelar se o e-mail existe
        if (!user) {
            return NextResponse.json({ success: true });
        }

        // Invalida tokens anteriores do mesmo e-mail
        await prisma.passwordResetToken.deleteMany({ where: { email } });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        await prisma.passwordResetToken.create({
            data: { token, email, expiresAt },
        });

        await sendPasswordResetEmail(email, token);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[POST /api/auth/forgot-password]', error);
        return NextResponse.json(
            { error: 'Erro interno. Tente novamente.' },
            { status: 500 }
        );
    }
}
