// app/api/summarise/route.ts
import { NextResponse } from 'next/server';
import { scrapeBlog } from '@/lib/scraper';
import { generateSummary } from '@/lib/summariser';
import { translateToUrdu } from '@/lib/dictionary';
import { saveSummary } from '@/lib/supabase';
import { saveBlogText } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[DEBUG] Body:', body);

    const url = body?.url?.trim?.() || '';

    if (typeof url !== 'string' || url.length === 0) {
      console.error('[DEBUG] URL is invalid:', url);
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    if (!url.startsWith('http')) {
      console.error('[DEBUG] URL does not start with http/https:', url);
      return NextResponse.json({ error: 'URL must start with http/https' }, { status: 400 });
    }

    console.log('[DEBUG] Scraping blog for URL:', url);
    const { title, content } = await scrapeBlog(url);

    console.log('[DEBUG] Generating summary...');
    const summary = generateSummary(content || '');

    console.log('[DEBUG] Translating to Urdu...');
    const urduSummary = translateToUrdu(summary);

    console.log('[DEBUG] Saving...');
    await Promise.all([
      saveSummary(url, summary, urduSummary),
      saveBlogText(url, content),
    ]);

    console.log('[DEBUG] Done!');
    return NextResponse.json({ title, summary, urduSummary }, { status: 200 });
  } catch (error) {
    console.error('[ERROR] /api/summarise failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API route /api/summarise is active' }, { status: 200 });
}
