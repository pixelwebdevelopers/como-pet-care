import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPublishedLegalDocuments } from '@/lib/legal-defaults';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure initial documents exist
    await getPublishedLegalDocuments();

    const allDocs = await prisma.legalDocument.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const termsDocs = allDocs.filter((d) => d.type === 'TERMS');
    const waiverDocs = allDocs.filter((d) => d.type === 'WAIVER');

    const termsCurrent = termsDocs.find((d) => d.status === 'PUBLISHED') || termsDocs[0];
    const waiverCurrent = waiverDocs.find((d) => d.status === 'PUBLISHED') || waiverDocs[0];

    // Acceptance statistics
    const totalAcceptances = await prisma.legalAcceptance.count();

    // Group acceptances count by versions
    const allAcceptances = await prisma.legalAcceptance.findMany({
      select: {
        id: true,
        termsVersion: true,
        waiverVersion: true,
        acceptedAt: true,
        signerLegalName: true,
        ipAddress: true,
        customerId: true,
        bookingId: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        booking: {
          select: {
            id: true,
            reference: true,
            serviceName: true,
            bookingDate: true,
          },
        },
      },
      orderBy: { acceptedAt: 'desc' },
      take: 50,
    });

    const termsVersionCounts: Record<string, number> = {};
    const waiverVersionCounts: Record<string, number> = {};

    const allAcceptanceRows = await prisma.legalAcceptance.findMany({
      select: { termsVersion: true, waiverVersion: true },
    });

    for (const acc of allAcceptanceRows) {
      termsVersionCounts[acc.termsVersion] = (termsVersionCounts[acc.termsVersion] || 0) + 1;
      waiverVersionCounts[acc.waiverVersion] = (waiverVersionCounts[acc.waiverVersion] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      termsCurrent,
      waiverCurrent,
      termsHistory: termsDocs,
      waiverHistory: waiverDocs,
      stats: {
        totalAcceptances,
        termsVersionCounts,
        waiverVersionCounts,
      },
      recentAcceptances: allAcceptances,
    });
  } catch (error) {
    console.error('Error fetching admin legal documents:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve legal agreements management data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type, // 'TERMS' | 'WAIVER'
      title,
      version, // e.g. 'v1.1'
      content,
      changeNotes,
      effectiveDate,
      status = 'PUBLISHED',
    } = body;

    if (!type || !version || !content) {
      return NextResponse.json(
        { success: false, message: 'Document type, version, and content are required.' },
        { status: 400 }
      );
    }

    const docType = type.toUpperCase();
    const docVersion = version.trim();

    // Check if this exact version already exists
    const existing = await prisma.legalDocument.findFirst({
      where: { type: docType, version: docVersion },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: `Version ${docVersion} of ${docType} already exists. Please specify a new version number (e.g. v1.1, v1.2) to maintain audit integrity.`,
        },
        { status: 409 }
      );
    }

    const now = new Date();
    const resolvedEffectiveDate =
      effectiveDate?.trim() ||
      now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Use Prisma transaction to archive old published version if new one is published
    const newDoc = await prisma.$transaction(async (tx) => {
      if (status === 'PUBLISHED') {
        // Archive previously published versions of this type
        await tx.legalDocument.updateMany({
          where: { type: docType, status: 'PUBLISHED' },
          data: { status: 'ARCHIVED' },
        });
      }

      return await tx.legalDocument.create({
        data: {
          type: docType,
          title: title || (docType === 'TERMS' ? 'Terms & Conditions' : 'Pet Care Waiver & Release of Liability'),
          version: docVersion,
          status,
          content,
          changeNotes: changeNotes?.trim() || null,
          effectiveDate: resolvedEffectiveDate,
          publishedAt: status === 'PUBLISHED' ? now : null,
        },
      });
    });

    await logger.info('SYSTEM_LEGAL_UPDATED', `Published new legal document version ${docType} ${docVersion}`);

    return NextResponse.json({
      success: true,
      document: newDoc,
      message: `Successfully published ${newDoc.title} ${newDoc.version}! Previous versions have been safely archived.`,
    });
  } catch (error) {
    console.error('Error publishing new legal document:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to publish legal document version.' },
      { status: 500 }
    );
  }
}
