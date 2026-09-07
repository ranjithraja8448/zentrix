-- ==============================================================================
-- ZENTRIX 2K26 - THE KAVERY ENGINEERING COLLEGE (AUTONOMOUS)
-- Supabase SQL Migration Script for Registrations & Storage
-- ==============================================================================

-- 1. Create the 'registrations' Table
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,                                      -- e.g. ZENTRIX-INT-7202 / ZENTRIX-EXT-3014
    type TEXT NOT NULL CHECK (type IN ('internal', 'external')), -- 'internal' (Day 1) or 'external' (Day 2)
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    college_name TEXT NOT NULL,
    events JSONB NOT NULL DEFAULT '[]'::jsonb,                -- Array of 2 events (1 Tech + 1 Non-Tech)
    is_team BOOLEAN NOT NULL DEFAULT false,
    team_members JSONB NOT NULL DEFAULT '[]'::jsonb,          -- Array of team member names
    total_attendees INTEGER NOT NULL DEFAULT 1,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,              -- ₹150 for internal, ₹200 for external per head
    transaction_id TEXT,                                      -- UPI UTR / Transaction ID
    payment_screenshot_url TEXT,                              -- Storage public URL
    payment_status TEXT NOT NULL DEFAULT 'verified' CHECK (payment_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create Indexes for High Performance Queries & Admin Filtering
CREATE INDEX IF NOT EXISTS idx_registrations_type ON public.registrations(type);
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON public.registrations(phone);
CREATE INDEX IF NOT EXISTS idx_registrations_transaction_id ON public.registrations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 4. Set Access Policies:
-- Allow anyone to INSERT a registration (Public registration form submission)
CREATE POLICY "Allow public registration insert"
ON public.registrations
FOR INSERT
TO public
WITH CHECK (true);

-- Allow reading registrations for authenticated users or anon with read access
CREATE POLICY "Allow read access to registrations"
ON public.registrations
FOR SELECT
TO public
USING (true);

-- Allow admins to update or delete registrations
CREATE POLICY "Allow full access for service_role"
ON public.registrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- 5. Create Storage Bucket for Payment Screenshots (Optional but Recommended)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads of payment screenshots to the bucket
CREATE POLICY "Allow public uploads to payment-screenshots"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow public reading of screenshots
CREATE POLICY "Allow public view payment-screenshots"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'payment-screenshots');
