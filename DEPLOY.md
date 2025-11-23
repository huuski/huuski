# Guia de Deploy para Produção

Este documento descreve como publicar a aplicação Huuski em produção para testes.

## 🆓 Opções Gratuitas para PoC e Testes

Todas as opções abaixo oferecem planos gratuitos suficientes para PoC e testes:

### 1. **Vercel (RECOMENDADO - 100% Gratuito para PoC)**
- ✅ **Plano gratuito**: Ilimitado para projetos pessoais
- ✅ Deploy automático via Git
- ✅ SSL/HTTPS gratuito
- ✅ CDN global
- ✅ Preview deployments para cada PR
- ✅ Sem necessidade de cartão de crédito
- ⚠️ Limite: 100GB de bandwidth/mês (suficiente para testes)

### 2. **Netlify (Gratuito)**
- ✅ **Plano gratuito**: 100GB bandwidth/mês
- ✅ Deploy automático via Git
- ✅ SSL/HTTPS gratuito
- ✅ Sem necessidade de cartão de crédito

### 3. **Railway (Gratuito com créditos)**
- ✅ **$5 créditos gratuitos/mês** (suficiente para PoC)
- ✅ Deploy via Git
- ✅ SSL/HTTPS incluído
- ⚠️ Requer cartão de crédito (mas não cobra se não exceder créditos)

### 4. **Render (Gratuito)**
- ✅ **Plano gratuito**: Apps podem "dormir" após inatividade
- ✅ SSL/HTTPS gratuito
- ✅ Deploy via Git
- ⚠️ Requer cartão de crédito

### 5. **Fly.io (Gratuito)**
- ✅ **$5 créditos gratuitos/mês**
- ✅ Deploy via Git
- ✅ SSL/HTTPS incluído

## Pré-requisitos

1. **Variáveis de Ambiente**: Configure as variáveis de ambiente necessárias
2. **API Backend**: Certifique-se de que a API backend está rodando e acessível
3. **Build**: Teste o build localmente antes de fazer deploy

## 🚀 Opção 1: Vercel (Recomendado - 100% Gratuito para PoC)

### Passo a Passo (100% Gratuito):

#### Método 1: Via Interface Web (Mais Fácil)

1. **Acesse [vercel.com](https://vercel.com)** e crie uma conta gratuita (pode usar GitHub)

2. **Conecte seu repositório**:
   - Clique em "Add New Project"
   - Conecte seu GitHub/GitLab/Bitbucket
   - Selecione o repositório `huuski`

3. **Configure o projeto**:
   - Framework Preset: **Next.js** (detectado automaticamente)
   - Build Command: `npm run build` (padrão)
   - Output Directory: `.next` (padrão)
   - **Não precisa alterar nada!**

4. **Configure variáveis de ambiente**:
   - Na seção "Environment Variables", adicione:
     - `API_URL`: URL da sua API backend (ex: `https://api.seudominio.com` ou `http://localhost:5026` se for local)
     - `NEXT_PUBLIC_APP_URL`: Será preenchido automaticamente após o primeiro deploy

5. **Deploy**:
   - Clique em "Deploy"
   - Aguarde 2-3 minutos
   - Pronto! Sua aplicação estará no ar em `https://seu-projeto.vercel.app`

#### Método 2: Via CLI (Mais Rápido)

1. **Instalar Vercel CLI**:
```bash
npm i -g vercel
```

2. **Fazer login**:
```bash
vercel login
```

3. **Deploy** (na pasta do projeto):
```bash
# Primeiro deploy (vai perguntar algumas coisas)
vercel

# Deploy para produção
vercel --prod
```

4. **Configurar variáveis de ambiente**:
```bash
# Via CLI
vercel env add API_URL production
# Digite a URL da sua API quando solicitado

# Ou configure no painel web: https://vercel.com/seu-usuario/seu-projeto/settings/environment-variables
```

### ✅ Vantagens do Plano Gratuito Vercel:
- ✅ **Ilimitado** para projetos pessoais
- ✅ SSL/HTTPS automático
- ✅ Deploy automático a cada push no Git
- ✅ Preview deployments para cada Pull Request
- ✅ 100GB bandwidth/mês (mais que suficiente para PoC)
- ✅ Sem necessidade de cartão de crédito
- ✅ Domínio personalizado gratuito (opcional)

### Configuração no Vercel:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Opção 2: Netlify

1. **Instalar Netlify CLI**:
```bash
npm i -g netlify-cli
```

2. **Login**:
```bash
netlify login
```

3. **Deploy**:
```bash
# Build local
npm run build

# Deploy
netlify deploy --prod
```

4. **Criar arquivo `netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Opção 3: Docker + Servidor Próprio

### Criar Dockerfile:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Atualizar next.config.ts:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Para Docker
  /* config options here */
};

export default nextConfig;
```

### Build e Deploy:

```bash
# Build da imagem
docker build -t huuski-app .

# Rodar container
docker run -p 3000:3000 \
  -e API_URL=https://sua-api-backend.com \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  huuski-app
```

## Opção 4: AWS/Google Cloud/Azure

### AWS (Amplify ou EC2):

1. **AWS Amplify**:
   - Conecte o repositório
   - Configure build settings
   - Adicione variáveis de ambiente

2. **EC2 com PM2**:
```bash
# No servidor
npm install -g pm2
npm run build
pm2 start npm --name "huuski" -- start
pm2 save
pm2 startup
```

### Google Cloud (Cloud Run):

1. Criar Dockerfile (mesmo do exemplo acima)
2. Build e push:
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/huuski
gcloud run deploy --image gcr.io/PROJECT-ID/huuski
```

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.production` ou configure no painel do seu provedor:

```env
# URL da API Backend
API_URL=https://sua-api-backend.com

# URL pública da aplicação
NEXT_PUBLIC_APP_URL=https://seu-app.com

# Outras variáveis se necessário
NODE_ENV=production
```

## Checklist Antes do Deploy

- [ ] Testar build local: `npm run build`
- [ ] Verificar se todas as variáveis de ambiente estão configuradas
- [ ] Testar a aplicação localmente: `npm start`
- [ ] Verificar se a API backend está acessível
- [ ] Revisar logs de erro
- [ ] Testar autenticação
- [ ] Verificar CORS na API backend
- [ ] Configurar domínio (se necessário)
- [ ] Configurar SSL/HTTPS

## Comandos Úteis

```bash
# Build local
npm run build

# Testar produção localmente
npm start

# Verificar erros de lint
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## Troubleshooting

### Erro de CORS:
- Configure CORS na API backend para aceitar requisições do domínio de produção

### Erro de Variáveis de Ambiente:
- Verifique se todas as variáveis estão configuradas no painel do provedor
- Variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente

### Erro de Build:
- Verifique os logs de build
- Certifique-se de que todas as dependências estão instaladas
- Verifique se há erros de TypeScript

## 🎯 Recomendação para PoC e Testes

**Use Vercel - É 100% gratuito e perfeito para PoC!**

### Por que Vercel?
- ✅ **100% Gratuito** para projetos pessoais
- ✅ **Sem cartão de crédito** necessário
- ✅ Deploy em **menos de 5 minutos**
- ✅ SSL/HTTPS automático
- ✅ Deploy automático a cada push
- ✅ Preview deployments para testar antes de ir para produção
- ✅ Criado pela equipe do Next.js (otimizado para Next.js)

### Tempo estimado para primeiro deploy: **5-10 minutos**

### Custo: **R$ 0,00** (Totalmente gratuito para PoC)

