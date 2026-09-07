import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllRegistrations, getAdminStats, deleteRegistration } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated_tkec_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const registrations = getAllRegistrations();
  const stats = getAdminStats();

  return NextResponse.json({
    success: true,
    stats,
    registrations,
  });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated_tkec_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
  }

  const deleted = deleteRegistration(id);
  return NextResponse.json({ success: deleted });
}
