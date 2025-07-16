import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { setTimeout } from 'timers/promises';

export async function scrapeBlog(url: string): Promise<{ title: string; content: string }> {
  if (typeof url !== 'string' || !url.startsWith('http')) {
    throw new Error(`Invalid URL provided to scrapeBlog: ${url}`);
  }

  const maxRetries = 3;
  let attempt = 0;
  let response: AxiosResponse | null = null;

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
        timeout: 15000,
      });
      break;
    } catch (err) {
      attempt++;
      if (attempt === maxRetries) throw err;
      await setTimeout(1000 * attempt);
    }
  }

  // ✅ Ensure response is defined
  if (!response) {
    throw new Error('Failed to fetch the page after retries.');
  }

  const $ = cheerio.load(response.data);

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

  $('nav, footer, aside, .sidebar, .advertisement, .ad, .comments, .comment-section, script, style, noscript').remove();

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

  let content = '';
  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      content = elements.find('p').text() || elements.text();
      if (content.trim()) break;
    }
  }

  if (!content.trim()) {
    content = $('p').text();
  }

  const cleanedText = content.replace(/\s+/g, ' ').trim();

  if (!cleanedText || cleanedText.length < 100) {
    throw new Error('No substantial content found');
  }

  return { title, content: cleanedText };
}
