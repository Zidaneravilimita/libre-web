// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vbeppurbhiqiutpdiepo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiZXBwdXJiaGlxaXV0cGRpZXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2Njc2MTgsImV4cCI6MjA3MzI0MzYxOH0.8Nn8bbwvTmjXnJ0w6czxKxX5jJLZgya9FMyh_rLlcDA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
