import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, emailTemplates } from '@/lib/mail';
import { getRateLimiter, getClientIp } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Zod schema for input validation
const emailRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please provide a valid email address'),
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters long')
    .max(1000, 'Message cannot exceed 1000 characters'),
});

// Configure sliding-window rate limit: max 3 requests per minute per IP
const rateLimiter = getRateLimiter('test-email-limiter', {
  limit: 3,
  windowMs: 60 * 1000,
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Enforce Rate Limiting
  if (rateLimiter.isRateLimited(ip)) {
    logger.warn(`Rate limit triggered for sending test email from IP: ${ip}`);
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again after 60 seconds.' },
      { status: 429 },
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    // 2. Validate Inputs
    const validation = emailRequestSchema.safeParse(body);
    if (!validation.success) {
      logger.warn(`Input validation failed for test email request from IP ${ip}`);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { name, email, message } = validation.data;

    // 3. Render HTML template and send email
    const welcomeHtml = emailTemplates.welcome(name, message);
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to Como Pet Care!',
      html: welcomeHtml,
    });

    if (!result.success) {
      logger.error(`SMTP delivery failed for recipient ${email}`);
      return NextResponse.json(
        { error: 'Failed to dispatch email. Please check SMTP configuration.' },
        { status: 502 },
      );
    }

    // 4. Log the action to Database
    try {
      await prisma.systemLog.create({
        data: {
          action: 'SEND_TEST_EMAIL',
          details: `Successfully sent test welcome email to ${email} (${name}). MessageId: ${result.messageId}`,
          ipAddress: ip,
        },
      });
    } catch (dbError) {
      // Log the database error but do not fail the email dispatch response
      logger.error('Failed to write system log to database', dbError);
    }

    // 5. Respond to client
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: result.messageId,
    });
  } catch (error) {
    logger.error('Unexpected error in /api/send-test-email route', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
