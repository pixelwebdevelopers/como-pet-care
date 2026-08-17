import nodemailer from 'nodemailer';
import { env } from './env';
import { logger } from './logger';

// Initialize Nodemailer transporter with validated configuration
export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE, // true for port 465, false for other ports
  ...(env.SMTP_USER && env.SMTP_PASS
    ? {
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      }
    : {}),
});

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Reusable utility to send emails. Wraps calls in try/catch to avoid throwing errors.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailArgs) {
  try {
    const mailOptions = {
      from: env.SMTP_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for fallback text version
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Error sending email to ${to}:`, error);
    return { success: false, error };
  }
}

/**
 * Standard templates catalog for application emails
 */
export const emailTemplates = {
  welcome: (name: string, messageContent: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Como Pet Care</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #4f46e5;
            padding: 32px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
          }
          .content {
            padding: 32px;
          }
          .content h2 {
            margin-top: 0;
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
          }
          .message-box {
            background-color: #f1f5f9;
            border-left: 4px solid #4f46e5;
            padding: 16px;
            margin: 24px 0;
            font-style: italic;
            border-radius: 0 8px 8px 0;
            color: #334155;
          }
          .button {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            font-weight: 600;
            border-radius: 8px;
            margin-top: 16px;
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Como Pet Care</h1>
          </div>
          <div class="content">
            <h2>Welcome aboard, ${name}!</h2>
            <p>Thank you for initiating your integration setup with Como Pet Care. Everything is configured and ready to roll.</p>
            <div class="message-box">
              "${messageContent}"
            </div>
            <p>This is a live transactional email sent from your configured SMTP server showing the HTML templates architecture.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Como Pet Care. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  otp: (code: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your Password — Como Pet Care</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #123f3c;
            padding: 32px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
          }
          .content {
            padding: 32px;
            text-align: center;
          }
          .content h2 {
            margin-top: 0;
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
          }
          .otp-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 0.25em;
            color: #b18a45;
            background-color: #f7f4ed;
            padding: 16px 24px;
            border-radius: 8px;
            display: inline-block;
            margin: 24px auto;
            border: 1px dashed rgba(177, 138, 69, 0.3);
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Como Pet Care</h1>
          </div>
          <div class="content">
            <h2>Reset your Password</h2>
            <p>Please use the following 6-digit verification code to reset your password. This code will expire in 10 minutes.</p>
            <div class="otp-code">${code}</div>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Como Pet Care. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
};
