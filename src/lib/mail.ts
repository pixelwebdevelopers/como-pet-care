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

  customerBookingConfirmation: (data: {
    clientName: string;
    reference: string;
    serviceName: string;
    planTitle?: string;
    bookingDate: string;
    startTime: string;
    endTime?: string;
    petNames: string;
    address: string;
    totalPrice: string;
    paymentStatus: string;
    notes?: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed — Como Pet Care</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7f4ed;
            color: #1c2524;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .wrapper {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #efe7d8;
            box-shadow: 0 10px 25px -5px rgba(18, 63, 60, 0.08);
          }
          .header {
            background-color: #123f3c;
            padding: 36px 32px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .header p {
            margin: 8px 0 0 0;
            color: #d1dfdc;
            font-size: 14px;
          }
          .badge-ref {
            display: inline-block;
            background-color: rgba(177, 138, 69, 0.2);
            border: 1px solid #b18a45;
            color: #f5eee3;
            font-weight: 700;
            font-size: 13px;
            padding: 4px 14px;
            border-radius: 20px;
            margin-top: 14px;
            letter-spacing: 0.05em;
          }
          .body-content {
            padding: 32px;
          }
          .greeting {
            font-size: 20px;
            font-weight: 700;
            color: #123f3c;
            margin-top: 0;
            margin-bottom: 12px;
          }
          .card-box {
            background-color: #fbf9f4;
            border: 1px solid #efe7d8;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
          }
          .info-table td {
            padding: 8px 0;
            font-size: 14px;
            vertical-align: top;
          }
          .info-label {
            color: #6b7280;
            font-weight: 500;
            width: 40%;
          }
          .info-value {
            color: #1c2524;
            font-weight: 600;
            text-align: right;
          }
          .total-row td {
            padding-top: 14px;
            border-top: 1px dashed #efe7d8;
            font-size: 16px;
            font-weight: 700;
            color: #123f3c;
          }
          .status-chip {
            background-color: #e6edea;
            color: #123f3c;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
          }
          .notice-box {
            background-color: #fdfbf7;
            border-left: 4px solid #b18a45;
            padding: 14px 16px;
            border-radius: 0 8px 8px 0;
            margin: 24px 0;
            font-size: 13.5px;
            color: #574624;
          }
          .footer {
            background-color: #123f3c;
            color: #d1dfdc;
            padding: 24px 32px;
            text-align: center;
            font-size: 12px;
            border-top: 1px solid #efe7d8;
          }
          .footer a {
            color: #f5eee3;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>CoMo Pet Care</h1>
            <p>Premium In-Home Pet Sitting &amp; Dog Walking</p>
            <div class="badge-ref">REFERENCE #${data.reference}</div>
          </div>

          <div class="body-content">
            <h2 class="greeting">Hi ${data.clientName},</h2>
            <p>We are delighted to confirm that your booking with CoMo Pet Care has been received and scheduled. Below are your full appointment details:</p>

            <div class="card-box">
              <table class="info-table">
                <tr>
                  <td class="info-label">Service:</td>
                  <td class="info-value">${data.serviceName} ${data.planTitle ? `(${data.planTitle})` : ''}</td>
                </tr>
                <tr>
                  <td class="info-label">Date:</td>
                  <td class="info-value">${data.bookingDate}</td>
                </tr>
                <tr>
                  <td class="info-label">Scheduled Time:</td>
                  <td class="info-value">${data.startTime}${data.endTime ? ` – ${data.endTime}` : ''}</td>
                </tr>
                <tr>
                  <td class="info-label">Pet(s):</td>
                  <td class="info-value">🐾 ${data.petNames}</td>
                </tr>
                <tr>
                  <td class="info-label">Service Location:</td>
                  <td class="info-value">${data.address}</td>
                </tr>
                <tr>
                  <td class="info-label">Payment Status:</td>
                  <td class="info-value"><span class="status-chip">${data.paymentStatus}</span></td>
                </tr>
                <tr class="total-row">
                  <td>Total Price:</td>
                  <td class="info-value" style="color: #123f3c; font-size: 17px;">${data.totalPrice}</td>
                </tr>
              </table>
            </div>

            ${
              data.notes
                ? `<div style="font-size: 13px; color: #6b7280; margin: 12px 0;"><strong>Special Instructions:</strong> ${data.notes}</div>`
                : ''
            }

            <div class="notice-box">
              <strong>What Happens Next?</strong><br>
              Our care specialists are preparing for your pet's visit. If this is your first time booking with us, our team will coordinate your complimentary Meet &amp; Greet before service begins.
            </div>

            <p style="font-size: 13.5px; color: #4b5563;">
              Have questions or need to make adjustments? Reply directly to this email or call us at <strong>(555) 256-2648</strong>.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0 0 6px 0;"><strong>CoMo Pet Care LLC</strong> — Columbia, MO</p>
            <p style="margin: 0;">Providing loving, professional pet care right where your animals are most comfortable.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  adminBookingAlert: (data: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    reference: string;
    serviceName: string;
    planTitle?: string;
    bookingDate: string;
    startTime: string;
    endTime?: string;
    petNames: string;
    address: string;
    totalPrice: string;
    paymentStatus: string;
    isColumbiaResident?: boolean;
    notes?: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Alert — Como Pet Care Admin</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f1f5f9;
            color: #0f172a;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .wrapper {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #0f2d2b;
            padding: 28px 32px;
            color: #ffffff;
          }
          .alert-pill {
            display: inline-block;
            background-color: #b18a45;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
          }
          .content {
            padding: 28px 32px;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
          }
          .data-table td {
            padding: 8px 10px;
            font-size: 13.5px;
            border-bottom: 1px solid #f1f5f9;
          }
          .label {
            color: #64748b;
            font-weight: 600;
            width: 35%;
          }
          .value {
            color: #0f172a;
            font-weight: 600;
          }
          .footer {
            background-color: #f8fafc;
            padding: 16px 32px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <span class="alert-pill">Admin Operational Alert</span>
            <h1>New Booking Created: #${data.reference}</h1>
          </div>

          <div class="content">
            <p style="margin-top: 0; font-size: 14px; color: #334155;">
              A new pet care appointment has been placed online. Details below:
            </p>

            <table class="data-table">
              <tr>
                <td class="label">Customer:</td>
                <td class="value">${data.clientName}</td>
              </tr>
              <tr>
                <td class="label">Email:</td>
                <td class="value"><a href="mailto:${data.clientEmail}">${data.clientEmail}</a></td>
              </tr>
              <tr>
                <td class="label">Phone:</td>
                <td class="value"><a href="tel:${data.clientPhone}">${data.clientPhone}</a></td>
              </tr>
              <tr>
                <td class="label">Service:</td>
                <td class="value">${data.serviceName} ${data.planTitle ? `(${data.planTitle})` : ''}</td>
              </tr>
              <tr>
                <td class="label">Date &amp; Time:</td>
                <td class="value">${data.bookingDate} at ${data.startTime}${data.endTime ? ` – ${data.endTime}` : ''}</td>
              </tr>
              <tr>
                <td class="label">Pet(s):</td>
                <td class="value">🐾 ${data.petNames}</td>
              </tr>
              <tr>
                <td class="label">Location:</td>
                <td class="value">${data.address} ${data.isColumbiaResident ? '(Columbia Resident ✓)' : ''}</td>
              </tr>
              <tr>
                <td class="label">Financial Total:</td>
                <td class="value" style="color: #123f3c; font-size: 15px;">${data.totalPrice}</td>
              </tr>
              <tr>
                <td class="label">Payment Status:</td>
                <td class="value">${data.paymentStatus}</td>
              </tr>
              ${
                data.notes
                  ? `<tr><td class="label">Special Notes:</td><td class="value">${data.notes}</td></tr>`
                  : ''
              }
            </table>
          </div>

          <div class="footer">
            CoMo Pet Care Admin System Notification
          </div>
        </div>
      </body>
    </html>
  `,

  customerIntakeReminder: (data: {
    clientName: string;
    reference: string;
    petNames: string;
    intakeUrl: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Action Required: Pet Care Intake Form — Como Pet Care</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7f4ed;
            color: #1c2524;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .wrapper {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #efe7d8;
            box-shadow: 0 10px 25px -5px rgba(18, 63, 60, 0.08);
          }
          .header {
            background-color: #123f3c;
            padding: 36px 32px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .header p {
            margin: 8px 0 0 0;
            color: #d1dfdc;
            font-size: 14px;
          }
          .badge-alert {
            display: inline-block;
            background-color: rgba(177, 138, 69, 0.2);
            border: 1px solid #b18a45;
            color: #f5eee3;
            font-weight: 700;
            font-size: 12px;
            padding: 4px 14px;
            border-radius: 20px;
            margin-top: 12px;
            letter-spacing: 0.05em;
          }
          .content {
            padding: 36px 32px;
          }
          .btn-cta {
            display: inline-block;
            background-color: #b18a45;
            color: #ffffff !important;
            font-size: 15px;
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(177, 138, 69, 0.25);
          }
          .checklist {
            background-color: #fbf9f4;
            border: 1px solid #efe7d8;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .footer {
            background-color: #f7f4ed;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #efe7d8;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>CoMo Pet Care</h1>
            <p>Action Required: Pet Care Intake Form</p>
            <div class="badge-alert">BOOKING REF: ${data.reference}</div>
          </div>
          <div class="content">
            <h2>Hello ${data.clientName},</h2>
            <p>
              We are getting ready for your upcoming pet care visits with <strong>${data.petNames}</strong>!
              Before our visits can begin, our team requires all pet parents to complete our secure <strong>Pet Care Intake Form</strong>.
            </p>

            <div class="checklist">
              <p style="margin: 0 0 10px 0; font-weight: 700; color: #123f3c; font-size: 14px;">
                Why this is required before service:
              </p>
              <div style="margin-bottom: 8px;">🩺 <strong>Veterinary &amp; Emergency:</strong> Attending clinic, emergency phone, and medical authorization.</div>
              <div style="margin-bottom: 8px;">💊 <strong>Health &amp; Routines:</strong> Medication schedules, feeding instructions, and temperament notes.</div>
              <div>🔑 <strong>Home Entry:</strong> Secure door/garage codes, key lockbox instructions, and parking details.</div>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${data.intakeUrl}" class="btn-cta" target="_blank">
                Complete Your Intake Form Now &rarr;
              </a>
              <p style="font-size: 12px; color: #888; margin-top: 8px;">Takes approximately 3 minutes to complete securely.</p>
            </div>

            <p style="font-size: 13px; color: #555;">
              If you have any questions or require assistance, please reply to this email or call our team directly at <strong>(555) 256-2648</strong>.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} CoMo Pet Care &bull; Columbia, MO &bull; Professional In-Home Pet Sitting &amp; Dog Walking
          </div>
        </div>
      </body>
    </html>
  `,

  customerMeetAndGreetMissed: (data: {
    clientName: string;
    reference: string;
    petNames: string;
    serviceName: string;
    rescheduleUrl: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>We Missed You! Let's Reschedule Your Meet & Greet — Como Pet Care</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7f4ed;
            color: #1c2524;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .wrapper {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #efe7d8;
            box-shadow: 0 10px 25px -5px rgba(18, 63, 60, 0.08);
          }
          .header {
            background-color: #123f3c;
            padding: 36px 32px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .header p {
            margin: 8px 0 0 0;
            color: #d1dfdc;
            font-size: 14px;
          }
          .badge-alert {
            display: inline-block;
            background-color: rgba(177, 138, 69, 0.2);
            border: 1px solid #b18a45;
            color: #f5eee3;
            font-weight: 700;
            font-size: 12px;
            padding: 4px 14px;
            border-radius: 20px;
            margin-top: 12px;
            letter-spacing: 0.05em;
          }
          .content {
            padding: 36px 32px;
          }
          .btn-cta {
            display: inline-block;
            background-color: #123f3c;
            color: #ffffff !important;
            font-size: 15px;
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(18, 63, 60, 0.25);
          }
          .info-card {
            background-color: #fbf9f4;
            border: 1px solid #efe7d8;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .footer {
            background-color: #f7f4ed;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #efe7d8;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>CoMo Pet Care</h1>
            <p>Meet &amp; Greet Reschedule Notice</p>
            <div class="badge-alert">BOOKING REF: ${data.reference}</div>
          </div>
          <div class="content">
            <h2>Hi ${data.clientName},</h2>
            <p>
              We missed you at our scheduled Meet &amp; Greet session for <strong>${data.petNames}</strong>! We know life gets busy and unexpected things pop up.
            </p>
            <p>
              Because your pet's comfort, security, and well-being are paramount, our team conducts a complimentary 15-minute Meet &amp; Greet before providing <strong>${data.serviceName}</strong>. This allows our sitter to get acquainted with ${data.petNames} in your home and verify care routines.
            </p>

            <div class="info-card">
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #123f3c;">
                Ready to reschedule?
              </p>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #555;">
                Select a new convenient date and time window using our booking portal, or call our team directly.
              </p>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${data.rescheduleUrl}" class="btn-cta" target="_blank">
                Reschedule Meet &amp; Greet &rarr;
              </a>
            </div>

            <p style="font-size: 13.5px; color: #555;">
              Prefer to reschedule over the phone? Call us at <strong>(555) 256-2648</strong> or reply directly to this email.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} CoMo Pet Care &bull; Columbia, MO &bull; Professional In-Home Pet Care
          </div>
        </div>
      </body>
    </html>
  `,
};

