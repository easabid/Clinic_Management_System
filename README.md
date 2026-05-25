# Clinic Management — Monorepo

This workspace contains the backend API and the frontend Next.js app for the Clinic Management System.

Structure
- Backend (NestJS): [clinic-management-api/README.md](clinic-management-api/README.md#L1-L8)
- Frontend (Next.js): [frontend/README.md](frontend/README.md#L1-L20)

Quick commands (from workspace root)

```bash
# install all workspace packages
npm run install:all

# start backend in dev mode
npm run dev:backend

# start frontend in dev mode
npm run dev:frontend

# run lint/build/test across workspaces
npm run lint
npm run build
npm run test
```

Next steps
- Consolidate duplicate nested folders under `clinic-management-api/` (optional backup before removal).
- Standardize workspace scripts and CI.
