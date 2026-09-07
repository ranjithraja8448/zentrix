import { NextResponse } from 'next/server';
import path from 'path';
import { saveRegistrationAsync } from '@/lib/db';
import { StoredRegistration, RegistrationType } from '@/types/registration';
import { SYMPOSIUM_EVENTS } from '@/data/events';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

      // Process payment screenshot
      const screenshotFile = formData.get('paymentScreenshot') as File | null;
      if (screenshotFile && screenshotFile.size > 0 && typeof screenshotFile.arrayBuffer === 'function') {
        try {
          const bytes = await screenshotFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const ext = path.extname(screenshotFile.name) || '.jpg';
          const fileName = `${regId}-proof${ext}`;

          // If Supabase Storage is configured, upload to bucket
          if (isSupabaseConfigured && supabase) {
            const { error: uploadError } = await supabase.storage
              .from('payment-screenshots')
              .upload(fileName, buffer, {
                contentType: screenshotFile.type || 'image/jpeg',
                upsert: true,
              });

            if (!uploadError) {
              const { data: pubData } = supabase.storage
                .from('payment-screenshots')
                .getPublicUrl(fileName);
              screenshotUrl = pubData.publicUrl;
            } else {
              console.warn('Supabase storage upload error, fallback to base64:', uploadError);
              screenshotUrl = `data:${screenshotFile.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
            }
          } else {
            // Serverless fallback: store as base64 Data URL (guaranteed no filesystem write errors)
            screenshotUrl = `data:${screenshotFile.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
          }
        } catch (imgError) {
          console.warn('Screenshot processing warning:', imgError);
        }
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

    // Save to persistent database (Supabase and serverless fallback)
    await saveRegistrationAsync(newRecord);

    return NextResponse.json({
      success: true,
      registrationId: newRecord.id,
      message: 'Registration confirmed and stored successfully!',
      timestamp: newRecord.createdAt,
      data: newRecord,
    });
  } catch (error: any) {
    console.error('Registration processing error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process registration request.' },
      { status: 500 }
    );
  }
}
