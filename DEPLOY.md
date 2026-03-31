# 🚀 Guia de Deploy

## 📋 Pré-requisitos

- [x] Supabase configurado (ver SUPABASE_SETUP.md)
- [x] Primeiro admin criado
- [x] Testes de segurança passando

## 🌐 Deploy em Produção

### Opção 1: Vercel (Recomendado)

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Fazer Deploy**
```bash
vercel
```

3. **Configurar Variáveis de Ambiente** (opcional)
No dashboard da Vercel:
- Settings > Environment Variables
- Adicione (se quiser usar .env):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

4. **Deploy Automático**
- Conecte seu repositório GitHub
- Cada push na main faz deploy automático

### Opção 2: Netlify

1. **Build Command**
```bash
npm run build
```

2. **Publish Directory**
```
dist
```

3. **Variáveis de Ambiente** (opcional)
- Site settings > Environment variables
- Adicione as mesmas variáveis do Vercel

### Opção 3: GitHub Pages

1. **Instalar gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Adicionar scripts no package.json**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Configurar vite.config.ts**
```typescript
export default defineConfig({
  base: '/nome-do-repositorio/',
  // ... resto da config
})
```

4. **Deploy**
```bash
npm run deploy
```

### Opção 4: Servidor Próprio (VPS)

1. **Build**
```bash
npm run build
```

2. **Copiar pasta dist para servidor**
```bash
scp -r dist/* user@servidor:/var/www/html/
```

3. **Configurar Nginx**
```nginx
server {
    listen 80;
    server_name seudominio.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Checklist Pré-Deploy

### Segurança
- [ ] RLS ativo no Supabase
- [ ] Políticas de segurança testadas
- [ ] Primeiro admin criado
- [ ] SERVICE_ROLE_KEY não exposta
- [ ] HTTPS configurado

### Performance
- [ ] Build otimizado (`npm run build`)
- [ ] Imagens otimizadas
- [ ] Lazy loading implementado
- [ ] Cache configurado

### Funcionalidades
- [ ] Login funcionando
- [ ] Adicionar mídia funcionando
- [ ] Deletar mídia funcionando
- [ ] Galeria carregando
- [ ] Realtime updates funcionando

### SEO (Opcional)
- [ ] Meta tags configuradas
- [ ] robots.txt configurado
- [ ] Sitemap gerado
- [ ] Open Graph tags

## 🔧 Configurações Pós-Deploy

### 1. Configurar Domínio Customizado

**Vercel:**
```
Settings > Domains > Add Domain
```

**Netlify:**
```
Domain settings > Add custom domain
```

### 2. Configurar HTTPS

Ambos Vercel e Netlify configuram HTTPS automaticamente com Let's Encrypt.

### 3. Configurar Redirects

Criar arquivo `public/_redirects` (Netlify) ou `vercel.json` (Vercel):

**Netlify (_redirects):**
```
/*    /index.html   200
```

**Vercel (vercel.json):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 4. Configurar CORS no Supabase

1. Vá em Settings > API
2. Em "CORS Allowed Origins", adicione:
   - `https://seudominio.com`
   - `https://www.seudominio.com`

### 5. Configurar Email Templates (Opcional)

1. Vá em Authentication > Email Templates
2. Customize os templates de:
   - Confirmação de email
   - Recuperação de senha
   - Convite de usuário

## 📊 Monitoramento

### Supabase Dashboard
- Database > Logs
- Authentication > Users
- API > Logs

### Vercel Analytics (se usar Vercel)
```bash
npm install @vercel/analytics
```

```typescript
// src/main.tsx
import { Analytics } from '@vercel/analytics/react';

// Adicione no root
<Analytics />
```

### Google Analytics (Opcional)
```bash
npm install react-ga4
```

## 🔄 CI/CD Automático

### GitHub Actions

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifique CORS no Supabase
- Confirme que a URL do Supabase está correta

### Erro: "Row Level Security"
- Execute `test-security.sql` para verificar políticas
- Confirme que o usuário é admin

### Erro: 404 em rotas
- Configure redirects (ver seção acima)
- Verifique `base` no vite.config.ts

### Erro: Build falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📈 Otimizações de Performance

### 1. Code Splitting
Já implementado com React.lazy (se necessário)

### 2. Image Optimization
```bash
npm install vite-plugin-imagemin
```

### 3. Compression
```bash
npm install vite-plugin-compression
```

Adicionar em `vite.config.ts`:
```typescript
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression()
  ]
})
```

### 4. CDN para Assets
- Use Cloudflare ou similar
- Configure no Vercel/Netlify

## 🎯 Checklist Final

- [ ] Deploy realizado com sucesso
- [ ] HTTPS funcionando
- [ ] Domínio customizado configurado
- [ ] Login funcionando em produção
- [ ] Adicionar/deletar mídia funcionando
- [ ] Galeria carregando corretamente
- [ ] Realtime updates funcionando
- [ ] Performance satisfatória (Lighthouse > 90)
- [ ] SEO básico configurado
- [ ] Monitoramento ativo
- [ ] Backup configurado no Supabase

## 🎉 Pronto!

Seu painel admin está no ar e seguro! 🚀

**URLs Importantes:**
- Site: https://seudominio.com
- Admin: https://seudominio.com/admin
- Supabase: https://jvagwkcytqjiyhnsuugn.supabase.co

**Próximos Passos:**
1. Adicione conteúdo via /admin
2. Monitore logs no Supabase
3. Configure alertas de segurança
4. Considere adicionar 2FA
