# Supabase migration notes

The schema was provisioned in the connected Supabase project through the Supabase management connection. The current remote migration history is:

- 20261113173543_initial_law_firm_workspace
- 20261113173708_tighten_firm_references
- 20261113173838_optimize_rls_and_foreign_key_indexes
- 20261113173933_remove_duplicate_indexes
- 20261113174012_atomic_firm_workspace_onboarding
- 20261113174208_extend_audit_coverage
- 20261113174222_isolate_firm_onboarding_function
- 20261113180226_atomic_client_matter_references
- 20261113180315_secure_reference_rpc_execution
- 20261113180509_move_reference_definer_to_private_schema
- 20261113180529_restrict_private_trigger_function_execution

**Important:** The remote migration history exists, but the original SQL migration bodies have not yet been exported into checked-in `supabase/migrations` files. Do not treat this repository as a reproducible schema source yet, and do not run a fresh baseline against the already-provisioned project. Before adopting Supabase CLI for future changes, export/pull the current schema and establish a checked-in baseline safely. Use a separate development project or branch for schema iteration where available.

After schema changes, regenerate `lib/supabase/database.types.ts` from the connected Supabase project and review the security and performance advisors.

The client and matter reference function uses a per-firm database sequence and checks the signed-in user's active firm role. The SECURITY DEFINER helper is kept in the private schema; the exposed public RPC is SECURITY INVOKER.
