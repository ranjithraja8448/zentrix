import fs from 'fs';
import path from 'path';
import { StoredRegistration, AdminStats } from '@/types/registration';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'registrations.json');

// Ensure data directory and file exist
function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getAllRegistrations(): StoredRegistration[] {
  try {
    ensureDb();
    const fileData = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(fileData);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading registrations db:', error);
    return [];
  }
}

export function saveRegistration(registration: StoredRegistration): boolean {
  try {
    ensureDb();
    const registrations = getAllRegistrations();
    registrations.unshift(registration); // newest first
    fs.writeFileSync(DB_FILE, JSON.stringify(registrations, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving registration to db:', error);
    return false;
  }
}

export function getAdminStats(): AdminStats {
  const registrations = getAllRegistrations();

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

export function deleteRegistration(id: string): boolean {
  try {
    ensureDb();
    const registrations = getAllRegistrations();
    const filtered = registrations.filter((r) => r.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error deleting registration:', error);
    return false;
  }
}
