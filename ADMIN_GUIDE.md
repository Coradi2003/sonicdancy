# 🎯 Guia Rápido do Painel Admin

## 🚀 Início Rápido

### 1. Configurar Supabase (PRIMEIRA VEZ)
Siga as instruções detalhadas em: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

Resumo:
1. Execute o SQL em `supabase-setup.sql` no Supabase
2. Crie um usuário em Authentication > Users
3. Torne-o admin com: `UPDATE profiles SET is_admin = TRUE WHERE email = 'seu-email';`

### 2. Acessar o Painel
1. Acesse: `http://localhost:5173/admin`
2. Faça login com email e senha criados no Supabase

## ✨ Funcionalidades

### Adicionar Vídeos do YouTube
1. Aba "Vídeo YouTube"
2. Cole a URL: `https://youtube.com/watch?v=VIDEO_ID`
3. Clique em "Adicionar"
4. Aparece automaticamente na home! 🎉

### Adicionar Fotos
1. Aba "Foto (URL)"
2. Cole a URL da imagem
3. Clique em "Adicionar"
4. Aparece automaticamente na home! 🎉

### Remover Mídia
- Clique no ícone 🗑️ ao lado do item

## 🔒 Segurança Implementada

✅ Autenticação real com Supabase Auth  
✅ Row Level Security (RLS) ativo  
✅ Apenas admins podem adicionar/remover  
✅ Galeria pública (qualquer um vê)  
✅ Proteção contra SQL injection  
✅ Sessões seguras com JWT  
✅ Realtime updates automáticos  

## 👥 Gerenciar Admins

### Adicionar novo admin:
```sql
UPDATE profiles SET is_admin = TRUE WHERE email = 'novo-admin@exemplo.com';
```

### Remover admin:
```sql
UPDATE profiles SET is_admin = FALSE WHERE email = 'usuario@exemplo.com';
```

## 🧪 Testar Segurança

Execute os comandos em `test-security.sql` no SQL Editor do Supabase

## 📁 Arquivos Importantes

- `supabase-setup.sql` - SQL para criar tabelas e segurança
- `SUPABASE_SETUP.md` - Guia completo de configuração
- `test-security.sql` - Scripts de teste e verificação
- `src/lib/supabase.ts` - Configuração do cliente Supabase
- `src/pages/Admin.tsx` - Painel administrativo

## 🆘 Problemas Comuns

**"Acesso negado"**
→ Execute: `UPDATE profiles SET is_admin = TRUE WHERE email = 'seu-email';`

**"Erro ao carregar mídia"**
→ Verifique se executou o `supabase-setup.sql` completo

**Login não funciona**
→ Confirme que criou o usuário em Authentication > Users

## 🌐 Produção

O sistema já está pronto para produção:
- ✅ RLS ativo
- ✅ Políticas de segurança
- ✅ Chaves públicas seguras
- ⚠️ Considere adicionar rate limiting
- ⚠️ Configure 2FA para admins
