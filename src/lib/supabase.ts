import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jvagwkcytqjiyhnsuugn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2YWd3a2N5dHFqaXlobnN1dWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzI3NzcsImV4cCI6MjA1ODk0ODc3N30.TfrJ7yJRU5i66qFIoBFI-w_DmAPBiRB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MediaItem {
  id: string;
  url: string;
  type: 'youtube' | 'image';
  created_at: string;
  user_id: string;
}

export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}
