export function renderWelcomeEmail(name: string | null, siteUrl: string) {
  const displayName = name || 'there';
  const subject = 'Welcome to Codebuff — Let\'s ship ✨';

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
              
              <!-- Logo text -->
              <h1 style="margin:0 0 6px 0;font-size:22px;font-weight:700;color:#f0f0f5;letter-spacing:-0.02em;">Codebuff</h1>
              <p style="margin:0 0 28px 0;font-size:13px;color:#787890;line-height:1.5;">Ship production-grade code with AI</p>

              <!-- Divider -->
              <div style="height:1px;background:linear-gradient(90deg,rgba(124,92,252,0.3),transparent);margin-bottom:28px;"></div>

              <!-- Greeting -->
              <h2 style="margin:0 0 16px 0;font-size:20px;font-weight:600;color:#f0f0f5;letter-spacing:-0.01em;">Welcome, ${displayName}!</h2>
              <p style="margin:0 0 20px 0;font-size:15px;color:#a0a0b8;line-height:1.7;">
                You're now part of the Codebuff community. Start building production-grade code with AI that understands your entire codebase.
              </p>

              <!-- Features list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background:rgba(124,92,252,0.06);border-radius:8px;border:1px solid rgba(124,92,252,0.1);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="24" valign="top" style="font-size:14px;color:#7c5cfc;line-height:1.7;">◆</td>
                        <td style="font-size:14px;color:#c0c0d0;line-height:1.6;">AI-powered code generation tailored to your codebase</td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="font-size:14px;color:#7c5cfc;line-height:1.7;">◆</td>
                        <td style="font-size:14px;color:#c0c0d0;line-height:1.6;">Real-time collaboration with your team</td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="font-size:14px;color:#7c5cfc;line-height:1.7;">◆</td>
                        <td style="font-size:14px;color:#c0c0d0;line-height:1.6;">500 AI actions free on the Starter plan</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/dashboard" style="display:inline-block;padding:12px 32px;background:#7c5cfc;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:999px;letter-spacing:0.01em;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
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
