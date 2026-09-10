-- ==============================================================================
-- ZENTRIX 2K26 - THE KAVERY ENGINEERING COLLEGE (AUTONOMOUS)
-- Supabase SQL Migration Script: Separate Tables + Attendance Check-In Desk
-- ==============================================================================

-- 1. Create 'internal_registrations' Table (DAY 1: 24 Sep 2026 - TKEC Students)
CREATE TABLE IF NOT EXISTS public.internal_registrations (
    id TEXT PRIMARY KEY,                                      -- e.g. ZENTRIX-INT-7202
    type TEXT NOT NULL DEFAULT 'internal',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    college_name TEXT NOT NULL DEFAULT 'The Kavery Engineering College (Autonomous)',
    events JSONB NOT NULL DEFAULT '[]'::jsonb,                -- Array of 2 events (1 Tech + 1 Non-Tech)
    is_team BOOLEAN NOT NULL DEFAULT false,
    team_members JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_attendees INTEGER NOT NULL DEFAULT 1,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 150.00,            -- ₹150 per head
    transaction_id TEXT,                                      -- UPI UTR
    payment_screenshot_url TEXT,
    payment_status TEXT NOT NULL DEFAULT 'verified',
    checked_in BOOLEAN NOT NULL DEFAULT false,                -- Attendance check-in status
    checked_in_at TIMESTAMPTZ,                                -- Entry timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create 'external_registrations' Table (DAY 2: 25 Sep 2026 - Other Colleges)
CREATE TABLE IF NOT EXISTS public.external_registrations (
    id TEXT PRIMARY KEY,                                      -- e.g. ZENTRIX-EXT-3014
    type TEXT NOT NULL DEFAULT 'external',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    college_name TEXT NOT NULL,
    events JSONB NOT NULL DEFAULT '[]'::jsonb,                -- Array of 2 events (1 Tech + 1 Non-Tech)
    is_team BOOLEAN NOT NULL DEFAULT false,
    team_members JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_attendees INTEGER NOT NULL DEFAULT 1,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 200.00,            -- ₹200 per head
    transaction_id TEXT,                                      -- UPI UTR
    payment_screenshot_url TEXT,
    payment_status TEXT NOT NULL DEFAULT 'verified',
    checked_in BOOLEAN NOT NULL DEFAULT false,                -- Attendance check-in status
    checked_in_at TIMESTAMPTZ,                                -- Entry timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Combined 'registrations' Table (Fallback view)
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    college_name TEXT NOT NULL,
    events JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_team BOOLEAN NOT NULL DEFAULT false,
    team_members JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_attendees INTEGER NOT NULL DEFAULT 1,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    transaction_id TEXT,
    payment_screenshot_url TEXT,
    payment_status TEXT NOT NULL DEFAULT 'verified',
    checked_in BOOLEAN NOT NULL DEFAULT false,
    checked_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Safe Migration for Existing Tables (Adds columns if they don't already exist)
ALTER TABLE public.internal_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.internal_registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

ALTER TABLE public.external_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.external_registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

-- 5. Grant Permissions to anon, authenticated, service_role for ALL tables
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.internal_registrations TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.external_registrations TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.registrations TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 6. Enable Row Level Security (RLS) & Policies for internal_registrations
ALTER TABLE public.internal_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on internal_registrations" ON public.internal_registrations;
CREATE POLICY "Allow public insert on internal_registrations" ON public.internal_registrations FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public select on internal_registrations" ON public.internal_registrations;
CREATE POLICY "Allow public select on internal_registrations" ON public.internal_registrations FOR SELECT TO anon, authenticated, service_role USING (true);
DROP POLICY IF EXISTS "Allow public update on internal_registrations" ON public.internal_registrations;
CREATE POLICY "Allow public update on internal_registrations" ON public.internal_registrations FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow service_role all on internal_registrations" ON public.internal_registrations;
CREATE POLICY "Allow service_role all on internal_registrations" ON public.internal_registrations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 7. Enable Row Level Security (RLS) & Policies for external_registrations
ALTER TABLE public.external_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on external_registrations" ON public.external_registrations;
CREATE POLICY "Allow public insert on external_registrations" ON public.external_registrations FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public select on external_registrations" ON public.external_registrations;
CREATE POLICY "Allow public select on external_registrations" ON public.external_registrations FOR SELECT TO anon, authenticated, service_role USING (true);
DROP POLICY IF EXISTS "Allow public update on external_registrations" ON public.external_registrations;
CREATE POLICY "Allow public update on external_registrations" ON public.external_registrations FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow service_role all on external_registrations" ON public.external_registrations;
CREATE POLICY "Allow service_role all on external_registrations" ON public.external_registrations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 8. Enable Row Level Security (RLS) & Policies for registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on registrations" ON public.registrations;
CREATE POLICY "Allow public insert on registrations" ON public.registrations FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public select on registrations" ON public.registrations;
CREATE POLICY "Allow public select on registrations" ON public.registrations FOR SELECT TO anon, authenticated, service_role USING (true);
DROP POLICY IF EXISTS "Allow public update on registrations" ON public.registrations;
CREATE POLICY "Allow public update on registrations" ON public.registrations FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow service_role all on registrations" ON public.registrations;
CREATE POLICY "Allow service_role all on registrations" ON public.registrations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 9. Storage Bucket for Payment Screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public uploads to payment-screenshots" ON storage.objects;
CREATE POLICY "Allow public uploads to payment-screenshots" ON storage.objects FOR INSERT TO anon, authenticated, service_role WITH CHECK (bucket_id = 'payment-screenshots');
DROP POLICY IF EXISTS "Allow public view payment-screenshots" ON storage.objects;
CREATE POLICY "Allow public view payment-screenshots" ON storage.objects FOR SELECT TO anon, authenticated, service_role USING (bucket_id = 'payment-screenshots');
