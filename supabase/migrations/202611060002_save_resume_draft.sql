create function public.save_resume_draft(expected_revision integer, next_document jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_revision integer;
begin
  if not exists (
    select 1 from public.resume_owner where user_id = (select auth.uid())
  ) then
    raise insufficient_privilege using message = 'Résumé owner required';
  end if;

  if next_document is null or jsonb_typeof(next_document) <> 'object'
     or octet_length(next_document::text) > 500000 then
    raise invalid_parameter_value using message = 'Invalid résumé document';
  end if;

  update public.resume_drafts
  set document = next_document, revision = revision + 1, updated_at = now()
  where singleton and schema_version = 1 and revision = expected_revision
  returning revision into saved_revision;

  return saved_revision;
end;
$$;

revoke all on function public.save_resume_draft(integer, jsonb) from public, anon, authenticated;
grant execute on function public.save_resume_draft(integer, jsonb) to authenticated;
