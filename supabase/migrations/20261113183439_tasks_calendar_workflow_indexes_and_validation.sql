-- Applied to the connected Supabase project as
-- 20261113183439_tasks_calendar_workflow_indexes_and_validation.
-- The original remote schema baseline remains unexported; see supabase/README.md.
create index if not exists tasks_firm_due_at_idx on public.tasks (firm_id, due_at) where due_at is not null;
create index if not exists tasks_firm_status_priority_idx on public.tasks (firm_id, status, priority);
create index if not exists tasks_firm_assignee_due_idx on public.tasks (firm_id, assigned_to, due_at) where assigned_to is not null;
create index if not exists calendar_events_firm_starts_at_idx on public.calendar_events (firm_id, starts_at);
create index if not exists calendar_events_firm_assignee_starts_at_idx on public.calendar_events (firm_id, assigned_to, starts_at) where assigned_to is not null;
create index if not exists checklist_template_items_order_idx on public.checklist_template_items (firm_id, template_id, sort_order);

do $$
begin
  if not exists (select 1 from pg_constraint where conname='calendar_events_end_after_start_check' and conrelid='public.calendar_events'::regclass) then
    alter table public.calendar_events add constraint calendar_events_end_after_start_check
      check (ends_at is null or ends_at >= starts_at) not valid;
  end if;
end $$;
alter table public.calendar_events validate constraint calendar_events_end_after_start_check;

create or replace function private.validate_work_item_links()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare linked_client_id uuid;
begin
  if new.assigned_to is not null and not exists (
    select 1 from public.firm_memberships fm
    where fm.firm_id=new.firm_id and fm.user_id=new.assigned_to and fm.status='active'
  ) then
    raise exception 'Assignee must be an active member of this firm' using errcode='23514';
  end if;
  if new.matter_id is not null and new.client_id is not null then
    select m.client_id into linked_client_id from public.matters m
    where m.firm_id=new.firm_id and m.id=new.matter_id;
    if linked_client_id is distinct from new.client_id then
      raise exception 'The selected client must be the client linked to the selected matter' using errcode='23514';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function private.validate_work_item_links() from public, anon, authenticated;
drop trigger if exists tasks_validate_links on public.tasks;
create trigger tasks_validate_links before insert or update of firm_id,matter_id,client_id,assigned_to
on public.tasks for each row execute function private.validate_work_item_links();
drop trigger if exists calendar_events_validate_links on public.calendar_events;
create trigger calendar_events_validate_links before insert or update of firm_id,matter_id,client_id,assigned_to
on public.calendar_events for each row execute function private.validate_work_item_links();
