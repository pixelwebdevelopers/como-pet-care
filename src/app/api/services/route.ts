import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');
    const status = searchParams.get('status');

    const where: any = {};
    if (serviceId) where.serviceId = serviceId;
    if (status && status !== 'all') where.status = status;

    const services = await prisma.serviceConfiguration.findMany({
      where,
      orderBy: [
        { serviceId: 'asc' },
        { id: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error: unknown) {
    logger.error('Failed to fetch services', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      duration,
      basePrice,
      priceText,
      savingText,
      badge,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service id is required.' },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice);
    if (priceText !== undefined) updateData.priceText = priceText;
    if (savingText !== undefined) updateData.savingText = savingText;
    if (badge !== undefined) updateData.badge = badge;
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.serviceConfiguration.update({
      where: { id },
      data: updateData,
    });

    // Record system log
    try {
      await prisma.systemLog.create({
        data: {
          action: 'SERVICE_UPDATED',
          details: `Service plan ${updated.id} (${updated.title}) updated: BasePrice=$${Number(updated.basePrice).toFixed(2)}, PriceText=${updated.priceText}, Status=${updated.status}`,
        },
      });
    } catch {
      // safe to ignore
    }

    return NextResponse.json({
      success: true,
      service: updated,
    });
  } catch (error: unknown) {
    logger.error('Failed to update service configuration', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
