import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// Max allowed base64 size (approx 3.5MB string = ~2.6MB binary)
const MAX_BASE64_LENGTH = 3.5 * 1024 * 1024;

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('session_id')?.value;
    let user = null;

    if (sessionId) {
      const userId = parseInt(sessionId, 10);
      if (!isNaN(userId)) {
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
          },
        });
      }
    }

    if (!user) {
      // Fallback: look up the first ADMIN user or return default
      user = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
        },
      });
    }

    // Also get business setting avatar if user image is not set
    let fallbackAvatar: string | null = null;
    try {
      const setting = await prisma.businessSetting.findUnique({
        where: { id: 'default' },
      });
      fallbackAvatar = (setting as unknown as { adminAvatar?: string | null })?.adminAvatar || null;
    } catch {
      // ignore
    }

    const finalImage = user?.image || fallbackAvatar || null;

    return NextResponse.json({
      success: true,
      user: user
        ? { ...user, image: finalImage }
        : {
            id: 1,
            email: 'admin@comopetcare.com',
            name: 'Como Admin',
            role: 'ADMIN',
            image: finalImage,
          },
    });
  } catch (error) {
    logger.error('Failed to fetch admin profile', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error fetching profile' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('session_id')?.value;
    let body: { name?: string; email?: string; image?: string | null };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Malformed request payload' },
        { status: 400 },
      );
    }

    const { name, email, image } = body;

    // Validate image format and length if provided
    if (image !== undefined && image !== null && image !== '') {
      if (typeof image !== 'string') {
        return NextResponse.json(
          { success: false, message: 'Image must be a valid base64 data string.' },
          { status: 400 },
        );
      }

      if (image.length > MAX_BASE64_LENGTH) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Image exceeds maximum 2MB size limit. Please compress or choose a smaller image.',
          },
          { status: 400 },
        );
      }

      // Check if valid data URI
      if (
        !image.startsWith('data:image/') &&
        !image.startsWith('http://') &&
        !image.startsWith('https://') &&
        !image.startsWith('/assets/')
      ) {
        return NextResponse.json(
          { success: false, message: 'Invalid image format. Expected valid image data URI.' },
          { status: 400 },
        );
      }
    }

    let targetUserId: number | null = null;
    if (sessionId) {
      const parsed = parseInt(sessionId, 10);
      if (!isNaN(parsed)) targetUserId = parsed;
    }

    // If no session user, find first ADMIN
    if (!targetUserId) {
      const firstAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });
      if (firstAdmin) {
        targetUserId = firstAdmin.id;
      }
    }

    let updatedUser = null;

    if (targetUserId) {
      updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: {
          name: name !== undefined ? name.trim() : undefined,
          email:
            email !== undefined && email.includes('@') ? email.trim().toLowerCase() : undefined,
          image: image !== undefined ? (image ? image : null) : undefined,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
        },
      });
    }

    // Also sync to BusinessSetting adminAvatar
    if (image !== undefined) {
      try {
        await prisma.businessSetting.upsert({
          where: { id: 'default' },
          update: {
            adminAvatar: image ? image : null,
          },
          create: {
            adminAvatar: image ? image : null,
          },
        });
      } catch (err) {
        logger.warn('Failed to mirror avatar to business setting', err);
      }
    }

    // Log update
    try {
      await prisma.systemLog.create({
        data: {
          action: 'PROFILE_UPDATED',
          details: `Admin profile updated for ${updatedUser?.email || email || 'admin'}. Avatar: ${image ? 'Updated' : image === null ? 'Removed' : 'Unchanged'}.`,
        },
      });
    } catch {
      // Safe to ignore log error
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser || {
        id: targetUserId || 1,
        name: name || 'Como Admin',
        email: email || 'admin@comopetcare.com',
        role: 'ADMIN',
        image: image || null,
      },
    });
  } catch (error) {
    logger.error('Failed to update admin profile', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
