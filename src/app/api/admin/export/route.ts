import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllRegistrations } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated_tkec_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const registrations = getAllRegistrations();

  // Build CSV content
  const headers = [
    'Registration ID',
    'Type',
    'Full Name',
    'Email',
    'Phone',
    'College Name',
    'Department',
    'Events',
    'Is Team',
    'Team Members',
    'Total Attendees',
    'Amount Paid (INR)',
    'Transaction ID / UTR',
    'Payment Screenshot Link',
    'Registration Date',
  ];

  const escapeCsv = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = registrations.map((r) => [
    escapeCsv(r.id),
    escapeCsv(r.type),
    escapeCsv(r.fullName),
    escapeCsv(r.email),
    escapeCsv(r.phone),
    escapeCsv(r.collegeName),
    escapeCsv(r.department),
    escapeCsv(r.events ? r.events.join(', ') : ''),
    escapeCsv(r.isTeam ? 'Yes' : 'No'),
    escapeCsv(r.teamMembers ? r.teamMembers.join(', ') : ''),
    escapeCsv(r.totalAttendees || 1),
    escapeCsv(r.amount || 0),
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
      'Content-Disposition': 'attachment; filename="symposium_2k26_registrations.csv"',
    },
  });
}
