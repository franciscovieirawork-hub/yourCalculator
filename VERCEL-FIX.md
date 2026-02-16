# 🔧 Fix para Backend no Vercel

## Problema
O backend não está a responder no Vercel.

## Solução

### 1. Verificar Variáveis de Ambiente no Vercel

No dashboard Vercel → Project Settings → Environment Variables, certifica-te que tens:

```
DATABASE_URL=postgres://... (da Neon)
JWT_SECRET=uma-chave-secreta-forte-aleatoria
FRONTEND_URL=https://your-calculator-black.vercel.app
NODE_ENV=production
```

### 2. Verificar Build Settings

No dashboard Vercel → Project Settings → General:

- **Root Directory**: (deixar vazio - usar raiz do projeto)
- **Build Command**: (deixar vazio - o vercel.json já define)
- **Output Directory**: (deixar vazio - o vercel.json já define)
- **Install Command**: (deixar vazio)

### 3. Verificar se o Prisma está a gerar

O backend precisa de gerar o Prisma Client. Verifica nos logs do build se aparece:
```
Running "prisma generate"
```

Se não aparecer, adiciona no `backend/package.json`:
```json
"postinstall": "prisma generate"
```

### 4. Testar o Backend

Depois do deploy, testa:
- `https://your-calculator-black.vercel.app/api/health` → deve retornar `{"ok":true}`
- `https://your-calculator-black.vercel.app/api/calculators` → deve retornar lista de calculadoras

### 5. Se ainda não funcionar

Verifica os logs do build na Vercel:
1. Vai ao projeto no dashboard
2. Clica em "Deployments"
3. Clica no último deployment
4. Vê os logs do build

Possíveis erros:
- **"Cannot find module"** → Dependências não instaladas
- **"Prisma Client not generated"** → Adicionar `postinstall` script
- **"Database connection failed"** → Verificar `DATABASE_URL`
