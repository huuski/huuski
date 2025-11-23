# 🚀 Deploy Rápido e Gratuito - Guia de 5 Minutos

## Deploy Gratuito no Vercel (Recomendado)

### Passo 1: Preparar o Código (2 minutos)

1. Certifique-se de que o código está no GitHub/GitLab/Bitbucket
2. Teste o build localmente:
```bash
npm run build
```
Se funcionar, está pronto!

### Passo 2: Deploy no Vercel (3 minutos)

#### Opção A: Via Web (Mais Fácil)

1. Acesse: https://vercel.com
2. Clique em "Sign Up" e faça login com GitHub
3. Clique em "Add New Project"
4. Selecione seu repositório `huuski`
5. **Configure variáveis de ambiente**:
   - Clique em "Environment Variables"
   - Adicione:
     - Nome: `API_URL`
     - Valor: `https://sua-api.com` (ou `http://localhost:5026` se for local)
6. Clique em "Deploy"
7. Aguarde 2-3 minutos
8. ✅ **Pronto!** Sua app está no ar em `https://seu-projeto.vercel.app`

#### Opção B: Via CLI (Mais Rápido)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (na pasta do projeto)
vercel --prod

# 4. Configurar variáveis (se necessário)
vercel env add API_URL production
```

### Passo 3: Configurar API Backend

Se sua API está em `http://localhost:5026`, você precisa:

**Opção 1: Usar um túnel (para testes rápidos)**
```bash
# Instalar ngrok
npm i -g ngrok

# Criar túnel
ngrok http 5026

# Use a URL do ngrok (ex: https://abc123.ngrok.io) como API_URL no Vercel
```

**Opção 2: Deployar a API também (recomendado)**
- Use Railway, Render, ou Fly.io (todos têm planos gratuitos)
- Configure a URL da API no Vercel

### ✅ Resultado

Sua aplicação estará disponível em:
- **URL**: `https://seu-projeto.vercel.app`
- **SSL**: Automático e gratuito
- **Deploy automático**: A cada push no Git
- **Custo**: R$ 0,00

## 🆓 Outras Opções Gratuitas

### Netlify (Alternativa ao Vercel)
1. Acesse: https://netlify.com
2. Conecte repositório
3. Deploy automático
4. **Gratuito**: 100GB/mês

### Railway (Com créditos gratuitos)
1. Acesse: https://railway.app
2. Conecte repositório
3. **$5 créditos gratuitos/mês**

## ⚠️ Importante

- **API Backend**: Certifique-se de que está acessível publicamente
- **CORS**: Configure CORS na API para aceitar requisições do domínio do Vercel
- **Variáveis de Ambiente**: Configure `API_URL` no painel do Vercel

## 🆘 Problemas Comuns

### Erro de CORS
- Configure CORS na API para aceitar: `https://seu-projeto.vercel.app`

### API não encontrada
- Verifique se `API_URL` está configurada corretamente
- Teste a API diretamente no navegador

### Build falha
- Verifique os logs no Vercel
- Teste localmente: `npm run build`

## 📞 Suporte

- Documentação Vercel: https://vercel.com/docs
- Comunidade: https://github.com/vercel/next.js/discussions

