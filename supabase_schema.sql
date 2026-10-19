-- =========================================================================
-- VASIL.DEV — COMPLETE SUPABASE PRODUCTION DATABASE & STORAGE SCHEMA
-- =========================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  headline text not null,
  about text not null,
  college text not null,
  degree text not null,
  branch text not null,
  graduation_year text not null,
  email text not null,
  phone text not null,
  github_url text,
  linkedin_url text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROJECTS TABLE
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  subtitle text,
  category text not null,
  description text not null,
  long_description text not null,
  metrics text,
  tech_stack text[] not null,
  architecture text[] not null,
  github_url text,
  live_url text,
  featured boolean default false,
  badge text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CERTIFICATIONS TABLE
create table if not exists public.certifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  issuer text not null,
  date text not null,
  credential_id text,
  verification_url text,
  category text,
  featured boolean default false,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ACHIEVEMENTS TABLE
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  date text not null,
  issuer text,
  evidence_url text,
  featured boolean default true,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. EXPERIENCE TABLE
create table if not exists public.experience (
  id uuid default gen_random_uuid() primary key,
  role text not null,
  organization text not null,
  period text not null,
  location text not null,
  description text not null,
  highlights text[] not null,
  skills text[] not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. GATE SUBJECTS TABLE (CS & DA initialized to 100%)
create table if not exists public.gate_subjects (
  id uuid default gen_random_uuid() primary key,
  exam_type text not null, -- 'CS' or 'DA'
  name text not null,
  completion_percentage integer default 100,
  status text default 'Completed',
  revision_status text default 'Cycle 2 Completed',
  pyqs_solved text default '400+ Solved',
  display_order integer default 0,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. DOCUMENTS TABLE (Résumé & Private GATE Application)
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  doc_type text not null, -- 'resume' or 'gate_application'
  file_path text not null,
  mime_type text default 'application/pdf',
  file_size text,
  is_current_public boolean default false,
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. ANALYTICS EVENTS TABLE
create table if not exists public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  event_type text not null,
  meta jsonb,
  session_hash text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. ADMIN AUDIT LOGS TABLE
create table if not exists public.admin_audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_email text not null,
  action text not null,
  entity text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.achievements enable row level security;
alter table public.experience enable row level security;
alter table public.gate_subjects enable row level security;
alter table public.documents enable row level security;
alter table public.analytics_events enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Public read policies for published portfolio content
create policy "Public read profiles" on public.profiles for select using (true);
create policy "Public read projects" on public.projects for select using (published = true);
create policy "Public read certifications" on public.certifications for select using (published = true);
create policy "Public read achievements" on public.achievements for select using (published = true);
create policy "Public read experience" on public.experience for select using (published = true);
create policy "Public read gate_subjects" on public.gate_subjects for select using (published = true);
create policy "Public read public documents" on public.documents for select using (is_private = false);
create policy "Allow insert analytics" on public.analytics_events for insert with check (true);
create policy "Allow select analytics" on public.analytics_events for select using (true);

-- =========================================================================
-- INITIAL SEED DATA (INITIALIZING GATE CS & DA SUBJECTS TO 100%)
-- =========================================================================
insert into public.gate_subjects (exam_type, name, completion_percentage, status, revision_status, pyqs_solved, display_order)
values
  ('CS', 'Engineering Mathematics', 100, 'Completed', 'Cycle 2 Completed', '450+ Solved', 1),
  ('CS', 'Digital Logic', 100, 'Completed', 'Cycle 2 Completed', '320+ Solved', 2),
  ('CS', 'Computer Organization & Architecture', 100, 'Completed', 'Cycle 2 Completed', '380+ Solved', 3),
  ('CS', 'Programming and Data Structures', 100, 'Completed', 'Cycle 3 Completed', '500+ Solved', 4),
  ('CS', 'Algorithms', 100, 'Completed', 'Cycle 3 Completed', '550+ Solved', 5),
  ('CS', 'Theory of Computation', 100, 'Completed', 'Cycle 2 Completed', '400+ Solved', 6),
  ('CS', 'Compiler Design', 100, 'Completed', 'Cycle 2 Completed', '300+ Solved', 7),
  ('CS', 'Operating Systems', 100, 'Completed', 'Cycle 3 Completed', '480+ Solved', 8),
  ('CS', 'Databases', 100, 'Completed', 'Cycle 3 Completed', '450+ Solved', 9),
  ('CS', 'Computer Networks', 100, 'Completed', 'Cycle 2 Completed', '420+ Solved', 10),
  
  ('DA', 'Probability and Statistics', 100, 'Completed', 'Cycle 2 Completed', '400+ Solved', 1),
  ('DA', 'Linear Algebra', 100, 'Completed', 'Cycle 2 Completed', '350+ Solved', 2),
  ('DA', 'Calculus and Optimization', 100, 'Completed', 'Cycle 2 Completed', '300+ Solved', 3),
  ('DA', 'Programming, Data Structures & Algorithms', 100, 'Completed', 'Cycle 3 Completed', '500+ Solved', 4),
  ('DA', 'Database Management & Warehousing', 100, 'Completed', 'Cycle 2 Completed', '320+ Solved', 5),
  ('DA', 'Machine Learning', 100, 'Completed', 'Cycle 3 Completed', '600+ Solved', 6),
  ('DA', 'Artificial Intelligence', 100, 'Completed', 'Cycle 3 Completed', '450+ Solved', 7)
on conflict do nothing;
