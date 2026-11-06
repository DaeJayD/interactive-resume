create table public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  schema_version integer not null check (schema_version > 0),
  source_revision integer not null unique check (source_revision > 0),
  created_at timestamptz not null default now()
);

create table public.resume_publication (
  singleton boolean primary key default true check (singleton),
  version_id uuid not null references public.resume_versions(id),
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  schema_version integer not null check (schema_version > 0)
);

alter table public.resume_versions enable row level security;
alter table public.resume_publication enable row level security;

revoke all on public.resume_versions, public.resume_publication from public, anon, authenticated;
grant select on public.resume_versions to authenticated;
grant select on public.resume_publication to anon, authenticated;

create policy "Owner can read version history" on public.resume_versions
  for select to authenticated using (exists (select 1 from public.resume_owner));

create policy "Anyone can read the live snapshot" on public.resume_publication
  for select to anon, authenticated using (true);

create function public.publish_resume_draft(expected_revision integer, public_document jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  draft public.resume_drafts%rowtype;
  published_version uuid;
begin
  if not exists (
    select 1 from public.resume_owner where user_id = (select auth.uid())
  ) then
    raise insufficient_privilege using message = 'Résumé owner required';
  end if;

  select * into draft from public.resume_drafts where singleton for update;

  -- A retry returns the original version without moving the live pointer.
  select id into published_version from public.resume_versions
  where source_revision = expected_revision;
  if found then
    return published_version;
  end if;

  if draft.revision is distinct from expected_revision or draft.schema_version is distinct from 1 then
    return null;
  end if;

  if public_document is null or jsonb_typeof(public_document) <> 'object'
     or octet_length(public_document::text) > 500000 then
    raise invalid_parameter_value using message = 'Invalid public résumé document';
  end if;

  insert into public.resume_versions (document, schema_version, source_revision)
  values (draft.document, draft.schema_version, draft.revision)
  returning id into published_version;

  insert into public.resume_publication (singleton, version_id, document, schema_version)
  values (true, published_version, public_document, draft.schema_version)
  on conflict (singleton) do update
  set version_id = excluded.version_id,
      document = excluded.document,
      schema_version = excluded.schema_version;

  return published_version;
end;
$$;

create function public.restore_resume_version(selected_version uuid, expected_revision integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  restored_revision integer;
begin
  if not exists (
    select 1 from public.resume_owner where user_id = (select auth.uid())
  ) then
    raise insufficient_privilege using message = 'Résumé owner required';
  end if;

  update public.resume_drafts as draft
  set document = version.document, revision = draft.revision + 1, updated_at = now()
  from public.resume_versions as version
  where draft.singleton and draft.revision = expected_revision and draft.schema_version = 1
    and version.id = selected_version and version.schema_version = draft.schema_version
  returning draft.revision into restored_revision;

  return restored_revision;
end;
$$;

revoke all on function public.publish_resume_draft(integer, jsonb) from public, anon, authenticated;
revoke all on function public.restore_resume_version(uuid, integer) from public, anon, authenticated;
grant execute on function public.publish_resume_draft(integer, jsonb) to authenticated;
grant execute on function public.restore_resume_version(uuid, integer) to authenticated;
