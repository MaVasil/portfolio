-- =========================================================================
-- VASIL.DEV — MASTER PRODUCTION DATABASE MIGRATION
-- =========================================================================

-- 1. DOCUMENTS TABLE (Résumé & Private Files)
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

-- 2. DSA TOPICS & OVERALL PROGRESS TABLE
create table if not exists public.dsa_topics (
  id uuid default gen_random_uuid() primary key,
  topic_name text not null,
  language text default 'Java',
  target_count integer not null default 100,
  solved_count integer not null default 0,
  topic_status text default 'In Progress',
  display_order integer default 0,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. GATE SUBJECTS PROGRESS TABLE
create table if not exists public.gate_subjects (
  id uuid default gen_random_uuid() primary key,
  exam_type text not null, -- 'CS' or 'DA'
  name text not null,
  target_pyqs integer not null default 500,
  solved_pyqs integer not null default 500,
  completion_percentage integer default 100,
  revision_status text default 'Cycle 2 Completed',
  display_order integer default 0,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CONTACT SUBMISSIONS TABLE
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  sender_name text not null,
  sender_email text not null,
  subject text,
  message text not null,
  delivery_status text default 'accepted_by_server',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.documents enable row level security;
alter table public.dsa_topics enable row level security;
alter table public.gate_subjects enable row level security;
alter table public.contact_submissions enable row level security;

-- Policies
create policy "Public read public documents" on public.documents for select using (is_private = false);
create policy "Public read dsa topics" on public.dsa_topics for select using (published = true);
create policy "Public read gate subjects" on public.gate_subjects for select using (published = true);
create policy "Allow insert contact" on public.contact_submissions for insert with check (true);
create policy "Allow select contact admin" on public.contact_submissions for select using (true);
