import ExternalPortalPage from '@/app/external/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Day 2 External Registration | ZENTRIX 2K26 - The Kavery Engineering College',
  description: 'Day 2 External college registration form for students from other colleges & universities participating in Zentrix 2K26 on 25-09-2026.',
};

export default function ExternalRegistrationPage() {
  return <ExternalPortalPage />;
}

