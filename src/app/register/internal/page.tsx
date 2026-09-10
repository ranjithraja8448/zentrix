import InternalPortalPage from '@/app/internal/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Day 1 Internal Registration | ZENTRIX 2K26 - The Kavery Engineering College',
  description: 'Day 1 Inter College registration form for students of The Kavery Engineering College for Zentrix 2K26 on 24-09-2026.',
};

export default function InternalRegistrationPage() {
  return <InternalPortalPage />;
}

