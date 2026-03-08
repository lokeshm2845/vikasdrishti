import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase URL:', supabaseUrl); // Add this for debugging

export const supabase = createClient(supabaseUrl, supabaseKey);