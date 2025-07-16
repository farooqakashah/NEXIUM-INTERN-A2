import { NextResponse } from 'next/server';
import { scrapeBlog } from '@/lib/scraper';
import { generateSummary } from '@/lib/summariser';
import { translateToUrdu } from '@/lib/dictionary';
import { saveSummary } from '@/lib/supabase';
import { saveBlogText } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    const { title, content } = await scrapeBlog(url);
    const summary = generateSummary(content);
    const urduSummary = translateToUrdu(summary);

    await Promise.all([
      saveSummary(url, summary, urduSummary, title),
      saveBlogText(url, content),
    ]);

    return NextResponse.json({ title, summary, urduSummary }, { status: 200 });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /api/summarise:', {
        message: error.message,
        stack: error.stack,
      });
      return NextResponse.json(
        { error: error.message || 'Failed to process the request' },
        { status: 500 }
      );
    } else {
      console.error('Unknown error in /api/summarise:', error);
      return NextResponse.json(
        { error: 'Failed to process the request' },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'API route /api/summarise is active' },
    { status: 200 }
  );
}
