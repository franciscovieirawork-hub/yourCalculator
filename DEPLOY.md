# Guia de Deploy - YourCalculator

## Estrutura
- **Frontend**: React (Vite) → Vercel
- **Backend**: Node.js/Express → Vercel (serverless functions)
- **Base de dados**: PostgreSQL → Neon

## Pré-requisitos
1. Conta Vercel: https://vercel.com
2. Conta Neon: https://neon.tech (já tens)
3. Conta Twilio (opcional, para SMS): https://twilio.com

---

## 1. Configurar Base de Dados (Neon)

1. Aceder ao dashboard Neon: https://console.neon.tech
2. Criar novo projeto (se ainda não existe)
3. Copiar a **Connection String** (formato: `postgresql://user:pass@host/db?sslmode=require`)
4. Guardar para usar nas variáveis de ambiente

---

## 2. Deploy Backend na Vercel

### Opção A: Via CLI (recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Na raiz do projeto
cd backend
vercel

# Seguir instruções:
# - Link to existing project? No
# - Project name: yourcalculator-backend
# - Directory: ./backend
# - Override settings? No
```

### Opção B: Via Dashboard Vercel

1. Ir a https://vercel.com/new
2. Importar repositório GitHub
3. Configurações:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (deixar vazio ou `npm install`)
   - **Output Directory**: (deixar vazio)
   - **Install Command**: `npm install`

### Variáveis de Ambiente (Backend)

No dashboard Vercel → Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://... (da Neon)
JWT_SECRET=uma-chave-secreta-forte-aleatoria
PORT=3001 (opcional, Vercel usa automaticamente)
FRONTEND_URL=https://yourcalculator-frontend.vercel.app

# SMS (Twilio) - opcional
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+351XXXXXXXXX
```

### Depois do deploy:
1. Anotar a URL do backend (ex: `https://yourcalculator-backend.vercel.app`)
2. Executar migrations:
   ```bash
   cd backend
   npx prisma db push --schema=./prisma/schema.prisma
   ```
   (ou usar Prisma Studio para verificar)

---

## 3. Deploy Frontend na Vercel

### Via Dashboard Vercel

1. Criar novo projeto: https://vercel.com/new
2. Importar repositório GitHub
3. Configurações:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Variáveis de Ambiente (Frontend)

No dashboard Vercel → Project Settings → Environment Variables:

```
VITE_API_URL=https://yourcalculator-backend.vercel.app
```

**Nota**: Se usares variáveis com `VITE_`, elas ficam disponíveis no frontend.

### Atualizar API URL no código (se necessário)

Se o frontend não conseguir fazer proxy, atualizar `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 4. Configurar CORS no Backend

O backend já tem CORS configurado com `FRONTEND_URL`. Certifica-te que a variável está correta.

Se necessário, ajustar em `backend/src/index.js`:

```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
```

---

## 5. Estrutura Recomendada (Monorepo)

Se quiseres manter tudo num só projeto Vercel:

1. Criar `vercel.json` na raiz (já criado)
2. Configurar:
   - Backend: `/api/*` → `backend/src/index.js`
   - Frontend: `/*` → `frontend/dist/*`

**Nota**: Vercel suporta monorepos, mas pode ser mais simples ter 2 projetos separados.

---

## 6. Checklist Final

- [ ] Base de dados Neon criada e connection string guardada
- [ ] Backend deployado na Vercel
- [ ] Variáveis de ambiente do backend configuradas
- [ ] `prisma db push` executado na base de dados
- [ ] Frontend deployado na Vercel
- [ ] Variável `VITE_API_URL` configurada no frontend
- [ ] CORS configurado com URL do frontend
- [ ] Testar registo/login
- [ ] Testar recuperação de password (SMS se configurado)

---

## URLs de Produção

- **Frontend**: `https://yourcalculator-frontend.vercel.app`
- **Backend API**: `https://yourcalculator-backend.vercel.app/api`
- **Base de dados**: Neon dashboard

---

## Troubleshooting

### Erro: "Can't reach database"
- Verificar `DATABASE_URL` está correta
- Verificar SSL mode (`?sslmode=require`)

### Erro: CORS
- Verificar `FRONTEND_URL` no backend aponta para o frontend correto
- Verificar que o frontend está a fazer requests para `/api/...` (proxy) ou URL completa do backend

### Erro: Prisma Client
- Executar `npx prisma generate` antes do build
- Adicionar ao `package.json` do backend:
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```

### Build falha
- Verificar que todas as dependências estão em `package.json`
- Verificar que Node.js version está correta (Vercel usa 18.x por padrão)

---

## Comandos Úteis

```bash
# Ver logs do backend
vercel logs

# Deploy manual
vercel --prod

# Ver variáveis de ambiente
vercel env ls
```
