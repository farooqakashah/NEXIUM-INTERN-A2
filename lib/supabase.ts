// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveSummary(
  url: string,
  summary: string,
  urduSummary: string,
  title: string
): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('summaries')
      .insert([
        {
          url,
          summary,
          urdu_summary: urduSummary,
          title, // ✅ include title!
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Supabase error details:', error);
    throw new Error(`Failed to save summary: ${error.message}`);
  }
}