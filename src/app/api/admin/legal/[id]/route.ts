import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docId = parseInt(id, 10);

    if (isNaN(docId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid document ID.' },
        { status: 400 }
      );
    }

    const document = await prisma.legalDocument.findUnique({
      where: { id: docId },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: 'Document version not found.' },
        { status: 404 }
      );
    }

    // Fetch acceptances tied to this version
    const acceptances = await prisma.legalAcceptance.findMany({
      where:
        document.type === 'TERMS'
          ? { termsVersion: document.version }
          : { waiverVersion: document.version },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        booking: {
          select: {
            id: true,
            reference: true,
            serviceName: true,
            bookingDate: true,
            totalPrice: true,
          },
        },
      },
      orderBy: { acceptedAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      document,
      acceptances,
      totalCount: acceptances.length,
    });
  } catch (error) {
    console.error('Error fetching legal document details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve document details.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docId = parseInt(id, 10);

    if (isNaN(docId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid document ID.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { changeNotes, effectiveDate, title } = body;

    const updated = await prisma.legalDocument.update({
      where: { id: docId },
      data: {
        ...(title ? { title } : {}),
        ...(changeNotes !== undefined ? { changeNotes } : {}),
        ...(effectiveDate ? { effectiveDate } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      document: updated,
      message: 'Document details updated successfully.',
    });
  } catch (error) {
    console.error('Error updating document details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update document details.' },
      { status: 500 }
    );
  }
}
