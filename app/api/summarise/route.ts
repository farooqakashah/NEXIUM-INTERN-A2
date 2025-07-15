// app/api/summarise/route.ts
import { NextResponse } from 'next/server';
import { scrapeBlog } from '@/lib/scraper';
import { generateSummary } from '@/lib/summariser';
import { translateToUrdu } from '@/lib/dictionary';
import { saveSummary } from '@/lib/supabase';
import { saveBlogText } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    // Scrape blog content and title
    const { title, content } = await scrapeBlog(url);

    // Generate summary
    const summary = generateSummary(content);

    // Translate to Urdu
    const urduSummary = translateToUrdu(summary);

    // Save to databases
    await Promise.all([
      saveSummary(url, summary, urduSummary),
      saveBlogText(url, content),
    ]);

    return NextResponse.json({ title, summary, urduSummary }, { status: 200 });
  } catch (error) {
  console.error('Error in /api/summarise:', error);

  const message =
    error instanceof Error
      ? error.message
      : 'Failed to process the request';

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

}

export async function GET() {
  return NextResponse.json({ message: 'API route /api/summarise is active' }, { status: 200 });
}