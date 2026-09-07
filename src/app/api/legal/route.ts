import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPublishedLegalDocuments } from '@/lib/legal-defaults';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type')?.toUpperCase(); // 'TERMS' | 'WAIVER'
    const version = searchParams.get('version'); // e.g. 'v1.0'

    // If specific document and version requested
    if (type && version) {
      const doc = await prisma.legalDocument.findFirst({
        where: { type, version },
      });

      if (doc) {
        return NextResponse.json({ success: true, document: doc });
      }
    }

    // Default: fetch active published versions (ensures seeded if first time)
    const { terms, waiver } = await getPublishedLegalDocuments();

    return NextResponse.json({
      success: true,
      terms,
      waiver,
    });
  } catch (error) {
    console.error('Error fetching legal documents:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve legal agreements' },
      { status: 500 }
    );
  }
}
