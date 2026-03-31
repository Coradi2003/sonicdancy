-- ============================================
-- TABELAS E SEGURANÇA PARA PAINEL ADMIN
-- ============================================

-- 1. Criar tabela de perfis (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de mídia (media_items)
CREATE TABLE IF NOT EXISTS media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('youtube', 'image')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE SEGURANÇA - PROFILES
-- ============================================

-- Qualquer usuário autenticado pode ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Apenas admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Apenas admins podem atualizar perfis
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================
-- POLÍTICAS DE SEGURANÇA - MEDIA_ITEMS
-- ============================================

-- Qualquer pessoa pode VER a mídia (para exibir na home)
CREATE POLICY "Anyone can view media"
  ON media_items FOR SELECT
  TO public
  USING (true);

-- Apenas admins podem INSERIR mídia
CREATE POLICY "Only admins can insert media"
  ON media_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Apenas admins podem DELETAR mídia
CREATE POLICY "Only admins can delete media"
  ON media_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Apenas admins podem ATUALIZAR mídia
CREATE POLICY "Only admins can update media"
  ON media_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    FALSE  -- Por padrão, novos usuários NÃO são admins
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando novo usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_media_items_created_at ON media_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- ============================================
-- CRIAR PRIMEIRO USUÁRIO ADMIN (OPCIONAL)
-- ============================================

-- IMPORTANTE: Após criar seu primeiro usuário via interface do Supabase,
-- execute este comando substituindo 'SEU_EMAIL_AQUI' pelo email que você usou:

-- UPDATE profiles SET is_admin = TRUE WHERE email = 'SEU_EMAIL_AQUI';

-- ============================================
-- VERIFICAÇÕES DE SEGURANÇA
-- ============================================

-- Para verificar se RLS está ativo:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Para ver todas as políticas:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
