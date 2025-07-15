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

    // Validate the URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Valid URL is required' },
        { status: 400 }
      );
    }

    if (typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json(
        { error: 'URL must be a valid HTTP/HTTPS link' },
        { status: 400 }
      );
    }

    // Scrape the blog content and title
    const { title, content } = await scrapeBlog(url);

    // Generate the summary (await in case it's async)
    const summary = await generateSummary(content);

    // Translate the summary to Urdu
    const urduSummary = translateToUrdu(summary);

    // Save to Supabase and MongoDB in parallel
    await Promise.all([
      saveSummary(url, summary, urduSummary),
      saveBlogText(url, content),
    ]);

    return NextResponse.json(
      { title, summary, urduSummary },
      { status: 200 }
    );

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
  return NextResponse.json(
    { message: 'API route /api/summarise is active' },
    { status: 200 }
  );
}
