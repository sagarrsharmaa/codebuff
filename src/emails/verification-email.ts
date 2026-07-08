export function renderVerificationEmail(to: string, verifyUrl: string, siteUrl: string) {
  const subject = 'Verify your email address — Codebuff';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
</head>
<body style="margin:0;padding:0;background-color:#07070d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07070d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
          <!-- Header gradient line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#7c5cfc,#3bc9db);border-radius:2px 2px 0 0;"></td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:linear-gradient(135deg,#12121a 0%,#0e0e15 100%);border:1px solid rgba(124,92,252,0.15);border-top:none;padding:40px 36px;border-radius:0 0 12px 12px;">
              
              <h1 style="margin:0 0 6px 0;font-size:22px;font-weight:700;color:#f0f0f5;letter-spacing:-0.02em;">Codebuff</h1>
              <p style="margin:0 0 28px 0;font-size:13px;color:#787890;">Verify your email</p>

              <div style="height:1px;background:linear-gradient(90deg,rgba(59,201,219,0.3),transparent);margin-bottom:28px;"></div>

              <h2 style="margin:0 0 16px 0;font-size:20px;font-weight:600;color:#f0f0f5;">Verify your email address</h2>
              <p style="margin:0 0 20px 0;font-size:15px;color:#a0a0b8;line-height:1.7;">
                Thanks for signing up! Please verify your email address by clicking the button below. This helps us keep your account secure.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center" style="padding:12px 16px;background:rgba(59,201,219,0.05);border-radius:8px;border:1px solid rgba(59,201,219,0.1);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="font-size:13px;color:#787890;margin-bottom:4px;">Verifying for</td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:15px;font-weight:600;color:#c0c0d0;">${to}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display:inline-block;padding:12px 32px;background:#3bc9db;color:#07070d;font-size:14px;font-weight:700;text-decoration:none;border-radius:999px;letter-spacing:0.01em;">
                      Verify Email →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0;font-size:13px;color:#585870;line-height:1.6;">
                Or copy and paste this link into your browser:<br>
                <a href="${verifyUrl}" style="color:#3bc9db;text-decoration:none;word-break:break-all;font-size:12px;">${verifyUrl}</a>
              </p>

              <p style="margin:20px 0 0 0;font-size:12px;color:#585870;line-height:1.5;">
                This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>

              <div style="height:1px;background:rgba(255,255,255,0.06);margin:28px 0 16px 0;"></div>
              <p style="margin:0;font-size:12px;color:#585870;line-height:1.5;">
                Codebuff, Inc. · San Francisco, CA<br>
                <a href="${siteUrl}" style="color:#7c5cfc;text-decoration:none;">codebuff.ai</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, subject };
}
