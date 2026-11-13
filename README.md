# Law Firm Management System

A desktop-first law firm operations platform, starting with a single firm and designed for future isolated firm workspaces.

## Product scope

- Dashboard and operational overview
- Clients and matters
- Manually managed tasks and checklists with automated reminder capability planned
- Calendar and deadline management
- Gmail / Google Workspace communications
- Fixed-fee and hourly billing, invoices, receipts and expenses
- Documents, team permissions and reports

## Stack

- Next.js App Router, React and TypeScript
- Tailwind CSS v4
- Lucide icons
- Supabase is the planned backend for PostgreSQL, authentication and private file storage
- Gmail API / Google Workspace integration is planned

## Current implementation

The first UI foundation includes a responsive workspace shell, desktop sidebar, mobile navigation, dashboard overview, loading and not-found states, and clearly labelled placeholder routes for planned modules. Dashboard figures are intentionally blank; no sample financial or client data is represented as real firm data.

The workspace shell currently uses illustrative firm and administrator labels. Replace these with authenticated firm and user data when authentication is implemented.

Backend integrations are not connected yet. Do not enter confidential client or financial information until authentication, row-level security, access controls, audit logging and backups have been implemented and reviewed.

## Run locally

1. Install Node.js (current LTS).
2. Clone this repository.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local` when backend credentials are ready.
5. Run `npm run dev` and open `http://localhost:3000`.

## Environment variables

See `.env.example`. Supabase and Google credentials are placeholders only; no secrets belong in source control.

## Next engineering stages

1. Verify local build and refine dashboard interaction patterns.
2. Design the relational schema and firm-scoped access model.
3. Implement Supabase authentication, row-level security and audit events.
4. Build clients, matters, tasks and calendar workflows.
5. Add financial records with immutable audit history and reversal/void flows.
6. Integrate Gmail after OAuth and permission design.
