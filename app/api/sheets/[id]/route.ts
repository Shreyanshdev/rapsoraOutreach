import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sheet from '@/models/Sheet';
import SheetRow from '@/models/SheetRow';
import { auth } from '@/lib/auth';

export async function DELETE(
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
    
    const sheet = await Sheet.findById(id);
    if (!sheet) {
      return NextResponse.json({ error: 'Sheet not found' }, { status: 404 });
    }

    if (sheet.type === 'fixed') {
      return NextResponse.json({ error: 'Cannot delete system sheets' }, { status: 403 });
    }

    // Delete associated rows and the sheet itself
    await Promise.all([
      SheetRow.deleteMany({ sheetId: id }),
      Sheet.findByIdAndDelete(id)
    ]);

    return NextResponse.json({ message: 'Sheet deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
