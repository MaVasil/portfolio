-- =========================================================================
-- VASIL.DEV — EXTENDED SUPABASE PRODUCTION DATABASE SCHEMA
-- =========================================================================

-- 1. LEETCODE PROBLEM LOGS TABLE
create table if not exists public.coding_problem_logs (
  id uuid default gen_random_uuid() primary key,
  platform text default 'LeetCode',
  problem_title text not null,
  problem_url text unique not null,
  difficulty text not null, -- 'Easy', 'Medium', 'Hard'
  topic_tags text[] not null,
  solved_date date not null,
  solution_notes text,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. DSA TOPICS & PROGRESS TABLE
create table if not exists public.dsa_topics (
  id uuid default gen_random_uuid() primary key,
  topic_name text not null,
  language text default 'Java',
  target_count integer not null default 15,
  solved_count integer not null default 0,
  topic_status text default 'In Progress',
  display_order integer default 0,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. GATE MOCK TESTS TABLE
create table if not exists public.gate_mock_tests (
  id uuid default gen_random_uuid() primary key,
  exam_type text not null, -- 'CS' or 'DA'
  test_name text not null,
  test_date date not null,
  score numeric(5,2) not null,
  max_marks numeric(5,2) default 100,
  accuracy_percentage numeric(5,2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for new tables
alter table public.coding_problem_logs enable row level security;
alter table public.dsa_topics enable row level security;
alter table public.gate_mock_tests enable row level security;

create policy "Public read coding problems" on public.coding_problem_logs for select using (is_public = true);
create policy "Public read dsa topics" on public.dsa_topics for select using (published = true);
create policy "Public read gate mock tests" on public.gate_mock_tests for select using (true);

-- Initial seed data for DSA topics
insert into public.dsa_topics (topic_name, language, target_count, solved_count, topic_status, display_order)
values
  ('Arrays & Strings', 'Java', 50, 50, 'Mastered', 1),
  ('Linked Lists', 'Java', 25, 25, 'Mastered', 2),
  ('Stacks & Queues', 'Java', 30, 30, 'Mastered', 3),
  ('Trees & Binary Search Trees', 'Java', 45, 42, 'Advanced', 4),
  ('Graphs & Traversals', 'Java', 40, 38, 'Advanced', 5),
  ('Dynamic Programming', 'Java', 50, 45, 'Advanced', 6),
  ('Heaps & Hashing', 'Java', 30, 30, 'Mastered', 7)
on conflict do nothing;
