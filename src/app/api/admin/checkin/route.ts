import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { toggleCheckInAsync } from '@/lib/db';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated_tkec_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, checkedIn } = body;

    if (!id) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
    }

    const result = await toggleCheckInAsync(id, checkedIn !== false);

    if (!result.success) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: checkedIn ? 'Student marked as PRESENT' : 'Student check-in reverted',
      registration: result.registration,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 });
  }
}
