-- Ver todos os itens de mídia
SELECT id, url, type, created_at FROM media_items ORDER BY created_at DESC;

-- Deletar itens com URL vazia ou inválida
DELETE FROM media_items WHERE url IS NULL OR url = '' OR TRIM(url) = '';

-- Ver se há duplicados
SELECT url, type, COUNT(*) as quantidade
FROM media_items
GROUP BY url, type
HAVING COUNT(*) > 1;

-- Deletar duplicados (mantém apenas o mais recente)
DELETE FROM media_items a
USING media_items b
WHERE a.id < b.id
  AND a.url = b.url
  AND a.type = b.type;

-- Verificar resultado final
SELECT COUNT(*) as total_itens FROM media_items;
