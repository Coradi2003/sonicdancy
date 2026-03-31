# 🔑 Como Pegar a Chave Correta do Supabase

## Passo a Passo:

1. Acesse: https://jvagwkcytqjiyhnsuugn.supabase.co

2. No menu lateral, clique em: **Settings** (ícone ⚙️)

3. Clique em: **API**

4. Na seção **Project API keys**, você verá:
   - `anon` `public` ← **COPIE ESTA!**
   - `service_role` ← NÃO use esta!

5. Clique no ícone de copiar ao lado da chave `anon`

6. A chave deve ser algo assim (exemplo):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2YWd3a2N5dHFqaXlobnN1dWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzI3NzcsImV4cCI6MjA1ODk0ODc3N30.PARTE_FINAL_DA_CHAVE_AQUI
   ```

## ⚠️ Importante:

- A chave tem 3 partes separadas por pontos (.)
- Começa com `eyJ`
- É bem longa (várias linhas)
- A que você passou (`sb_publishable_...`) NÃO é a chave correta

## 🔧 Depois de Copiar:

Me passe a chave completa ou atualize diretamente em:
- `src/lib/supabase.ts` (linha 4)

Substitua a parte depois de `||` pela chave correta.
