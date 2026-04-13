import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sheet from '@/models/Sheet';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    
    // Ensure "Cold Call Sheet" exists
    let coldCallSheet = await Sheet.findOne({ type: 'fixed', name: 'Cold Call Sheet' });
    if (!coldCallSheet) {
      coldCallSheet = await Sheet.create({
        name: 'Cold Call Sheet',
        columns: ['Name', 'Phone', 'Company', 'Status', 'Response'],
        type: 'fixed',
        uid: session.user?.id || 'system'
      });
    }

    const sheets = await Sheet.find({}).sort({ createdAt: 1 });
    return NextResponse.json(sheets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, columns } = await req.json();
    if (!name || !columns || !Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json({ error: 'Name and columns are required' }, { status: 400 });
    }

    await dbConnect();
    const sheet = await Sheet.create({
      name,
      columns,
      type: 'custom',
      uid: session.user?.id
    });

    return NextResponse.json(sheet);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
