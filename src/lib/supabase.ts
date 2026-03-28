import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Student = {
  id: string;
  name: string;
  college: string;
  year: number;
  image_url: string | null;
  created_at: string;
  position: number | null;
};
