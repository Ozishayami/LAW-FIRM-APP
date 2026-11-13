create or replace function public.create_checklist_template(
  p_firm_id uuid,p_name text,p_description text,p_items jsonb
) returns uuid
language plpgsql security invoker set search_path = ''
as $$
declare new_template_id uuid; item jsonb; item_order integer := 0;
begin
 if not private.has_firm_role(p_firm_id,array['owner','partner','admin','lawyer','paralegal']) then
  raise exception 'You do not have permission to create checklist templates' using errcode='42501';
 end if;
 if length(trim(coalesce(p_name,''))) not between 1 and 160 then
  raise exception 'Template name must be between 1 and 160 characters' using errcode='22023';
 end if;
 if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 100 then
  raise exception 'A checklist must contain between 1 and 100 items' using errcode='22023';
 end if;
 insert into public.checklist_templates(firm_id,name,description,created_by)
 values(p_firm_id,trim(p_name),nullif(trim(coalesce(p_description,'')),''),(select auth.uid()))
 returning id into new_template_id;
 for item in select value from jsonb_array_elements(p_items) loop
  if length(trim(coalesce(item->>'title',''))) not between 1 and 240 then
   raise exception 'Every checklist item needs a title of 1 to 240 characters' using errcode='22023';
  end if;
  insert into public.checklist_template_items(firm_id,template_id,title,description,sort_order,default_due_days)
  values(p_firm_id,new_template_id,trim(item->>'title'),nullif(trim(coalesce(item->>'description','')),''),
   item_order,case when coalesce(item->>'default_due_days','') ~ '^[0-9]+$' then (item->>'default_due_days')::integer else null end);
  item_order := item_order + 1;
 end loop;
 return new_template_id;
end;
$$;
revoke all on function public.create_checklist_template(uuid,text,text,jsonb) from public,anon;
grant execute on function public.create_checklist_template(uuid,text,text,jsonb) to authenticated;
