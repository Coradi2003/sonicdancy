-- ============================================
-- SCRIPT DE TESTE DE SEGURANÇA
-- Execute estes comandos para verificar se tudo está funcionando
-- ============================================

-- 1. Verificar se RLS está ativo
SELECT 
  tablename, 
  rowsecurity as "RLS Ativo"
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'media_items');

-- Resultado esperado: rowsecurity = true para ambas

-- ============================================

-- 2. Listar todas as políticas de segurança
SELECT 
  tablename as "Tabela",
  policyname as "Política",
  cmd as "Comando",
  roles as "Roles"
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Resultado esperado: 7 políticas no total

-- ============================================

-- 3. Verificar admins existentes
SELECT 
  email,
  is_admin as "É Admin?",
  created_at as "Criado em"
FROM profiles
WHERE is_admin = TRUE;

-- ============================================

-- 4. Contar mídia por tipo
SELECT 
  type as "Tipo",
  COUNT(*) as "Quantidade"
FROM media_items
GROUP BY type;

-- ============================================

-- 5. Ver últimas 5 mídias adicionadas
SELECT 
  type as "Tipo",
  LEFT(url, 50) as "URL",
  created_at as "Adicionado em"
FROM media_items
ORDER BY created_at DESC
LIMIT 5;

-- ============================================

-- 6. Verificar integridade dos dados
SELECT 
  'Profiles sem usuário' as "Verificação",
  COUNT(*) as "Problemas"
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id = p.id
)

UNION ALL

SELECT 
  'Mídia sem usuário',
  COUNT(*)
FROM media_items m
WHERE user_id IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.id = m.user_id
  );

-- Resultado esperado: 0 problemas em ambos

-- ============================================

-- 7. Testar permissão de SELECT público (deve funcionar)
-- Este comando simula acesso sem autenticação
SET ROLE anon;
SELECT COUNT(*) as "Mídias visíveis publicamente" FROM media_items;
RESET ROLE;

-- ============================================

-- 8. Ver estatísticas gerais
SELECT 
  (SELECT COUNT(*) FROM profiles) as "Total Usuários",
  (SELECT COUNT(*) FROM profiles WHERE is_admin = TRUE) as "Total Admins",
  (SELECT COUNT(*) FROM media_items) as "Total Mídias",
  (SELECT COUNT(*) FROM media_items WHERE type = 'youtube') as "Vídeos YouTube",
  (SELECT COUNT(*) FROM media_items WHERE type = 'image') as "Fotos";

-- ============================================
-- COMANDOS ÚTEIS PARA ADMINISTRAÇÃO
-- ============================================

-- Tornar usuário admin (substitua o email)
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'usuario@exemplo.com';

-- Remover admin (substitua o email)
-- UPDATE profiles SET is_admin = FALSE WHERE email = 'usuario@exemplo.com';

-- Deletar mídia específica (substitua o ID)
-- DELETE FROM media_items WHERE id = 'uuid-aqui';

-- Limpar todas as mídias (CUIDADO!)
-- DELETE FROM media_items;

-- Ver logs de autenticação (últimas 10)
-- SELECT 
--   created_at,
--   user_id,
--   action,
--   ip_address
-- FROM auth.audit_log_entries
-- ORDER BY created_at DESC
-- LIMIT 10;
