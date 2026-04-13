import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SentEmail from '@/models/SentEmail';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    // Shared company pooling - fetch all sent emails
    const emails = await SentEmail.find({}).sort({ createdAt: -1 });
    return NextResponse.json(emails);
  } catch (error) {
    console.error('[GET /api/emails] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch email history' }, { status: 500 });
  }
}
