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

function mapRowToRegistration(row: any, defaultType: 'internal' | 'external'): StoredRegistration {
  return {
    id: row.id,
    type: row.type || defaultType,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    department: row.department,
    collegeName: row.college_name,
    events: Array.isArray(row.events) ? row.events : [],
    isTeam: Boolean(row.is_team),
    teamMembers: Array.isArray(row.team_members) ? row.team_members : [],
    totalAttendees: row.total_attendees || 1,
    amount: Number(row.amount),
    transactionId: row.transaction_id || '',
    paymentScreenshotUrl: row.payment_screenshot_url || '',
    paymentStatus: row.payment_status || 'verified',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Fetch all registrations (fetches from both separate tables in Supabase)
export async function getAllRegistrationsAsync(): Promise<StoredRegistration[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Fetch from separate internal_registrations table
      const { data: internalData, error: intErr } = await supabase
        .from('internal_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch from separate external_registrations table
      const { data: externalData, error: extErr } = await supabase
        .from('external_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      let combined: StoredRegistration[] = [];

      if (!intErr && internalData) {
        combined = combined.concat(internalData.map((r: any) => mapRowToRegistration(r, 'internal')));
      }
      if (!extErr && externalData) {
        combined = combined.concat(externalData.map((r: any) => mapRowToRegistration(r, 'external')));
      }

      // If separate tables returned records, return them sorted newest first
      if (combined.length > 0) {
        combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return combined;
      }

      // Fallback: check legacy public.registrations table
      const { data: regData } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (regData && regData.length > 0) {
        return regData.map((r: any) => mapRowToRegistration(r, r.type || 'internal'));
      }
    } catch (err) {
      console.error('Supabase fetch error, falling back to local:', err);
    }
  }

  // Fallback to local file
  return getAllRegistrationsLocal();
}

// Get only Internal Registrations
export async function getInternalRegistrationsAsync(): Promise<StoredRegistration[]> {
  const all = await getAllRegistrationsAsync();
  return all.filter((r) => r.type === 'internal');
}

// Get only External Registrations
export async function getExternalRegistrationsAsync(): Promise<StoredRegistration[]> {
  const all = await getAllRegistrationsAsync();
  return all.filter((r) => r.type === 'external');
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

export function getAllRegistrations(): StoredRegistration[] {
  return getAllRegistrationsLocal();
}

// Save registration to Separate Supabase Tables & Local storage
export async function saveRegistrationAsync(reg: StoredRegistration): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const payload = {
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
    };

    try {
      // If internal, insert into separate internal_registrations table
      if (reg.type === 'internal') {
        const { error: intErr } = await supabase.from('internal_registrations').insert(payload);
        if (intErr) {
          console.warn('Could not insert to internal_registrations, trying registrations table:', intErr.message);
          await supabase.from('registrations').insert(payload);
        }
      } else {
        // If external, insert into separate external_registrations table
        const { error: extErr } = await supabase.from('external_registrations').insert(payload);
        if (extErr) {
          console.warn('Could not insert to external_registrations, trying registrations table:', extErr.message);
          await supabase.from('registrations').insert(payload);
        }
      }
    } catch (err) {
      console.error('Supabase write exception:', err);
    }
  }

  // Also save locally
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
      await supabase.from('internal_registrations').delete().eq('id', id);
      await supabase.from('external_registrations').delete().eq('id', id);
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
