-- Additive checklist template item support.
-- The original remote baseline is not yet exported; see supabase/README.md.
create table if not exists public.checklist_template_items (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  template_id uuid not null,
  title text not null,
  description text,
  sort_order integer not null default 0,
  default_due_days integer,
  created_at timestamptz not null default now(),
  constraint checklist_template_items_firm_id_template_id_fkey
    foreign key (firm_id,template_id) references public.checklist_templates(firm_id,id) on delete cascade
);
create index if not exists checklist_template_items_order_idx
 on public.checklist_template_items(firm_id,template_id,sort_order);
alter table public.checklist_template_items enable row level security;
do $$
begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='checklist_template_items' and policyname='checklist_template_items_select') then
  create policy checklist_template_items_select on public.checklist_template_items for select to authenticated using(private.is_firm_member(firm_id));
 end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='checklist_template_items' and policyname='checklist_template_items_insert') then
  create policy checklist_template_items_insert on public.checklist_template_items for insert to authenticated with check(private.has_firm_role(firm_id,array['owner','partner','admin','lawyer','paralegal']));
 end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='checklist_template_items' and policyname='checklist_template_items_update') then
  create policy checklist_template_items_update on public.checklist_template_items for update to authenticated using(private.has_firm_role(firm_id,array['owner','partner','admin','lawyer','paralegal'])) with check(private.has_firm_role(firm_id,array['owner','partner','admin','lawyer','paralegal']));
 end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='checklist_template_items' and policyname='checklist_template_items_delete') then
  create policy checklist_template_items_delete on public.checklist_template_items for delete to authenticated using(private.has_firm_role(firm_id,array['owner','partner','admin']));
 end if;
 if not exists(select 1 from information_schema.triggers where event_object_schema='public' and event_object_table='checklist_template_items' and trigger_name='checklist_template_items_audit') then
  create trigger checklist_template_items_audit after insert or update or delete on public.checklist_template_items for each row execute function private.audit_row_change();
 end if;
end $$;
