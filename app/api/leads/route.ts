import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    console.log(`[GET /api/leads] Fetching all leads for company-wide view`);
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    console.log(`[GET /api/leads] Found ${leads.length} leads total`);
    return NextResponse.json(leads);
  } catch (error) {
    console.error(`[GET /api/leads] Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  await dbConnect();

  try {
    const lead = await Lead.create({
      ...body,
      industry: body.industry || 'General',
      uid: session.user.id,
    });
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error(`[POST /api/leads] Critical Failure:`, error);
    return NextResponse.json({ error: 'Failed to create lead', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
