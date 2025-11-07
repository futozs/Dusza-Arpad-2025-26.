import { render } from "@react-email/components";
import { createMailTransporter } from "./email";
import { VerificationEmail } from "./templates/VerificationEmail";
import { text } from "stream/consumers";

export async function sendVerificationEmail(
  to: string,
  token: string,
  name: string,
  expiresInHours: number,
): Promise<void> {
  try {
    const transporter = createMailTransporter();

    const verificationUrl = `${process.env.APP_URL}/verify?token=${token}`;

    const emailHtml = await render(
      VerificationEmail({
        name,
        verificationUrl,
        expiresIn: `${expiresInHours} óra`,
      })
    );

    const emailText = await render(
      VerificationEmail({
        name,
        verificationUrl,
        expiresIn: `${expiresInHours} óra`,
      }),
      { plainText: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM!,
      to: to,
      subject: "Damareen Email Verification",
      html: emailHtml
    });
    
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
