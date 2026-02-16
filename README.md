# YourCalculator

Tax and financial calculators for Portugal (2026). Public website with optional registration to save profile and documents.

## Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, React Router, jsPDF
- **Backend:** Node.js, Express, Prisma
- **Database:** PostgreSQL

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository and install dependencies:

```bash
cd yourCalculator
npm install
```

2. Configure the database. Create `backend/.env` file from the example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set:

- `DATABASE_URL` – PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/yourcalculator`)
- `JWT_SECRET` – secret key for tokens (production: use strong value)
- `PORT` – backend port (e.g., 3001)
- `FRONTEND_URL` – frontend URL (e.g., http://localhost:5173)

3. Create the database and generate Prisma client:

```bash
npm run db:generate
npm run db:push
```

4. Start development (backend + frontend in parallel):

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:3001  

## Structure

- `frontend/` – React application (calculators, profile, documents, auth)
- `backend/` – REST API (auth, profile, documents, calculator listing)
- `backend/prisma/schema.prisma` – User, UserProfile, SavedDocument models
- `backend/src/constants/pt-2026.js` – Portugal 2026 tax constants (IRS, TSU, IAS, etc.)

## Features

- **Public:** All calculators accessible without login; search and filter by category.
- **Register/Login:** Optional; allows saving profile (tax situation, duodécimos, ADSE, IRS Jovem, region, etc.) and automatically filling calculators.
- **Profile:** Data for IRS, SS, recibos verdes, IMI (municipality/rate), etc.
- **Documents:** Save simulations with title; list, open PDF in new window and delete.
- **PDF:** Export calculator result to PDF (opens in browser) or save as document in account.

## Calculators (Portugal 2026)

Included among others:

- Net salary / required gross, tax withholding, overtime, employer cost
- Recibos verdes, relevant SS income
- Holiday/Christmas allowances, proportional holidays, termination indemnities
- IRS simulator, IRS brackets, couple IRS, E-fatura deductions, multiple income sources
- SS contributions, unemployment benefit, sickness/parental leave, pension, social benefits
- IMI, IMT, housing credit
- IUC, vehicle depreciation
- Personal budget, savings/compound interest, debt amortization
- Real employee cost, salary periodization, training costs
- NHR, year comparison, scenario comparison, benefits (stock options, etc.)

*Constants and formulas based on legislation in effect on 16/02/2026; indicative values.*

## Useful Commands

- `npm run dev` – backend + frontend in development mode
- `npm run db:studio` – open Prisma Studio for the database
- `npm run build` – build backend and frontend
