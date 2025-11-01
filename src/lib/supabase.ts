import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://szwkukvnwvdalwlephfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6d2t1a3Zud3ZkYWx3bGVwaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjYxMTcsImV4cCI6MjA3NzUwMjExN30.WzT09-Xf629eoom9Vyf6e06JYZAE8pQh44gzzffQD1s';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Student = {
  id: string;
  name: string;
  college: string;
  year: number;
  image_url: string | null;
  created_at: string;
};
