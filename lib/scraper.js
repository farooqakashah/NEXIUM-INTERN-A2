import axios from 'axios';
import * as cheerio from 'cheerio';
import { setTimeout } from 'timers/promises';

export async function scrapeBlog(url) {
  try {
    // Retry logic for handling transient failures
    const maxRetries = 3;
    let attempt = 0;
    let response;

    while (attempt < maxRetries) {
      try {
        response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept':
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          timeout: 15000, // Increased to 15 seconds
        });
        break; // Success, exit retry loop
      } catch (err) {
        attempt++;
        if (attempt === maxRetries) throw err; // Throw error after max retries
        await setTimeout(1000 * attempt); // Exponential backoff
      }
    }

    const $ = cheerio.load(response.data);

    // Extract title
    let title = $('title').text().trim();
    if (!title || title.length < 3) {
      title = $('h1').first().text().trim();
    }
    if (!title || title.length < 3) {
      title = $('meta[property="og:title"]').attr('content') || '';
    }
    if (!title || title.length < 3) {
      title = 'Untitled Blog';
    }

    // Remove unwanted elements
    $('nav, footer, aside, .sidebar, .advertisement, .ad, .comments, .comment-section, script, style, noscript').remove();

    // Expanded selectors for content
    const selectors = [
      'article',
      '.post-content',
      '.entry-content',
      'main',
      '.content',
      '.blog-post',
      '.post-body',
      '.main-content',
      '.post',
      '.article-content',
      '.blog-content',
      '[role="main"]',
      'div[class*="content"]',
      'div[class*="post"]',
      'div[class*="article"]',
    ];

    // Extract content
    let content = '';
    for (const selector of selectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        content = elements.find('p').text() || elements.text();
        if (content.trim()) break;
      }
    }

    // Fallback to all paragraphs
    if (!content.trim()) {
      content = $('p').text();
    }

    // Clean up text
    const cleanedText = content.replace(/\s+/g, ' ').trim();

    // Validate content
    if (!cleanedText || cleanedText.length < 100) {
      throw new Error('No substantial content found');
    }

    return { title, content: cleanedText };
  } catch (error) {
    console.error('Scraping error details:', {
      message: error.message,
      response: error.response ? { status: error.response.status, data: error.response.data } : null,
    });
    throw new Error(`Scraping failed: ${error.message}`);
  }
}