import { render } from "@react-email/components";
import { createMailTransporter } from "./email";
import { PasswordResetEmail } from "./templates/PasswordResetEmail";

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  name: string,
  expiresInHours: number,
): Promise<void> {
  try {
    const transporter = createMailTransporter();

    const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${token}`;

    const emailHtml = await render(
      PasswordResetEmail({
        name,
        resetUrl,
        expiresIn: `${expiresInHours} óra`,
      })
    );

    const emailText = await render(
      PasswordResetEmail({
        name,
        resetUrl,
        expiresIn: `${expiresInHours} óra`,
      }),
      { plainText: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM!,
      to: to,
      subject: "Damareen Jelszó Visszaállítás",
      html: emailHtml,
      text: emailText,
    });
    
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}
