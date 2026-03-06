const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://moulna.ae";
const LOGO_URL = `${APP_URL}/moulna-logo-email.png`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapInLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Moulna</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f6f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f3;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <tr>
            <td style="padding:48px 40px;">
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${APP_URL}">
                  <img src="${LOGO_URL}" alt="Moulna" width="140" style="display:inline-block;height:47px;width:auto;" />
                </a>
              </div>
              ${content}
            </td>
          </tr>
        </table>
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
          <tr>
            <td style="text-align:center;padding:24px 0 0;">
              <p style="font-size:13px;color:#9ca3af;margin:0 0 4px;line-height:1.5;">This email was sent by <a href="${APP_URL}" style="color:#c7a34d;text-decoration:none;">Moulna</a></p>
              <p style="font-size:13px;color:#9ca3af;margin:0;line-height:1.5;">UAE's Premier Handmade & Artisan Marketplace</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function verifyEmailTemplate(code: string, name: string): string {
  return wrapInLayout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;border-radius:50%;margin:0 auto 20px;background:#fdf6e8;display:flex;align-items:center;justify-content:center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="#c7a34d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <h1 style="font-size:24px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 8px;">Verify your email</h1>
    <p style="font-size:15px;color:#6b7280;text-align:center;margin:0 0 32px;line-height:1.5;">Hi ${escapeHtml(name)}, enter this code to verify your email address and activate your Moulna account.</p>
    <div style="text-align:center;margin:0 0 32px;">
      <span style="display:inline-block;font-size:36px;font-weight:800;letter-spacing:8px;color:#1a1a1a;background:#f8f6f3;padding:16px 32px;border-radius:12px;border:2px dashed #c7a34d;font-family:'SF Mono','Fira Code',monospace;">${code}</span>
    </div>
    <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0 0 24px;">This code expires in <span style="color:#c7a34d;font-weight:600;">10 minutes</span></p>
    <div style="height:1px;background:#e5e7eb;margin:32px 0;"></div>
    <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0;">If you didn't create an account on Moulna, you can safely ignore this email.</p>
  `);
}

export function welcomeEmailTemplate(name: string): string {
  return wrapInLayout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:72px;height:72px;border-radius:50%;margin:0 auto 20px;background:linear-gradient(135deg,#c7a34d,#b8922e);display:flex;align-items:center;justify-content:center;">
        <span style="font-size:36px;line-height:1;">&#10003;</span>
      </div>
    </div>
    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;background:#c7a34d;color:#ffffff;font-size:13px;font-weight:700;padding:8px 20px;border-radius:100px;letter-spacing:0.5px;">+100 XP Welcome Bonus</span>
    </div>
    <h1 style="font-size:26px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 12px;">Welcome to Moulna!</h1>
    <p style="font-size:15px;color:#6b7280;text-align:center;margin:0 0 32px;line-height:1.6;">Hey ${escapeHtml(name)}, your email is verified and your account is ready. Start exploring unique handmade treasures from UAE artisans.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/dashboard" style="display:inline-block;padding:16px 48px;background-color:#c7a34d;color:#ffffff;text-align:center;text-decoration:none;border-radius:12px;font-size:16px;font-weight:700;mso-padding-alt:0;">Go to Dashboard</a>
        </td>
      </tr>
    </table>
    <div style="height:1px;background:#e5e7eb;margin:32px 0;"></div>
    <div style="text-align:center;">
      <p style="font-size:14px;color:#374151;margin:0 0 16px;font-weight:600;">What's next?</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f3;border-radius:10px;">
              <tr>
                <td style="padding:14px 16px;font-size:14px;color:#374151;">
                  <span style="font-size:20px;margin-right:10px;">&#128722;</span>Browse handmade products
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f3;border-radius:10px;">
              <tr>
                <td style="padding:14px 16px;font-size:14px;color:#374151;">
                  <span style="font-size:20px;margin-right:10px;">&#127942;</span>Complete challenges for XP
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f3;border-radius:10px;">
              <tr>
                <td style="padding:14px 16px;font-size:14px;color:#374151;">
                  <span style="font-size:20px;margin-right:10px;">&#11088;</span>Leave reviews & earn badges
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `);
}

export function passwordResetTemplate(code: string, name: string): string {
  return wrapInLayout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;border-radius:50%;margin:0 auto 20px;background:#fee2e2;display:flex;align-items:center;justify-content:center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#ef4444" stroke-width="2"/>
          <path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1" fill="#ef4444"/>
        </svg>
      </div>
    </div>
    <h1 style="font-size:24px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 8px;">Reset your password</h1>
    <p style="font-size:15px;color:#6b7280;text-align:center;margin:0 0 32px;line-height:1.5;">Hi ${escapeHtml(name)}, we received a request to reset your password. Use this code to set a new one.</p>
    <div style="text-align:center;margin:0 0 32px;">
      <span style="display:inline-block;font-size:36px;font-weight:800;letter-spacing:8px;color:#1a1a1a;background:#f8f6f3;padding:16px 32px;border-radius:12px;border:2px dashed #c7a34d;font-family:'SF Mono','Fira Code',monospace;">${code}</span>
    </div>
    <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0 0 24px;">This code expires in <span style="color:#c7a34d;font-weight:600;">10 minutes</span></p>
    <div style="height:1px;background:#e5e7eb;margin:32px 0;"></div>
    <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0;">If you didn't request a password reset, please ignore this email or contact support if you're concerned.</p>
  `);
}
