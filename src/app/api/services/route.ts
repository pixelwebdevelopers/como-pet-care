import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const DEFAULT_FALLBACK_SERVICES = [
  {
    id: 'drop_in_30',
    serviceId: '2',
    serviceName: 'Drop-In Visits',
    title: '30 Minute Visit',
    description:
      "A personalized 30-minute visit designed to keep your pet comfortable and cared for while you're away.",
    duration: '30 Minutes',
    basePrice: 34,
    priceText: '$34',
    status: 'active',
  },
  {
    id: 'drop_in_60',
    serviceId: '2',
    serviceName: 'Drop-In Visits',
    title: '60 Minute Visit',
    description:
      "A personalized 60-minute visit designed to keep your pet comfortable and cared for while you're away.",
    duration: '60 Minutes',
    basePrice: 44,
    priceText: '$44',
    status: 'active',
  },
  {
    id: 'sitting_half_day',
    serviceId: '3',
    serviceName: 'Pet Sitting',
    title: 'Half-Day Companion Visit',
    description: 'Up to 4 hours of personalized in-home care for your pet',
    duration: '4 Hours',
    basePrice: 69,
    priceText: '$69',
    status: 'active',
  },
  {
    id: 'sitting_full_day',
    serviceId: '3',
    serviceName: 'Pet Sitting',
    title: 'Full-Day Companion Visit',
    description: 'Up to 8 hours of personalized in-home care for your pet',
    duration: '8 Hours',
    basePrice: 99,
    priceText: '$99',
    status: 'active',
  },
  {
    id: 'sitting_overnight',
    serviceId: '3',
    serviceName: 'Pet Sitting',
    title: 'Overnight Stay',
    description: 'Full-day and overnight care for your pet',
    duration: 'Overnight',
    basePrice: 119,
    priceText: '$119/day',
    badge: 'Most popular',
    status: 'active',
  },
  {
    id: 'walk_30_onetime',
    serviceId: '4',
    serviceName: 'Dog Walking',
    title: 'One-Time Walk',
    description: 'Flexible single booking',
    duration: '30 Minutes',
    basePrice: 34,
    priceText: '$34 / walk',
    status: 'active',
  },
  {
    id: 'walk_30_weekly',
    serviceId: '4',
    serviceName: 'Dog Walking',
    title: 'Weekly Plan',
    description: 'Choose 1–5 walks each week with weekly billing',
    duration: '30 Minutes',
    basePrice: 29,
    priceText: 'From $29 / week',
    savingText: '(Save up to $51/Week)',
    status: 'active',
  },
  {
    id: 'walk_30_monthly',
    serviceId: '4',
    serviceName: 'Dog Walking',
    title: 'Monthly Plan',
    description: 'Choose 1–5 walks each week with monthly billing',
    duration: '30 Minutes',
    basePrice: 104,
    priceText: 'From $104 / month',
    savingText: '(Save up to $251/Month)',
    badge: 'Most popular',
    status: 'active',
  },
  {
    id: 'walk_30_annual',
    serviceId: '4',
    serviceName: 'Dog Walking',
    title: 'Annual Plan',
    description: 'Choose 1–5 walks each week with annual billing',
    duration: '30 Minutes',
    basePrice: 1149,
    priceText: 'From $1,149 / year',
    savingText: '(Save up to $3,211/Year)',
    status: 'active',
  },
  {
    id: 'walk_60_onetime',
    serviceId: '4',
    serviceName: 'Dog Walking',
    title: 'One-Time Walk',
    description: 'Flexible single booking',
    duration: '60 Minutes',
    basePrice: 44,
    priceText: '$44 / walk',
    status: 'active',
  },
  {
    id: 'walk_60_weekly',
    serviceId: '4',
    serviceName: 'Dog Walking',
    title: 'Weekly Plan',
    description: 'Choose 1–5 walks each week with weekly billing',
    duration: '60 Minutes',
    basePrice: 39,
    priceText: 'From $39 / week',
    savingText: '(Save up to $51/Week)',
    status: 'active',
  },
  {
    id: 'walk_60_monthly',
    serviceId: '4',
    serviceName: 'Dog Walking',
    title: 'Monthly Plan',
    description: 'Choose 1–5 walks each week with monthly billing',
    duration: '60 Minutes',
    basePrice: 144,
    priceText: 'From $144 / month',
    savingText: '(Save up to $251/Month)',
    badge: 'Most popular',
    status: 'active',
  },
  {
    id: 'walk_60_annual',
    serviceId: '4',
    serviceName: 'Dog Walking',
    title: 'Annual Plan',
    description: 'Choose 1–5 walks each week with annual billing',
    duration: '60 Minutes',
    basePrice: 1549,
    priceText: 'From $1,549 / year',
    savingText: '(Save up to $3,211/Year)',
    status: 'active',
  },
  {
    id: 'scoop_onetime',
    serviceId: '5',
    serviceName: 'Yard Poop Scooping',
    title: 'One-Time Cleanup',
    description: 'Perfect for spring cleanups, special events, or move-outs.',
    duration: 'Single Visit',
    basePrice: 65,
    priceText: '$65 One-Time',
    status: 'active',
  },
  {
    id: 'scoop_weekly',
    serviceId: '5',
    serviceName: 'Yard Poop Scooping',
    title: 'Weekly Plan',
    description: 'Enjoy a consistently clean yard with scheduled once-weekly cleanups.',
    duration: 'Recurring Weekly',
    basePrice: 29,
    priceText: 'From $29/Week',
    savingText: '(Save $20/Week)',
    status: 'active',
  },
  {
    id: 'scoop_monthly',
    serviceId: '5',
    serviceName: 'Yard Poop Scooping',
    title: 'Monthly Plan',
    description:
      'The same reliable once-weekly cleanups with convenient monthly billing and savings.',
    duration: 'Recurring Monthly',
    basePrice: 104,
    priceText: 'From $104/Month',
    savingText: '(Save up to $92/Month)',
    badge: 'Most popular',
    status: 'active',
  },
  {
    id: 'scoop_annual',
    serviceId: '5',
    serviceName: 'Yard Poop Scooping',
    title: 'Annual Plan',
    description:
      'Year-round, once-weekly cleanups for a consistently clean yard without the hassle.',
    duration: 'Recurring Annual',
    basePrice: 1054,
    priceText: 'From $1,054/year',
    savingText: '(Save up to $1,494/Year)',
    status: 'active',
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('serviceId');
  const status = searchParams.get('status');

  try {
    const where: Record<string, string> = {};
    if (serviceId) where.serviceId = serviceId;
    if (status && status !== 'all') where.status = status;

    const services = await prisma.serviceConfiguration.findMany({
      where,
      orderBy: [{ serviceId: 'asc' }, { id: 'asc' }],
    });

    if (services.length > 0) {
      return NextResponse.json({
        success: true,
        services,
      });
    }
  } catch (error: unknown) {
    logger.warn(
      'Prisma database connection unavailable, serving default services configuration',
      error,
    );
  }

  let filtered = DEFAULT_FALLBACK_SERVICES;
  if (serviceId) filtered = filtered.filter((s) => s.serviceId === serviceId);
  if (status && status !== 'all') filtered = filtered.filter((s) => s.status === status);

  return NextResponse.json({
    success: true,
    services: filtered,
  });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, duration, basePrice, priceText, savingText, badge, status } =
      body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service id is required.' },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {};
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
