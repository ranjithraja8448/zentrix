export type RegistrationType = 'internal' | 'external';

export interface EventItem {
  id: string;
  name: string;
  category: 'Technical' | 'Non-Technical';
  description: string;
  iconName: string;
  badgeColor: string;
}

export interface TeamMember {
  id: string;
  name: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  collegeName: string;
  selectedEvents: string[];
  isTeam: boolean;
  teamMembers: TeamMember[];
  transactionId?: string;
  paymentScreenshot?: File | null;
  paymentScreenshotPreview?: string | null;
}

export interface RegistrationSubmissionResult {
  success: boolean;
  registrationId: string;
  timestamp: string;
  data: {
    fullName: string;
    email: string;
    phone: string;
    department: string;
    collegeName: string;
    type: RegistrationType;
    events: string[];
    isTeam: boolean;
    teamMembers: string[];
    amountPaid?: number;
    transactionId?: string;
  };
}

export interface StoredRegistration {
  id: string;
  type: RegistrationType;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  collegeName: string;
  events: string[];
  isTeam: boolean;
  teamMembers: string[];
  totalAttendees: number;
  amount: number;
  transactionId?: string;
  paymentScreenshotUrl?: string;
  paymentStatus: 'verified' | 'pending' | 'free';
  createdAt: string;
}

export interface AdminStats {
  totalRegistrations: number;
  totalParticipants: number;
  internalCount: number;
  externalCount: number;
  totalRevenue: number;
  eventsCount: Record<string, number>;
}
