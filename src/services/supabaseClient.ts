import { createClient } from '@supabase/supabase-js';

// Get your API keys from Supabase Dashboard
const SUPABASE_URL = 'https://your-project-id.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'your-anon-key'; // Replace with your Supabase Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
