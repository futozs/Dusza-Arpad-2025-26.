import { render } from "@react-email/components";
import { createMailTransporter } from "./email";
import { LoginAlert } from "./templates/LoginAlert";

interface LoginAlertData {
  to: string;
  name: string;
  loginTime: string;
  loginDate: string;
  ipAddress?: string;
  location?: string;
  device?: string;
  browser?: string;
}

export async function sendLoginAlertEmail(data: LoginAlertData): Promise<void> {
  try {
    const transporter = createMailTransporter();

    const securityUrl = `${process.env.APP_URL}/dashboard/settings`;

    const emailHtml = await render(
      LoginAlert({
        name: data.name,
        loginTime: data.loginTime,
        loginDate: data.loginDate,
        ipAddress: data.ipAddress || 'Ismeretlen',
        location: data.location || 'Ismeretlen',
        device: data.device || 'Ismeretlen eszköz',
        browser: data.browser || 'Ismeretlen böngésző',
        securityUrl,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@damareen.hu',
        company: 'Damareen',
      })
    );

    const emailText = await render(
      LoginAlert({
        name: data.name,
        loginTime: data.loginTime,
        loginDate: data.loginDate,
        ipAddress: data.ipAddress || 'Ismeretlen',
        location: data.location || 'Ismeretlen',
        device: data.device || 'Ismeretlen eszköz',
        browser: data.browser || 'Ismeretlen böngésző',
        securityUrl,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@damareen.hu',
        company: 'Damareen',
      }),
      { plainText: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM!,
      to: data.to,
      subject: "🔐 Új bejelentkezés a Damareen fiókodba",
      html: emailHtml,
      text: emailText,
    });

    console.log(`Login alert email sent to: ${data.to}`);
  } catch (error) {
    console.error("Error sending login alert email:", error);
    // Don't throw - we don't want to break login if email fails
  }
}
