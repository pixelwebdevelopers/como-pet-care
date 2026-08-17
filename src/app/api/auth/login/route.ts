import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import * as crypto from 'crypto';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn(`Auth failed: User not found for email: ${email}`);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Verify hashed password
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      logger.warn(`Auth failed: Incorrect password for email: ${email}`);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Create session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-Only Session Cookie
    response.cookies.set('session_id', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    logger.info(`User authenticated successfully: ${user.email} (Role: ${user.role})`);
    return response;
  } catch (error) {
    logger.error('Unexpected error in /api/auth/login route', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
