-- ============================================
-- QUERIES ÚTEIS PARA ADMINISTRAÇÃO
-- ============================================

-- 📊 ESTATÍSTICAS
-- ============================================

-- Dashboard completo
SELECT 
  'Total de Usuários' as metrica,
  COUNT(*)::text as valor
FROM profiles

UNION ALL

SELECT 
  'Administradores',
  COUNT(*)::text
FROM profiles
WHERE is_admin = TRUE

UNION ALL

SELECT 
  'Total de Mídias',
  COUNT(*)::text
FROM media_items

UNION ALL

SELECT 
  'Vídeos YouTube',
  COUNT(*)::text
FROM media_items
WHERE type = 'youtube'

UNION ALL

SELECT 
  'Fotos',
  COUNT(*)::text
FROM media_items
WHERE type = 'image';

-- ============================================

-- Mídias mais recentes (últimas 10)
SELECT 
  type,
  url,
  created_at,
  (SELECT email FROM profiles WHERE id = media_items.user_id) as adicionado_por
FROM media_items
ORDER BY created_at DESC
LIMIT 10;

-- ============================================

-- Ranking de admins por mídias adicionadas
SELECT 
  p.email,
  COUNT(m.id) as total_midias,
  COUNT(CASE WHEN m.type = 'youtube' THEN 1 END) as videos,
  COUNT(CASE WHEN m.type = 'image' THEN 1 END) as fotos
FROM profiles p
LEFT JOIN media_items m ON m.user_id = p.id
WHERE p.is_admin = TRUE
GROUP BY p.email
ORDER BY total_midias DESC;

-- ============================================

-- 👥 GERENCIAMENTO DE USUÁRIOS
-- ============================================

-- Listar todos os usuários com status
SELECT 
  p.email,
  p.is_admin,
  p.created_at,
  COUNT(m.id) as midias_adicionadas
FROM profiles p
LEFT JOIN media_items m ON m.user_id = p.id
GROUP BY p.id, p.email, p.is_admin, p.created_at
ORDER BY p.created_at DESC;

-- ============================================

-- Promover usuário a admin
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'usuario@exemplo.com';

-- Remover privilégios de admin
-- UPDATE profiles SET is_admin = FALSE WHERE email = 'usuario@exemplo.com';

-- Deletar usuário (cuidado: deleta também suas mídias por CASCADE)
-- DELETE FROM profiles WHERE email = 'usuario@exemplo.com';

-- ============================================

-- 🎬 GERENCIAMENTO DE MÍDIA
-- ============================================

-- Buscar mídia por URL parcial
SELECT 
  id,
  type,
  url,
  created_at
FROM media_items
WHERE url ILIKE '%termo_busca%'
ORDER BY created_at DESC;

-- ============================================

-- Deletar mídia específica
-- DELETE FROM media_items WHERE id = 'uuid-aqui';

-- Deletar todas as mídias de um tipo
-- DELETE FROM media_items WHERE type = 'youtube';
-- DELETE FROM media_items WHERE type = 'image';

-- Deletar mídias antigas (mais de 30 dias)
-- DELETE FROM media_items 
-- WHERE created_at < NOW() - INTERVAL '30 days';

-- ============================================

-- Atualizar URL de uma mídia
-- UPDATE media_items 
-- SET url = 'nova_url' 
-- WHERE id = 'uuid-aqui';

-- ============================================

-- 🔒 SEGURANÇA E AUDITORIA
-- ============================================

-- Verificar políticas RLS ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as comando,
  CASE 
    WHEN qual IS NOT NULL THEN 'Com restrições'
    ELSE 'Sem restrições'
  END as tipo_restricao
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================

-- Verificar se RLS está ativo
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_ativo
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'media_items');

-- ============================================

-- Ver últimas ações de autenticação
SELECT 
  created_at,
  user_id,
  action,
  ip_address
FROM auth.audit_log_entries
WHERE action IN ('login', 'logout', 'user_signedup')
ORDER BY created_at DESC
LIMIT 20;

-- ============================================

-- 🧹 LIMPEZA E MANUTENÇÃO
-- ============================================

-- Encontrar mídias órfãs (sem usuário)
SELECT 
  id,
  type,
  url,
  created_at
FROM media_items
WHERE user_id IS NULL
   OR NOT EXISTS (
     SELECT 1 FROM auth.users WHERE id = media_items.user_id
   );

-- ============================================

-- Limpar mídias órfãs
-- DELETE FROM media_items
-- WHERE user_id IS NULL
--    OR NOT EXISTS (
--      SELECT 1 FROM auth.users WHERE id = media_items.user_id
--    );

-- ============================================

-- Encontrar perfis órfãos (sem usuário no auth)
SELECT 
  id,
  email,
  created_at
FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = profiles.id
);

-- ============================================

-- Limpar perfis órfãos
-- DELETE FROM profiles
-- WHERE NOT EXISTS (
--   SELECT 1 FROM auth.users WHERE id = profiles.id
-- );

-- ============================================

-- 📈 ANÁLISES E RELATÓRIOS
-- ============================================

-- Mídias adicionadas por dia (últimos 30 dias)
SELECT 
  DATE(created_at) as data,
  COUNT(*) as total,
  COUNT(CASE WHEN type = 'youtube' THEN 1 END) as videos,
  COUNT(CASE WHEN type = 'image' THEN 1 END) as fotos
FROM media_items
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- ============================================

-- Crescimento de usuários por mês
SELECT 
  TO_CHAR(created_at, 'YYYY-MM') as mes,
  COUNT(*) as novos_usuarios,
  SUM(COUNT(*)) OVER (ORDER BY TO_CHAR(created_at, 'YYYY-MM')) as total_acumulado
FROM profiles
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY mes DESC;

-- ============================================

-- 🔧 BACKUP E RESTORE
-- ============================================

-- Exportar todas as mídias (copie o resultado)
SELECT 
  json_agg(
    json_build_object(
      'url', url,
      'type', type,
      'created_at', created_at
    )
  )
FROM media_items;

-- ============================================

-- Importar mídias (ajuste os valores)
-- INSERT INTO media_items (url, type, user_id)
-- VALUES 
--   ('VIDEO_ID_1', 'youtube', 'UUID_DO_ADMIN'),
--   ('https://exemplo.com/foto.jpg', 'image', 'UUID_DO_ADMIN');

-- ============================================

-- 🚨 EMERGÊNCIA
-- ============================================

-- Desativar TODOS os admins (emergência)
-- UPDATE profiles SET is_admin = FALSE;

-- Reativar admin específico
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'admin@exemplo.com';

-- Deletar TODAS as mídias (CUIDADO!)
-- DELETE FROM media_items;

-- Resetar banco (MUITO CUIDADO!)
-- DELETE FROM media_items;
-- DELETE FROM profiles;

-- ============================================
