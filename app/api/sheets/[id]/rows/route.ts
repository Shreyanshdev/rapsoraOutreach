import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SheetRow from '@/models/SheetRow';
import { auth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await dbConnect();
    const rows = await SheetRow.find({ sheetId: id }).sort({ createdAt: -1 });
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { data } = await req.json();
    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    await dbConnect();
    const row = await SheetRow.create({
      sheetId: id,
      data
    });

    return NextResponse.json(row);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: sheetId } = await params;

  try {
    const { rowId, data } = await req.json();
    if (!rowId || !data) {
      return NextResponse.json({ error: 'Row ID and data are required' }, { status: 400 });
    }

    await dbConnect();
    const row = await SheetRow.findOneAndUpdate(
      { _id: rowId, sheetId: sheetId },
      { data, updatedAt: Date.now() },
      { new: true }
    );

    if (!row) {
      return NextResponse.json({ error: 'Row not found' }, { status: 404 });
    }

    return NextResponse.json(row);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: sheetId } = await params;
  const { searchParams } = new URL(req.url);
  const rowId = searchParams.get('rowId');

  if (!rowId) {
    return NextResponse.json({ error: 'Row ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const row = await SheetRow.findOneAndDelete({ _id: rowId, sheetId: sheetId });

    if (!row) {
      return NextResponse.json({ error: 'Row not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Row deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
