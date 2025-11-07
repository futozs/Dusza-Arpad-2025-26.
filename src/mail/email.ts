import nodemailer from 'nodemailer';

interface MailcowConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
}

// Create reusable transporter
export const createMailTransporter = () => {
  const config: MailcowConfig = {
    host: process.env.MAILCOW_HOST!,
    port: parseInt(process.env.MAILCOW_PORT || '587'),
    user: process.env.MAILCOW_USER!,
    password: process.env.MAILCOW_PASSWORD!,
    secure: process.env.MAILCOW_SECURE === 'true',
  };

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: true, // Force TLS upgrade for port 587
    auth: {
      user: config.user,
      pass: config.password,
    },
    tls: {
      // Allow connections to servers with self-signed certificates
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
};
