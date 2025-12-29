/**
 * Blog Content Generator using Brave News + Groq API
 * Free API solution for automated blog content generation
 */

const fs = require('fs').promises;
const path = require('path');

// API Keys from environment
const BRAVE_API_KEY = process.env.BRAVE_SEARCH_API_KEY || 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

// Configuration
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // or 'llama-3.1-8b-instant' for faster responses

// Sports keywords for Indian market
const SPORTS_KEYWORDS = [
  'cricket India IPL',
  'cricket match India',
  'sports news India',
  'IPL auction',
  'BCCI cricket',
  'India cricket team',
  'T20 cricket',
  'Premier League India',
];

/**
 * Fetch news from Brave News API
 */
async function fetchNews(keyword) {
  console.log(`\n📰 Fetching news for: "${keyword}"`);

  const url = `https://api.search.brave.com/res/v1/news/search?q=${encodeURIComponent(keyword)}&count=5&freshness=7d`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY,
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.log(`   ⚠️  Brave API: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    const results = data.web?.results || [];

    if (results.length === 0) {
      console.log(`   ℹ️  No results found`);
      return null;
    }

    console.log(`   ✅ Found ${results.length} articles`);
    return results;

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Generate blog article using Groq API
 */
async function generateArticle(newsItems, keyword) {
  console.log(`\n🤖 Generating article with Groq...`);

  // Prepare context from news
  const newsContext = newsItems.map((item, i) => `
${i + 1}. ${item.title}
   URL: ${item.url}
   Summary: ${item.description || 'No description'}
`).join('\n');

  const prompt = `You are an expert sports content writer for an Indian audience. Write a SEO-optimized blog article about "${keyword}".

Based on these recent news sources:
${newsContext}

Requirements:
1. Write in English for Indian readers (en-IN)
2. Length: 800-1000 words
3. Use conversational but professional tone
4. Include: catchy title, introduction, 3-4 main sections with headings, conclusion
5. Add relevant keywords for SEO: cricket, India, IPL, sports, etc.
6. Format in Markdown
7. Include internal link suggestions (no actual links needed)
8. Add meta description (150-160 chars)

Output format:
---
title: [SEO Title]
slug: [url-friendly-slug]
meta_description: [Meta description]
---

# Title

[Article content in Markdown]`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert sports content writer specializing in Indian cricket and sports. Write engaging, SEO-optimized content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API ${response.status}: ${error.slice(0, 200)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (!content) {
      throw new Error('Empty response from Groq');
    }

    console.log(`   ✅ Article generated (${content.length} chars)`);
    return content;

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Parse generated content and extract metadata
 */
function parseArticleContent(rawContent) {
  // Extract frontmatter
  const frontmatterMatch = rawContent.match(/---\n([\s\S]+?)\n---/);
  let title = '';
  let slug = '';
  let metaDescription = '';
  let body = rawContent;

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    body = rawContent.replace(frontmatterMatch[0], '').trim();

    // Parse title
    const titleMatch = frontmatter.match(/title:\s*(.+)/);
    if (titleMatch) title = titleMatch[1].trim();

    // Parse slug
    const slugMatch = frontmatter.match(/slug:\s*(.+)/);
    if (slugMatch) slug = slugMatch[1].trim();

    // Parse meta description
    const metaMatch = frontmatter.match(/meta_description:\s*(.+)/);
    if (metaMatch) metaDescription = metaMatch[1].trim();
  }

  // Generate slug if not provided
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  return { title, slug, metaDescription, body };
}

/**
 * Save article to filesystem
 */
async function saveArticle(articleData, keyword) {
  const { title, slug, metaDescription, body } = articleData;

  // Generate date-based directory
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dirName = `${date}-${slug}`;
  const dirPath = path.join(CONTENT_DIR, dirName);

  try {
    await fs.mkdir(dirPath, { recursive: true });

    // Write index.mdx with frontmatter
    const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
excerpt: "${metaDescription.replace(/"/g, '\\"')}"
category: "Cricket News"
tags: ["cricket", "India", "sports"]
---

${body}
`;

    await fs.writeFile(path.join(dirPath, 'index.mdx'), mdxContent);

    console.log(`\n💾 Article saved: src/content/posts/${dirName}/index.mdx`);
    console.log(`   Title: ${title}`);
    console.log(`   Slug: ${slug}`);

    return { success: true, path: dirPath };

  } catch (error) {
    console.log(`   ❌ Save error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main generation function
 */
async function generateBlogArticle() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Blog Content Generator (Brave + Groq)   ║');
  console.log('╚════════════════════════════════════════════╝');

  // Try each keyword until we get news results
  let newsItems = null;
  let usedKeyword = '';

  for (const keyword of SPORTS_KEYWORDS) {
    newsItems = await fetchNews(keyword);
    if (newsItems && newsItems.length > 0) {
      usedKeyword = keyword;
      break;
    }
  }

  if (!newsItems || newsItems.length === 0) {
    console.log('\n❌ No news found for any keyword. Exiting.');
    return;
  }

  // Generate article
  const rawContent = await generateArticle(newsItems, usedKeyword);

  if (!rawContent) {
    console.log('\n❌ Failed to generate article. Exiting.');
    return;
  }

  // Parse and save
  const articleData = parseArticleContent(rawContent);
  const result = await saveArticle(articleData, usedKeyword);

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   Generation Complete                      ║');
  console.log('╚════════════════════════════════════════════╝');

  return result;
}

// Run if called directly
if (require.main === module) {
  generateBlogArticle()
    .then((result) => {
      if (result?.success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateBlogArticle };
