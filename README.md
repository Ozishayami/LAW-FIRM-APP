# Counsel — Law Firm Operations Workspace

A desktop-first legal practice operations platform built with Next.js and Supabase. The data model is firm-scoped from day one so multiple law firms can be supported with database-enforced isolation.

## Stack
- Next.js App Router, React and TypeScript
- Tailwind CSS v4 and Lucide icons
- Supabase PostgreSQL, Auth, Row Level Security and private Storage
- Gmail / Google Workspace integration planned

## Supabase database modules
- Firms, profiles and firm memberships
- Clients and client contacts
- Matters, matter team members and matter parties
- Tasks, checklist templates and checklist items
- Calendar events and reminders
- Time entries, invoices and invoice line items
- Payments, payment allocations and payment reversals
- Expenses, disbursements and client trust accounts / transactions
- Documents and communications
- Firm numbering sequences and audit logs

Every business table includes a firm scope. Access is controlled by RLS and membership roles. Financial tables have a narrower role set than ordinary matter and task records. Audit rows are written by database triggers and are not directly writable by application users. The document bucket is private and its object path must start with the firm's UUID.

**Important:** The schema is a foundation, not a completed legal-accounting product. Financial posting rules, trust reconciliation, invoice totals, matter-level confidentiality permissions, retention policies and backup/recovery procedures still require implementation and review before real client or financial records are entered.

## Authentication
- Supabase Auth email magic-link sign-in.
- The login flow does not create new users (shouldCreateUser is false).
- Existing users must first be invited/created by an administrator in Supabase Auth.
- After sign-in, users without a firm membership are sent to firm setup and become the initial owner of the firm they create.
- Middleware checks the signed-in user's active membership before allowing access to the workspace.

Configure the Auth email templates and redirect allow-list in Supabase. Add local and production callback URLs ending in /auth/callback.

## Local development
1. Install Node.js (current LTS).
2. Clone the repository and check out the feature branch.
3. Copy .env.example to .env.local.
4. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY using the project's Connect dialog.
5. Run npm install.
6. Run npm run dev and open http://localhost:3000.

Run npm run typecheck, npm run lint and npm run build before deployment.

## Environment variables
Only the Supabase project URL and publishable key belong in browser configuration. Never put a Supabase secret/service-role key in a NEXT_PUBLIC variable or commit it to Git. Gmail OAuth variables are placeholders. Gmail is not connected yet.

## Tasks and calendar
- Task and event queries are scoped to the active firm and remain subject to Supabase RLS.
- Task status, priority, assignee, due date, client and matter filters are available.
- Checklist templates create multiple task records in one request; templates are created through an atomic database RPC.
- Calendar supports hearings, filing deadlines, meetings, limitation dates, internal deadlines, reminders and other events.
- Task due dates appear in the calendar as read-only items; no duplicate calendar records are created.
- Dates and times are entered/displayed in Africa/Lagos time. Reminder delivery, recurrence, drag-and-drop and external calendar sync are not implemented.

## Implementation status
- [x] Responsive workspace shell and initial dashboard
- [x] Supabase database schema and RLS foundation deployed
- [x] Private document storage bucket and storage policies
- [x] Audit triggers for important record changes
- [x] Supabase SSR client utilities and auth callback
- [x] Email magic-link sign-in and first-firm setup
- [ ] Live dashboard metrics and firm profile data
- [x] Client directory, create flow, status updates and client detail pages
- [x] Matter register, open-matter flow, status updates and matter detail pages
- [x] Task register with search, filters, assignment, due dates, status updates and detail pages
- [x] Reusable checklist templates and task generation
- [x] Calendar month and agenda views, event creation/editing, filters and read-only task due dates
- [ ] Scheduled reminder delivery and external calendar sync
- [ ] Financial workflows, posting rules and trust reconciliation
- [ ] Document upload/versioning UI
- [ ] Team invitations and granular matter permissions
- [ ] Gmail OAuth and communications UI
- [ ] Automated tests, deployment and security review