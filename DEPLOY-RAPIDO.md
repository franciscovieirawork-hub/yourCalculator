# 🚀 Deploy Rápido - YourCalculator

## Passo 1: Base de Dados (Neon) ✅
Já tens a connection string no `.env`. Vais precisar dela para o backend.

---

## Passo 2: Deploy Backend (Vercel)

### Via Dashboard (mais fácil):

1. **Ir a**: https://vercel.com/new
2. **Importar** o repositório GitHub
3. **Configurações**:
   - **Root Directory**: `backend` ⚠️ IMPORTANTE
   - **Framework Preset**: Other
   - **Build Command**: (deixar vazio)
   - **Output Directory**: (deixar vazio)
   - **Install Command**: `npm install`

4. **Variáveis de Ambiente** (Settings → Environment Variables):
   ```
   DATABASE_URL=postgres://... (da Neon)
   JWT_SECRET=uma-chave-secreta-forte-aleatoria
   FRONTEND_URL=https://yourcalculator-frontend.vercel.app (vais atualizar depois)
   NODE_ENV=production
   ```

5. **Deploy** → Aguardar

6. **Anotar URL**: `https://yourcalculator-backend.vercel.app` (ou similar)

7. **Aplicar schema à BD**:
   ```bash
   cd backend
   npx prisma db push
   ```
   (usa a DATABASE_URL do Neon)

---

## Passo 3: Deploy Frontend (Vercel)

1. **Criar novo projeto**: https://vercel.com/new
2. **Importar** o mesmo repositório
3. **Configurações**:
   - **Root Directory**: `frontend` ⚠️ IMPORTANTE
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (já vem preenchido)
   - **Output Directory**: `dist` (já vem preenchido)

4. **Variável de Ambiente**:
   ```
   VITE_API_URL=https://yourcalculator-backend.vercel.app/api
   ```
   (substituir pela URL real do backend do passo 2)

5. **Deploy** → Aguardar

6. **Anotar URL**: `https://yourcalculator-frontend.vercel.app` (ou similar)

---

## Passo 4: Atualizar CORS do Backend

1. Voltar ao projeto **backend** na Vercel
2. **Settings → Environment Variables**
3. Atualizar `FRONTEND_URL` com a URL real do frontend:
   ```
   FRONTEND_URL=https://yourcalculator-frontend.vercel.app
   ```
4. **Redeploy** (ou esperar que atualize automaticamente)

---

## ✅ Checklist Final

- [ ] Backend deployado e URL anotada
- [ ] `prisma db push` executado (schema aplicado)
- [ ] Frontend deployado com `VITE_API_URL` configurado
- [ ] `FRONTEND_URL` no backend atualizado
- [ ] Testar: abrir frontend → registo → login → usar calculadora

---

## 🔧 Troubleshooting

### Backend não responde
- Verificar `DATABASE_URL` está correta
- Verificar logs na Vercel (Deployments → View Function Logs)

### CORS error
- Verificar `FRONTEND_URL` no backend está correto (sem trailing slash)
- Verificar frontend está a usar `/api/...` ou URL completa

### Prisma Client error
- Verificar que `postinstall` script está no `package.json` do backend
- Se necessário, adicionar manualmente: `"postinstall": "prisma generate"`

### Frontend não encontra API
- Verificar `VITE_API_URL` está definida
- Verificar que começa com `https://` e termina com `/api`

---

## 📝 URLs de Produção

- **Frontend**: `https://yourcalculator-frontend.vercel.app`
- **Backend**: `https://yourcalculator-backend.vercel.app/api`
- **Health check**: `https://yourcalculator-backend.vercel.app/api/health`
