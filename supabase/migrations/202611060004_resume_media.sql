create table public.resume_assets (
  id uuid primary key,
  filename text not null check (length(filename) between 1 and 180),
  bytes integer not null check (bytes between 1 and 4000000),
  status text not null default 'uploading' check (status in ('uploading', 'ready', 'deleting')),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.resume_assets enable row level security;
revoke all on public.resume_assets from public, anon, authenticated;
grant select, delete on public.resume_assets to authenticated;
grant insert (id, filename, bytes), update (status) on public.resume_assets to authenticated;

create policy "Owner can read assets" on public.resume_assets
  for select to authenticated using (exists (select 1 from public.resume_owner));
create policy "Owner can register assets" on public.resume_assets
  for insert to authenticated with check (exists (select 1 from public.resume_owner));
create policy "Owner can change asset status" on public.resume_assets
  for update to authenticated using (exists (select 1 from public.resume_owner));
create policy "Owner can remove deleted asset records" on public.resume_assets
  for delete to authenticated using (
    status = 'deleting' and not published and exists (select 1 from public.resume_owner)
    and not exists (
      select 1 from storage.objects
      where bucket_id in ('resume-drafts', 'resume-published') and name = id::text
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('resume-drafts', 'resume-drafts', false, 4000000, array['image/webp']),
  ('resume-published', 'resume-published', false, 4000000, array['image/webp']);

create function public.resume_media_ids(document jsonb, prefix text)
returns setof text
language sql immutable
set search_path = ''
as $$
  select distinct substring(source #>> '{}' from length(prefix) + 1)
  from jsonb_path_query(document, '$.**.src') as source
  where jsonb_typeof(source) = 'string' and starts_with(source #>> '{}', prefix);
$$;

create function public.resume_asset_write_allowed(bucket text, object_name text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  asset_status text;
begin
  if not exists (select 1 from public.resume_owner where user_id = (select auth.uid())) then
    return false;
  end if;
  select status into asset_status from public.resume_assets where id::text = object_name for update;
  return (bucket = 'resume-drafts' and asset_status = 'uploading')
      or (bucket = 'resume-published' and asset_status = 'ready');
end;
$$;

create function public.resume_asset_is_public(object_name text)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.resume_assets where id::text = object_name and status = 'ready' and published
  );
$$;

create policy "Owner can read résumé storage" on storage.objects
  for select to authenticated using (
    bucket_id in ('resume-drafts', 'resume-published') and exists (select 1 from public.resume_owner)
  );
create policy "Owner can store immutable résumé images" on storage.objects
  for insert to authenticated with check (
    bucket_id in ('resume-drafts', 'resume-published')
    and public.resume_asset_write_allowed(bucket_id, name)
  );
create policy "Anyone can read released résumé images" on storage.objects
  for select to anon, authenticated using (
    bucket_id = 'resume-published' and public.resume_asset_is_public(name)
  );
create policy "Owner can delete retired résumé images" on storage.objects
  for delete to authenticated using (
    bucket_id in ('resume-drafts', 'resume-published')
    and exists (
      select 1 from public.resume_assets where id::text = name and status = 'deleting' and not published
    )
  );

create function public.check_resume_asset_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = old.status then
    return new;
  end if;
  if old.status = 'uploading' and new.status = 'ready' and exists (
    select 1 from storage.objects where bucket_id = 'resume-drafts' and name = old.id::text
  ) then
    return new;
  end if;
  if new.status <> 'deleting' then
    raise check_violation using message = 'Invalid image status change';
  end if;
  if old.published or exists (
    select 1 from public.resume_drafts as draft
    cross join lateral public.resume_media_ids(draft.document, '/admin/media/') as asset_id
    where asset_id = old.id::text
  ) or exists (
    select 1 from public.resume_versions as version
    cross join lateral public.resume_media_ids(version.document, '/admin/media/') as asset_id
    where asset_id = old.id::text
  ) then
    raise check_violation using message = 'Image is referenced by a draft or version';
  end if;
  return new;
end;
$$;

create function public.check_resume_document_media()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  asset_id text;
  is_publication boolean := tg_table_name = 'resume_publication';
begin
  if is_publication and exists (select 1 from public.resume_media_ids(new.document, '/admin/media/')) then
    raise check_violation using message = 'Public document includes a private image link';
  end if;
  for asset_id in
    select id from public.resume_media_ids(
      new.document, case when is_publication then '/media/' else '/admin/media/' end
    ) as id order by id
  loop
    perform 1 from public.resume_assets where id::text = asset_id and status = 'ready' for update;
    if not found then
      raise check_violation using message = 'A referenced résumé image is unavailable';
    end if;
    if is_publication then
      if not exists (select 1 from storage.objects where bucket_id = 'resume-published' and name = asset_id) then
        raise check_violation using message = 'A published image copy is missing';
      end if;
      update public.resume_assets set published = true where id::text = asset_id;
    end if;
  end loop;
  return new;
end;
$$;

create trigger check_resume_asset_status before update of status on public.resume_assets
  for each row execute function public.check_resume_asset_status();
create trigger check_resume_draft_media before insert or update of document on public.resume_drafts
  for each row execute function public.check_resume_document_media();
create trigger check_resume_publication_media before insert or update of document on public.resume_publication
  for each row execute function public.check_resume_document_media();

revoke all on function public.resume_media_ids(jsonb, text),
  public.check_resume_asset_status(), public.check_resume_document_media(),
  public.resume_asset_write_allowed(text, text), public.resume_asset_is_public(text)
  from public, anon, authenticated;
grant execute on function public.resume_asset_write_allowed(text, text) to authenticated;
grant execute on function public.resume_asset_is_public(text) to anon, authenticated;
