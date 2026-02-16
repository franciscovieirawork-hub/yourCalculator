# YourCalculator

Calculadoras fiscais e financeiras para Portugal (ano 2026). Site público com opção de registo para guardar perfil e documentos.

## Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, React Router, jsPDF
- **Backend:** Node.js, Express, Prisma
- **Base de dados:** PostgreSQL

## Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

## Instalação

1. Clonar o repositório e instalar dependências:

```bash
cd yourCalculator
npm install
```

2. Configurar a base de dados. Criar ficheiro `backend/.env` a partir do exemplo:

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` e definir:

- `DATABASE_URL` – connection string PostgreSQL (ex: `postgresql://user:password@localhost:5432/yourcalculator`)
- `JWT_SECRET` – chave secreta para tokens (produção: usar valor forte)
- `PORT` – porta do backend (ex: 3001)
- `FRONTEND_URL` – URL do frontend (ex: http://localhost:5173)

3. Criar a base de dados e gerar o cliente Prisma:

```bash
npm run db:generate
npm run db:push
```

4. Iniciar desenvolvimento (backend + frontend em paralelo):

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:3001  

## Estrutura

- `frontend/` – aplicação React (calculadoras, perfil, documentos, auth)
- `backend/` – API REST (auth, perfil, documentos, listagem de calculadoras)
- `backend/prisma/schema.prisma` – modelos User, UserProfile, SavedDocument
- `backend/src/constants/pt-2026.js` – constantes fiscais Portugal 2026 (IRS, TSU, IAS, etc.)

## Funcionalidades

- **Público:** Todas as calculadoras acessíveis sem login; pesquisa e filtro por categoria.
- **Registo/Login:** Opcional; permite guardar perfil (situação fiscal, duodécimos, ADSE, IRS Jovem, região, etc.) e preencher automaticamente as calculadoras.
- **Perfil:** Dados para IRS, SS, recibos verdes, IMI (concelho/taxa), etc.
- **Documentos:** Guardar simulações com título; listar, abrir PDF em nova janela e eliminar.
- **PDF:** Exportar resultado da calculadora para PDF (abre no browser) ou guardar como documento na conta.

## Calculadoras (Portugal 2026)

Incluídas entre outras:

- Salário líquido / bruto necessário, retenção na fonte, horas extras, custo patrão
- Recibos verdes, rendimento relevante SS
- Subsídios férias/Natal, férias proporcionais, indemnizações cessação
- Simulador IRS, escalões IRS, IRS casal, deduções E-fatura, múltiplas fontes
- Contribuições SS, subsídio desemprego, doença/parentalidade, reforma, prestações sociais
- IMI, IMT, crédito habitação
- IUC, depreciação veículo
- Orçamento pessoal, poupança/juros compostos, amortização dívida
- Custo real funcionário, periodização salários, custos formação
- NHR, comparativo anos, comparação cenários, benefícios (stock options, etc.)

*Constantes e fórmulas baseadas na legislação vigente em 16/02/2026; valores indicativos.*

## Comandos úteis

- `npm run dev` – backend + frontend em modo desenvolvimento
- `npm run db:studio` – abrir Prisma Studio para a base de dados
- `npm run build` – build do backend e frontend
