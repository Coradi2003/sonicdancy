# 🔐 Configuração Segura do Supabase

## 📋 Passo a Passo

### 1️⃣ Executar SQL no Supabase

1. Acesse: https://jvagwkcytqjiyhnsuugn.supabase.co
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Cole TODO o conteúdo do arquivo `supabase-setup.sql`
5. Clique em **Run** (ou pressione Ctrl+Enter)

### 2️⃣ Criar Primeiro Usuário Admin

1. Vá em **Authentication** > **Users** no painel do Supabase
2. Clique em **Add User** > **Create new user**
3. Preencha:
   - Email: seu-email@exemplo.com
   - Password: sua-senha-segura
   - Marque: **Auto Confirm User**
4. Clique em **Create User**

### 3️⃣ Tornar o Usuário Admin

1. Volte ao **SQL Editor**
2. Execute este comando (substitua pelo seu email):

```sql
UPDATE profiles SET is_admin = TRUE WHERE email = 'seu-email@exemplo.com';
```

3. Clique em **Run**

### 4️⃣ Testar o Sistema

1. Acesse: `http://localhost:5173/admin`
2. Faça login com o email e senha criados
3. Adicione vídeos do YouTube ou fotos
4. Verifique se aparecem na home automaticamente

## 🔒 Recursos de Segurança Implementados

### ✅ Row Level Security (RLS)
- Todas as tabelas têm RLS ativado
- Políticas específicas para cada operação

### ✅ Políticas de Acesso

**Tabela `profiles`:**
- Usuários veem apenas seu próprio perfil
- Apenas admins veem todos os perfis
- Apenas admins podem modificar perfis

**Tabela `media_items`:**
- ✅ Qualquer pessoa pode VER (para exibir na home pública)
- ❌ Apenas admins podem ADICIONAR
- ❌ Apenas admins podem DELETAR
- ❌ Apenas admins podem EDITAR

### ✅ Autenticação Real
- Sistema de login com email/senha do Supabase
- Sessões seguras com JWT
- Logout adequado

### ✅ Validações
- Verificação de admin em cada operação
- Proteção contra SQL injection (via Supabase)
- Validação de URLs do YouTube

## 🔑 Gerenciamento de Admins

### Adicionar Novo Admin

```sql
UPDATE profiles SET is_admin = TRUE WHERE email = 'novo-admin@exemplo.com';
```

### Remover Admin

```sql
UPDATE profiles SET is_admin = FALSE WHERE email = 'usuario@exemplo.com';
```

### Listar Todos os Admins

```sql
SELECT email, created_at FROM profiles WHERE is_admin = TRUE;
```

## 🚀 Funcionalidades Implementadas

### Realtime Updates
- A galeria atualiza automaticamente quando mídia é adicionada/removida
- Usa Supabase Realtime para sincronização instantânea

### Performance
- Índices otimizados para queries rápidas
- Ordenação por data de criação

### UX
- Loading states em todas as operações
- Mensagens de erro/sucesso claras
- Validação de formulários

## 🛡️ Verificações de Segurança

### Verificar se RLS está ativo:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Resultado esperado: `rowsecurity = true` para ambas as tabelas

### Ver todas as políticas:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';
```

### Testar permissões (como usuário não-admin):

```sql
-- Deve funcionar (SELECT público)
SELECT * FROM media_items;

-- Deve FALHAR (apenas admins)
INSERT INTO media_items (url, type, user_id) 
VALUES ('test', 'image', auth.uid());
```

## 📊 Estrutura das Tabelas

### `profiles`
```
id          UUID (PK, FK -> auth.users)
email       TEXT (UNIQUE, NOT NULL)
is_admin    BOOLEAN (DEFAULT FALSE)
created_at  TIMESTAMP
```

### `media_items`
```
id          UUID (PK, AUTO)
url         TEXT (NOT NULL)
type        TEXT (youtube | image)
user_id     UUID (FK -> auth.users)
created_at  TIMESTAMP
```

## 🔧 Troubleshooting

### Erro: "new row violates row-level security policy"
- Verifique se o usuário é admin: `SELECT is_admin FROM profiles WHERE id = auth.uid();`
- Execute o UPDATE para tornar admin

### Erro: "relation profiles does not exist"
- Execute o SQL completo do arquivo `supabase-setup.sql`

### Mídia não aparece na home
- Verifique se a política "Anyone can view media" está ativa
- Teste: `SELECT * FROM media_items;` (deve funcionar sem login)

### Login não funciona
- Verifique se o usuário foi criado em Authentication > Users
- Confirme que o email está correto
- Verifique se "Auto Confirm User" estava marcado

## 🌐 Produção

Para deploy em produção:

1. ✅ Já está usando variáveis de ambiente seguras
2. ✅ RLS está ativado
3. ✅ Políticas de segurança implementadas
4. ⚠️ Considere adicionar rate limiting
5. ⚠️ Configure email templates personalizados no Supabase
6. ⚠️ Ative 2FA para contas admin (via Supabase Auth)

## 📝 Notas Importantes

- A chave `ANON_KEY` é segura para uso público (RLS protege os dados)
- Nunca exponha a `SERVICE_ROLE_KEY` no frontend
- Backups automáticos estão ativos no Supabase
- Logs de auditoria disponíveis no painel do Supabase
