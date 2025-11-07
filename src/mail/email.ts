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

  const requireTLS = config.port === 587;
  console.log('[mail] transporter', `host=${config.host}`, `port=${config.port}`, `secure=${config.secure}`, `requireTLS=${requireTLS}`);
  
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465, false for other ports
    requireTLS: requireTLS, // Only use STARTTLS for port 587
    auth: {
      user: config.user,
      pass: config.password,
    },
    tls: {
      // Allow connections to servers with self-signed certificates
      rejectUnauthorized: false, // Disable cert validation for development
      minVersion: 'TLSv1.2', // Ensure minimum TLS version
    },
    connectionTimeout: 15000, // 15 seconds timeout
    greetingTimeout: 15000, // 15 seconds timeout for greeting
    socketTimeout: 15000, // 15 seconds socket timeout
    debug: process.env.NODE_ENV !== 'production', // Enable debug mode in development
    logger: process.env.NODE_ENV !== 'production', // Enable logging in development
  });
};
