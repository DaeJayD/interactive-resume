create table public.resume_owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users(id) on delete restrict
);

create table public.resume_drafts (
  singleton boolean primary key default true check (singleton),
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  schema_version integer not null default 1 check (schema_version > 0),
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);

alter table public.resume_owner enable row level security;
alter table public.resume_drafts enable row level security;

revoke all on public.resume_owner, public.resume_drafts from public, anon, authenticated;
grant select on public.resume_owner, public.resume_drafts to authenticated;
grant insert (document) on public.resume_drafts to authenticated;

create policy "Owner can read own membership" on public.resume_owner
  for select to authenticated using (user_id = (select auth.uid()));

create policy "Owner can read draft" on public.resume_drafts
  for select to authenticated using (exists (select 1 from public.resume_owner));

create policy "Owner can import draft" on public.resume_drafts
  for insert to authenticated with check (exists (select 1 from public.resume_owner));
