import { NextRequest, NextResponse } from 'next/server';
import { validateLogoFile, uploadLogo } from '@/lib/upload';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const slug = formData.get('slug') as string | null;

        if (!file || !slug) {
            return NextResponse.json(
                { error: 'Arquivo e identificador são obrigatórios.' },
                { status: 400 }
            );
        }

        const validationError = validateLogoFile(file);
        if (validationError) {
            return NextResponse.json(
                { error: validationError },
                { status: 400 }
            );
        }

        const url = await uploadLogo(file, slug);

        return NextResponse.json({ url }, { status: 201 });
    } catch (error) {
        console.error('[POST /api/upload/logo]', error);
        return NextResponse.json(
            { error: 'Erro ao fazer upload. Tente novamente.' },
            { status: 500 }
        );
    }
}
