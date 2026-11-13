-- Keep the pre-existing calendar_firm_start_idx and remove the duplicate index added by the workflow migration.
drop index if exists public.calendar_events_firm_starts_at_idx;
