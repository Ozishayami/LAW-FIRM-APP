# Supabase migration notes

The initial schema and follow-up changes were applied to the connected Supabase project through the Supabase management connection. The remote migration history currently contains:

- 20261113173543_initial_law_firm_workspace
- 20261113173708_tighten_firm_references
- 20261113173838_optimize_rls_and_foreign_key_indexes
- 20261113173933_remove_duplicate_indexes
- 20261113174012_atomic_firm_workspace_onboarding
- 20261113174208_extend_audit_coverage
- 20261113174222_isolate_firm_onboarding_function

The SQL for the first remote migrations has not yet been exported into checked-in local migration files. Before using the Supabase CLI for future schema work, pull the current remote schema and establish a checked-in baseline migration. Do not run a fresh baseline migration against the already-provisioned database. Use a separate development project/branch for schema iteration where available.

After schema changes, regenerate lib/supabase/database.types.ts from the connected Supabase project and review the security and performance advisors.
