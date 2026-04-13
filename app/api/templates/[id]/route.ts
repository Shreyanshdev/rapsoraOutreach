import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Template from '@/models/Template';
import { auth } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    console.log(`[DELETE /api/templates/${id}] Attempting deletion by user ${session.user.id}`);
    const result = await Template.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blueprint not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blueprint deleted successfully' });
  } catch (error) {
    console.error(`[DELETE /api/templates/${id}] Error:`, error);
    return NextResponse.json({ error: 'Failed to delete blueprint' }, { status: 500 });
  }
}
