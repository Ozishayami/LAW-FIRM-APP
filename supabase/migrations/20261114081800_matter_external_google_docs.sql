-- Google Drive document references only; file contents remain in Google Drive.
create table public.matter_external_documents (
 id uuid primary key default gen_random_uuid(),
 firm_id uuid not null references public.firms(id) on delete cascade,
 matter_id uuid not null,
 provider text not null default 'google_drive' check (provider='google_drive'),
 provider_file_id text not null,
 file_name text not null,
 mime_type text,
 web_view_link text not null,
 category text,
 confidentiality text not null default 'standard' check (confidentiality in ('standard','restricted','highly_restricted')),
 provider_modified_at timestamptz,
 provider_revision_id text,
 last_synced_at timestamptz,
 sync_status text not null default 'pending' check (sync_status in ('pending','synced','error','unavailable')),
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint matter_external_documents_matter_fkey foreign key (firm_id,matter_id) references public.matters(firm_id,id) on delete cascade,
 constraint matter_external_documents_provider_file_unique unique (firm_id,provider,provider_file_id)
);
create index matter_external_documents_matter_idx on public.matter_external_documents(firm_id,matter_id,updated_at desc);
alter table public.matter_external_documents enable row level security;
grant select,insert,update,delete on public.matter_external_documents to authenticated;
create policy matter_external_documents_select on public.matter_external_documents for select to authenticated
using (private.has_firm_role(firm_id,array['owner','partner','admin']) or exists(select 1 from public.matter_team_members mtm where mtm.firm_id=matter_external_documents.firm_id and mtm.matter_id=matter_external_documents.matter_id and mtm.user_id=(select auth.uid())));
create policy matter_external_documents_insert on public.matter_external_documents for insert to authenticated with check(private.has_firm_role(firm_id,array['owner','partner','admin']));
create policy matter_external_documents_update on public.matter_external_documents for update to authenticated using(private.has_firm_role(firm_id,array['owner','partner','admin'])) with check(private.has_firm_role(firm_id,array['owner','partner','admin']));
create policy matter_external_documents_delete on public.matter_external_documents for delete to authenticated using(private.has_firm_role(firm_id,array['owner','partner','admin']));
create trigger matter_external_documents_set_updated_at before update on public.matter_external_documents for each row execute function private.set_updated_at();
create trigger matter_external_documents_audit after insert or update or delete on public.matter_external_documents for each row execute function private.audit_row_change();
do $$ begin if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='matter_external_documents') then alter publication supabase_realtime add table public.matter_external_documents; end if; end $$;