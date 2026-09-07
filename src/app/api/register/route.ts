import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveRegistration } from '@/lib/db';
import { StoredRegistration, RegistrationType } from '@/types/registration';
import { SYMPOSIUM_EVENTS } from '@/data/events';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, any> = {};
    let screenshotUrl: string | undefined = undefined;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const type = (formData.get('type') as RegistrationType) || 'internal';
      const prefix = type === 'internal' ? 'ZENTRIX-INT' : 'ZENTRIX-EXT';
      const regId = `${prefix}-${randomSuffix}`;

      // Handle Screenshot File
      const screenshotFile = formData.get('paymentScreenshot') as File | null;
      if (screenshotFile && screenshotFile.size > 0 && typeof screenshotFile.arrayBuffer === 'function') {
        const bytes = await screenshotFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const ext = path.extname(screenshotFile.name) || '.jpg';
        const fileName = `${regId}-proof${ext}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        screenshotUrl = `/uploads/${fileName}`;
      }

      // Parse JSON fields
      let parsedEvents: string[] = [];
      try {
        const eventsRaw = formData.get('events') as string;
        parsedEvents = eventsRaw ? JSON.parse(eventsRaw) : [];
      } catch {
        parsedEvents = [];
      }

      let parsedTeamMembers: string[] = [];
      try {
        const teamRaw = formData.get('teamMembers') as string;
        parsedTeamMembers = teamRaw ? JSON.parse(teamRaw) : [];
      } catch {
        parsedTeamMembers = [];
      }

      data = {
        id: regId,
        type,
        fullName: (formData.get('fullName') as string) || '',
        email: (formData.get('email') as string) || '',
        phone: (formData.get('phone') as string) || '',
        department: (formData.get('department') as string) || '',
        collegeName: (formData.get('collegeName') as string) || (type === 'internal' ? 'The Kavery Engineering College (Autonomous)' : ''),
        events: parsedEvents,
        isTeam: formData.get('isTeam') === 'true',
        teamMembers: parsedTeamMembers,
        transactionId: (formData.get('transactionId') as string) || '',
        paymentScreenshotUrl: screenshotUrl,
      };
    } else {
      // Standard JSON
      const jsonBody = await request.json();
      const type = jsonBody.type || 'internal';
      const prefix = type === 'internal' ? 'ZENTRIX-INT' : 'ZENTRIX-EXT';
      const regId = `${prefix}-${randomSuffix}`;

      data = {
        id: regId,
        type,
        fullName: jsonBody.fullName || '',
        email: jsonBody.email || '',
        phone: jsonBody.phone || '',
        department: jsonBody.department || '',
        collegeName: jsonBody.collegeName || (type === 'internal' ? 'The Kavery Engineering College (Autonomous)' : ''),
        events: Array.isArray(jsonBody.events) ? jsonBody.events : [],
        isTeam: Boolean(jsonBody.isTeam),
        teamMembers: Array.isArray(jsonBody.teamMembers) ? jsonBody.teamMembers : [],
        transactionId: jsonBody.transactionId || '',
        paymentScreenshotUrl: jsonBody.paymentScreenshotUrl,
      };
    }

    // Server-side validation
    if (!data.fullName || !data.email || !data.phone || !data.department) {
      return NextResponse.json(
        { error: 'Missing required participant fields.' },
        { status: 400 }
      );
    }

    if (!data.events || data.events.length === 0) {
      return NextResponse.json(
        { error: 'Please choose your events.' },
        { status: 400 }
      );
    }

    // Validate 1 Technical and 1 Non-Technical
    const selectedTech = data.events.filter((evName: string) => {
      const matched = SYMPOSIUM_EVENTS.find((e) => e.name === evName || e.id === evName);
      return matched?.category === 'Technical';
    });
    const selectedNonTech = data.events.filter((evName: string) => {
      const matched = SYMPOSIUM_EVENTS.find((e) => e.name === evName || e.id === evName);
      return matched?.category === 'Non-Technical';
    });

    if (selectedTech.length > 1) {
      return NextResponse.json(
        { error: 'Maximum 1 Technical event allowed.' },
        { status: 400 }
      );
    }
    if (selectedNonTech.length > 1) {
      return NextResponse.json(
        { error: 'Maximum 1 Non-Technical event allowed.' },
        { status: 400 }
      );
    }

    const attendeesCount = 1 + (data.teamMembers?.length || 0);
    // Internal ₹150, External ₹200
    const pricePerHead = data.type === 'internal' ? 150 : 200;
    const amount = attendeesCount * pricePerHead;

    const newRecord: StoredRegistration = {
      id: data.id,
      type: data.type,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      collegeName: data.collegeName,
      events: data.events,
      isTeam: data.isTeam,
      teamMembers: data.teamMembers,
      totalAttendees: attendeesCount,
      amount,
      transactionId: data.transactionId,
      paymentScreenshotUrl: data.paymentScreenshotUrl,
      paymentStatus: 'verified',
      createdAt: new Date().toISOString(),
    };

    // Save to persistent database
    saveRegistration(newRecord);

    return NextResponse.json({
      success: true,
      registrationId: newRecord.id,
      message: 'Registration confirmed and stored in database successfully!',
      timestamp: newRecord.createdAt,
      data: newRecord,
    });
  } catch (error) {
    console.error('Registration processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration request.' },
      { status: 500 }
    );
  }
}
