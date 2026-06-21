import { put, del } from '@vercel/blob';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function validateLogoFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Formato inválido. Use PNG, JPG ou SVG.';
    }
    if (file.size > MAX_SIZE_BYTES) {
        return 'Arquivo muito grande. O limite é 2MB.';
    }
    return null;
}

export async function uploadLogo(file: File, slug: string): Promise<string> {
    const extension = file.name.split('.').pop();
    const filename = `logos/${slug}-${Date.now()}.${extension}`;

    const blob = await put(filename, file, {
        access: 'private',
        contentType: file.type,
    });

    return blob.url;
}

export async function deleteLogo(url: string): Promise<void> {
    try {
        await del(url);
    } catch {
        console.error('Erro ao deletar logo:', url);
    }
}
