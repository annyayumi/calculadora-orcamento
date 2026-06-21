// src/lib/email.ts
// Este arquivo contém a função para enviar e-mails de redefinição de senha usando o Resend.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/logotipo.png`;
    const currentYear = new Date().getFullYear();

    await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: email,
        subject: 'Redefinição de senha — YaGro',
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#E8F0E4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#E8F0E4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- Logo + Nome -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${logoUrl}" alt="YaGro" width="48" height="48" style="display:block;margin:0 auto 8px;border-radius:8px;" />
              <span style="font-size:20px;font-weight:700;color:#166534;">YaGro</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;padding:40px 36px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">Redefinir sua senha</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.
              </p>

              <!-- Button centralizado -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}"
                      style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;background:#16a34a;">
                      Redefinir senha
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
                <tr>
                  <td style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:12px 16px;">
                    <p style="margin:0;font-size:13px;color:#854d0e;">
                      ⏱ Este link expira em <strong>1 hora</strong>. Após esse prazo, solicite um novo.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px;">

              <!-- Fallback link -->
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">Se o botão não funcionar, copie e cole este link no navegador:</p>
              <p style="margin:0;font-size:12px;word-break:break-all;">
                <a href="${resetUrl}" style="color:#16a34a;">${resetUrl}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#4b7a3f;">
                Se você não solicitou a redefinição de senha, ignore este e-mail. Sua conta está segura.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#6b9e64;">© ${currentYear} YaGro</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    });
}
