import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Template from '@/models/Template';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    console.log(`[GET /api/templates] Fetching all blueprints for company-wide view`);
    const templates = await Template.find({}).sort({ createdAt: -1 });
    console.log(`[GET /api/templates] Found ${templates.length} custom blueprints total`);
    return NextResponse.json(templates);
  } catch (error) {
    console.error(`[GET /api/templates] Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch blueprints' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, subject, bodyHTML } = await req.json();
  if (!name || !subject || !bodyHTML) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await dbConnect();

  try {
    const template = await Template.create({
      name,
      subject,
      bodyHTML,
      uid: session.user.id,
    });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Failed to create blueprint', error);
    return NextResponse.json({ error: 'Failed to create blueprint' }, { status: 500 });
  }
}
