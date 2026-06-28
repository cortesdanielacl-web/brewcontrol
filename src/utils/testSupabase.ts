import { supabase } from '../lib/supabase';

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('recipes').select('*').limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return;
    }

    console.log('Supabase connection OK:', data);
  } catch (err) {
    console.error('Supabase connection error:', err);
  }
}
