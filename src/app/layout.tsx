import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SYMPOSIUM 2K26 | The Kavery Engineering College',
  description: 'Official Registration Portal for Symposium 2K26 at The Kavery Engineering College on 21-08-2026. Register for technical and non-technical events.',
  keywords: ['Symposium 2K26', 'The Kavery Engineering College', 'Engineering Symposium', 'Project Expo', 'Bug Hunters', 'Salem Symposium'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[#060814] text-slate-100 cyber-grid relative selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
