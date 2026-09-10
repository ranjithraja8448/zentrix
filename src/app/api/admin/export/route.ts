import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllRegistrationsAsync } from '@/lib/db';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated_tkec_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filterType = searchParams.get('type'); // 'internal' | 'external' | null

  const allRegistrations = await getAllRegistrationsAsync();
  const registrations = filterType
    ? allRegistrations.filter((r) => r.type === filterType)
    : allRegistrations;

  const filename = 
    filterType === 'internal'
      ? 'zentrix_day1_internal_registrations_24sep.csv'
      : filterType === 'external'
      ? 'zentrix_day2_external_registrations_25sep.csv'
      : 'zentrix_all_registrations_2k26.csv';

  // Build CSV content
  const headers = [
    'Registration ID',
    'Attendance Status',
    'Check-in Time',
    'Category',
    'Event Date',
    'Full Name',
    'Email',
    'Phone',
    'College Name',
    'Department',
    'Events (1 Tech + 1 Non-Tech)',
    'Is Team',
    'Team Members',
    'Total Attendees',
    'Amount Paid (INR)',
    'Transaction ID / UTR',
    'Payment Screenshot Link',
    'Registration Timestamp',
  ];

  const escapeCsv = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = registrations.map((r) => [
    escapeCsv(r.id),
    escapeCsv(r.checkedIn ? 'PRESENT' : 'NOT CHECKED IN'),
    escapeCsv(r.checkedInAt ? new Date(r.checkedInAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'),
    escapeCsv(r.type === 'internal' ? 'Day 1 Internal (TKEC)' : 'Day 2 External'),
    escapeCsv(r.type === 'internal' ? '24-09-2026' : '25-09-2026'),
    escapeCsv(r.fullName),
    escapeCsv(r.email),
    escapeCsv(r.phone),
    escapeCsv(r.collegeName),
    escapeCsv(r.department),
    escapeCsv(r.events ? r.events.join(' | ') : ''),
    escapeCsv(r.isTeam ? 'Yes' : 'No'),
    escapeCsv(r.teamMembers ? r.teamMembers.join('; ') : ''),
    escapeCsv(r.totalAttendees || 1),
    escapeCsv(r.amount || (r.type === 'internal' ? 150 : 200)),
    escapeCsv(r.transactionId || 'N/A'),
    escapeCsv(r.paymentScreenshotUrl || 'N/A'),
    escapeCsv(r.createdAt),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
