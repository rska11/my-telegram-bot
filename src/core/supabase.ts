import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../../.env') });

import { createClient } from '@supabase/supabase-js';

console.log('🚨 SUPABASE_URL in supabase.ts:', process.env.SUPABASE_URL);
console.log('🚨 SUPABASE_ANON_KEY in supabase.ts:', process.env.SUPABASE_ANON_KEY?.slice(0, 10));

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
