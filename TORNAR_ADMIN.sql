-- ============================================
-- TORNAR USUÁRIO ADMIN
-- ============================================

-- 1. Ver todos os usuários cadastrados
SELECT 
  id,
  email,
  is_admin,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- ============================================

-- 2. Tornar usuário admin (SUBSTITUA O EMAIL!)
UPDATE profiles 
SET is_admin = TRUE 
WHERE email = 'admin@sonicdancy.com.br';

-- ============================================

-- 3. Verificar se funcionou
SELECT 
  email,
  is_admin
FROM profiles
WHERE email = 'admin@sonicdancy.com.br';

-- Resultado esperado: is_admin = true

-- ============================================
-- COMANDOS ÚTEIS
-- ============================================

-- Tornar TODOS os usuários admin (cuidado!)
-- UPDATE profiles SET is_admin = TRUE;

-- Remover admin de um usuário
-- UPDATE profiles SET is_admin = FALSE WHERE email = 'usuario@exemplo.com';

-- Ver apenas admins
-- SELECT email FROM profiles WHERE is_admin = TRUE;
