# 📊 Estrutura das Tabelas SQL

## 🗄️ Tabelas Criadas

### 1. `profiles` - Perfis de Usuários

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID do usuário (FK para auth.users) |
| `email` | TEXT | Email do usuário (único) |
| `is_admin` | BOOLEAN | Se o usuário é admin (padrão: false) |
| `created_at` | TIMESTAMP | Data de criação |

**Exemplo de dados:**
```
id: 123e4567-e89b-12d3-a456-426614174000
email: admin@exemplo.com
is_admin: true
created_at: 2024-03-30 10:00:00
```

---

### 2. `media_items` - Itens de Mídia

```sql
CREATE TABLE media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('youtube', 'image')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único da mídia (auto-gerado) |
| `url` | TEXT | URL ou ID do vídeo/imagem |
| `type` | TEXT | Tipo: 'youtube' ou 'image' |
| `user_id` | UUID | ID do admin que adicionou (FK) |
| `created_at` | TIMESTAMP | Data de criação |

**Exemplo de dados (YouTube):**
```
id: 789e4567-e89b-12d3-a456-426614174001
url: dQw4w9WgXcQ
type: youtube
user_id: 123e4567-e89b-12d3-a456-426614174000
created_at: 2024-03-30 11:00:00
```

**Exemplo de dados (Imagem):**
```
id: 789e4567-e89b-12d3-a456-426614174002
url: https://exemplo.com/foto.jpg
type: image
user_id: 123e4567-e89b-12d3-a456-426614174000
created_at: 2024-03-30 11:05:00
```

---

## 🔒 Políticas de Segurança (RLS)

### Tabela `profiles`

#### 1. Users can view own profile
```sql
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```
**Permite:** Usuário ver seu próprio perfil

#### 2. Admins can view all profiles
```sql
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```
**Permite:** Admins verem todos os perfis

#### 3. Admins can update profiles
```sql
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```
**Permite:** Admins modificarem perfis

---

### Tabela `media_items`

#### 1. Anyone can view media
```sql
CREATE POLICY "Anyone can view media"
  ON media_items FOR SELECT
  TO public
  USING (true);
```
**Permite:** Qualquer pessoa ver a galeria (público)

#### 2. Only admins can insert media
```sql
CREATE POLICY "Only admins can insert media"
  ON media_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```
**Permite:** Apenas admins adicionarem mídia

#### 3. Only admins can delete media
```sql
CREATE POLICY "Only admins can delete media"
  ON media_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```
**Permite:** Apenas admins deletarem mídia

#### 4. Only admins can update media
```sql
CREATE POLICY "Only admins can update media"
  ON media_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```
**Permite:** Apenas admins editarem mídia

---

## 🔧 Triggers e Funções

### Função: handle_new_user()
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Propósito:** Criar perfil automaticamente quando novo usuário se registra

### Trigger: on_auth_user_created
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Propósito:** Executar função acima após criação de usuário

---

## 📈 Índices para Performance

```sql
-- Ordenação por data de criação
CREATE INDEX idx_media_items_created_at 
  ON media_items(created_at DESC);

-- Filtro por tipo de mídia
CREATE INDEX idx_media_items_type 
  ON media_items(type);

-- Verificação de admin
CREATE INDEX idx_profiles_is_admin 
  ON profiles(is_admin);
```

**Benefícios:**
- ✅ Queries mais rápidas
- ✅ Ordenação otimizada
- ✅ Filtros eficientes

---

## 🔗 Relacionamentos

```
auth.users (Supabase)
    ↓ (1:1)
profiles
    ↓ (1:N)
media_items
```

**Explicação:**
- Cada usuário do Supabase tem 1 perfil
- Cada perfil pode ter N mídias adicionadas
- Se usuário for deletado, perfil e mídias são deletados (CASCADE)

---

## 📊 Diagrama ER

```
┌─────────────────┐
│   auth.users    │ (Supabase)
│  (Gerenciado)   │
└────────┬────────┘
         │ 1:1
         │
┌────────▼────────┐
│    profiles     │
├─────────────────┤
│ id (PK, FK)     │
│ email           │
│ is_admin        │
│ created_at      │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│  media_items    │
├─────────────────┤
│ id (PK)         │
│ url             │
│ type            │
│ user_id (FK)    │
│ created_at      │
└─────────────────┘
```

---

## 🎯 Queries Comuns

### Listar todos os admins
```sql
SELECT email, created_at 
FROM profiles 
WHERE is_admin = TRUE;
```

### Contar mídias por tipo
```sql
SELECT 
  type,
  COUNT(*) as total
FROM media_items
GROUP BY type;
```

### Ver últimas 10 mídias adicionadas
```sql
SELECT 
  m.type,
  m.url,
  p.email as adicionado_por,
  m.created_at
FROM media_items m
JOIN profiles p ON p.id = m.user_id
ORDER BY m.created_at DESC
LIMIT 10;
```

### Estatísticas gerais
```sql
SELECT 
  (SELECT COUNT(*) FROM profiles) as total_usuarios,
  (SELECT COUNT(*) FROM profiles WHERE is_admin = TRUE) as total_admins,
  (SELECT COUNT(*) FROM media_items) as total_midias,
  (SELECT COUNT(*) FROM media_items WHERE type = 'youtube') as videos,
  (SELECT COUNT(*) FROM media_items WHERE type = 'image') as fotos;
```

---

## 🔐 Verificações de Segurança

### Verificar se RLS está ativo
```sql
SELECT 
  tablename,
  rowsecurity as rls_ativo
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'media_items');
```

**Resultado esperado:**
```
tablename     | rls_ativo
--------------+-----------
profiles      | true
media_items   | true
```

### Listar todas as políticas
```sql
SELECT 
  tablename,
  policyname,
  cmd as comando
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Resultado esperado:** 7 políticas no total

---

## 📝 Notas Importantes

### Constraints
- ✅ `type` só aceita 'youtube' ou 'image'
- ✅ `email` deve ser único
- ✅ `url` não pode ser nulo
- ✅ Foreign keys com CASCADE (deleta em cascata)

### Defaults
- ✅ `is_admin` padrão: FALSE
- ✅ `created_at` padrão: NOW()
- ✅ `id` auto-gerado (UUID)

### Segurança
- ✅ RLS ativo em todas as tabelas
- ✅ Políticas específicas por operação
- ✅ Trigger automático para criar perfis
- ✅ Índices para performance

---

**Arquivo SQL completo:** `supabase-setup.sql`  
**Testes de segurança:** `test-security.sql`  
**Queries úteis:** `useful-queries.sql`
