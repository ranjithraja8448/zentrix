import fs from 'fs';
import path from 'path';
import { StoredRegistration, AdminStats } from '@/types/registration';
import { supabase, isSupabaseConfigured } from './supabase';

// Determine writable directory (use /tmp on Vercel or read-only serverless environments)
function getDbPath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDir = path.join('/tmp', 'zentrix-data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    return path.join(tmpDir, 'registrations.json');
  }

  const localDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(localDir)) {
    try {
      fs.mkdirSync(localDir, { recursive: true });
    } catch {}
  }
  return path.join(localDir, 'registrations.json');
}

function ensureLocalDb() {
  const dbFile = getDbPath();
  if (!fs.existsSync(dbFile)) {
    try {
      fs.writeFileSync(dbFile, JSON.stringify([], null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write initial empty db file:', err);
    }
  }
}

// Read registrations from Supabase or Fallback
export async function getAllRegistrationsAsync(): Promise<StoredRegistration[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          type: row.type,
          fullName: row.full_name,
          email: row.email,
          phone: row.phone,
          department: row.department,
          collegeName: row.college_name,
          events: Array.isArray(row.events) ? row.events : [],
          isTeam: row.is_team,
          teamMembers: Array.isArray(row.team_members) ? row.team_members : [],
          totalAttendees: row.total_attendees,
          amount: Number(row.amount),
          transactionId: row.transaction_id,
          paymentScreenshotUrl: row.payment_screenshot_url,
          paymentStatus: row.payment_status || 'verified',
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      console.error('Supabase fetch error, falling back to local:', err);
    }
  }

  // Fallback to local file / /tmp
  return getAllRegistrationsLocal();
}

export function getAllRegistrationsLocal(): StoredRegistration[] {
  try {
    ensureLocalDb();
    const dbFile = getDbPath();
    if (fs.existsSync(dbFile)) {
      const fileData = fs.readFileSync(dbFile, 'utf-8');
      const parsed = JSON.parse(fileData);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error('Error reading registrations file:', error);
  }
  return [];
}

// Synchronous wrapper for backward compatibility
export function getAllRegistrations(): StoredRegistration[] {
  return getAllRegistrationsLocal();
}

// Save registration to Supabase and Local
export async function saveRegistrationAsync(reg: StoredRegistration): Promise<boolean> {
  let savedToSupabase = false;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('registrations').insert({
        id: reg.id,
        type: reg.type,
        full_name: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        department: reg.department,
        college_name: reg.collegeName,
        events: reg.events,
        is_team: reg.isTeam,
        team_members: reg.teamMembers,
        total_attendees: reg.totalAttendees,
        amount: reg.amount,
        transaction_id: reg.transactionId || null,
        payment_screenshot_url: reg.paymentScreenshotUrl || null,
        payment_status: reg.paymentStatus,
        created_at: reg.createdAt,
      });

      if (!error) {
        savedToSupabase = true;
      } else {
        console.error('Supabase insert error:', error);
      }
    } catch (err) {
      console.error('Supabase write exception:', err);
    }
  }

  // Also save to file (using safe getDbPath)
  saveRegistrationLocal(reg);
  return true;
}

export function saveRegistrationLocal(registration: StoredRegistration): boolean {
  try {
    ensureLocalDb();
    const dbFile = getDbPath();
    const registrations = getAllRegistrationsLocal();
    registrations.unshift(registration);
    fs.writeFileSync(dbFile, JSON.stringify(registrations, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving registration locally:', error);
    return false;
  }
}

export function saveRegistration(registration: StoredRegistration): boolean {
  return saveRegistrationLocal(registration);
}

export async function getAdminStatsAsync(): Promise<AdminStats> {
  const registrations = await getAllRegistrationsAsync();

  let totalParticipants = 0;
  let internalCount = 0;
  let externalCount = 0;
  let totalRevenue = 0;
  const eventsCount: Record<string, number> = {};

  for (const reg of registrations) {
    const attendees = reg.totalAttendees || (1 + (reg.teamMembers?.length || 0));
    totalParticipants += attendees;

    if (reg.type === 'internal') {
      internalCount += 1;
      totalRevenue += reg.amount !== undefined ? reg.amount : attendees * 150;
    } else {
      externalCount += 1;
      totalRevenue += reg.amount !== undefined ? reg.amount : attendees * 200;
    }

    if (Array.isArray(reg.events)) {
      for (const event of reg.events) {
        eventsCount[event] = (eventsCount[event] || 0) + 1;
      }
    }
  }

  return {
    totalRegistrations: registrations.length,
    totalParticipants,
    internalCount,
    externalCount,
    totalRevenue,
    eventsCount,
  };
}

export function getAdminStats(): AdminStats {
  const registrations = getAllRegistrationsLocal();
  let totalParticipants = 0;
  let internalCount = 0;
  let externalCount = 0;
  let totalRevenue = 0;
  const eventsCount: Record<string, number> = {};

  for (const reg of registrations) {
    const attendees = reg.totalAttendees || (1 + (reg.teamMembers?.length || 0));
    totalParticipants += attendees;

    if (reg.type === 'internal') {
      internalCount += 1;
      totalRevenue += reg.amount !== undefined ? reg.amount : attendees * 150;
    } else {
      externalCount += 1;
      totalRevenue += reg.amount !== undefined ? reg.amount : attendees * 200;
    }

    if (Array.isArray(reg.events)) {
      for (const event of reg.events) {
        eventsCount[event] = (eventsCount[event] || 0) + 1;
      }
    }
  }

  return {
    totalRegistrations: registrations.length,
    totalParticipants,
    internalCount,
    externalCount,
    totalRevenue,
    eventsCount,
  };
}

export async function deleteRegistrationAsync(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('registrations').delete().eq('id', id);
    } catch {}
  }
  return deleteRegistration(id);
}

export function deleteRegistration(id: string): boolean {
  try {
    ensureLocalDb();
    const dbFile = getDbPath();
    const registrations = getAllRegistrationsLocal();
    const filtered = registrations.filter((r) => r.id !== id);
    fs.writeFileSync(dbFile, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error deleting registration:', error);
    return false;
  }
}
