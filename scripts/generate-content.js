/**
 * Full Content Generation Test
 * Uses Brave News API + Chutes.ai (or fallback)
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';
const CHUTES_API_KEY = 'cpk_917d54141b5446bdac51407cc45954d1.3b7e58ac24245c07b904fea7f98d7587.AxOOOIcIeHzn9eXCLnzIgsdITB4uvOMB';

// Step 1: Fetch News from Brave
async function fetchNews() {
  console.log('\n=== Step 1: Fetching News ===\n');

  const queries = ['cricket India', 'IPL 2025', 'India sports'];
  const allNews = [];

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://api.search.brave.com/res/v1/news/search?q=${encodeURIComponent(query)}&count=3&freshness=7d`,
        {
          headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': BRAVE_API_KEY,
          },
        }
      );

      const data = await response.json();
      const results = data.web?.results || [];

      for (const item of results) {
        allNews.push({
          title: item.title || '',
          url: item.url || '',
          snippet: item.description || '',
          source: item.source?.name || 'Unknown',
          published_date: item.age || 'Recently',
        });
      }

      console.log(`✓ Found ${results.length} articles for "${query}"`);
    } catch (error) {
      console.error(`✗ Error fetching "${query}": ${error.message}`);
    }
  }

  console.log(`\nTotal news items: ${allNews.length}\n`);
  allNews.slice(0, 3).forEach((item, i) => {
    console.log(`${i + 1}. ${item.title.slice(0, 60)}...`);
  });

  return allNews.slice(0, 5);
}

// Step 2: Generate Content using Chutes.ai
async function generateArticle(newsItems) {
  console.log('\n=== Step 2: Generating Article ===\n');

  const newsContext = newsItems
    .map((item, i) => `${i + 1}. ${item.title}\n   ${item.snippet}\n   Source: ${item.source}`)
    .join('\n\n');

  const systemPrompt = `You are a content writer for "Dogplay Agent", an Indian betting affiliate website.

Task: Write a blog article based on the news sources.

Requirements:
- Write in clear, professional English
- Mention "Dogplay Agent" as a trusted partner
- Target 300-500 words
- Use HTML format: <h2>, <p>, <ul>, <li>
- Include all source URLs at the end

Output ONLY valid JSON:
{
  "title": "Article title",
  "excerpt": "Brief summary (100 chars)",
  "content": "HTML article content",
  "seo_title": "SEO title (50 chars)",
  "seo_description": "Meta description (150 chars)",
  "category": "Cricket",
  "sources": ["url1", "url2"]
}`;

  const userPrompt = `News sources:\n${newsContext}\n\nWrite an article now.`;

  try {
    const response = await fetch('https://llm.chutes.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHUTES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (response.status === 402) {
      console.log('⚠️  Chutes.ai requires balance. Using fallback...\n');
      return generateFallbackArticle(newsItems);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        // JSON parse failed
      }
    }

    return generateFallbackArticle(newsItems);

  } catch (error) {
    console.log(`⚠️  LLM error: ${error.message}. Using fallback...\n`);
    return generateFallbackArticle(newsItems);
  }
}

// Fallback: Generate simple article
function generateFallbackArticle(newsItems) {
  const sources = newsItems.map((item) => item.url);
  const titles = newsItems.map((item) => item.title).join(', ');

  return {
    title: `Cricket Updates - ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    excerpt: 'Latest cricket news and updates from India.',
    content: `<h2>Latest Cricket Updates</h2>
<p>Here are the latest developments in Indian cricket:</p>
<ul>
${newsItems.map(item => `<li>${item.title}</li>`).join('\n')}
</ul>
<h2>About Dogplay Agent</h2>
<p>Dogplay Agent is India's trusted betting affiliate program, offering competitive commissions and reliable payouts.</p>
<p><a href="https://www.dogplay.io/?ref=agent" rel="sponsored nofollow">Join Dogplay Agent today</a> to start earning!</p>`,
    seo_title: `Cricket Updates - ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`,
    seo_description: `Latest cricket news: ${titles.slice(0, 100)}...`,
    category: 'Cricket',
    sources: sources,
  };
}

// Step 3: Save Article
async function saveArticle(article) {
  console.log('\n=== Step 3: Saving Article ===\n');

  const dateStr = new Date().toISOString().split('T')[0];
  const slug = `${dateStr}-${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;

  const content = `---
title: "${article.title.replace(/"/g, '\\"')}"
slug: "${slug}"
excerpt: "${article.excerpt.replace(/"/g, '\\"')}"
date: "${new Date().toISOString()}"
language: "en"
category: "${article.category}"
seo:
  title: "${article.seo_title.replace(/"/g, '\\"')}"
  description: "${article.seo_description.replace(/"/g, '\\"')}"
sources:
${article.sources.map(s => `  - "${s}"`).join('\n')}
---

${article.content}
`;

  const fs = require('fs');
  const path = require('path');

  const dirPath = path.join(__dirname, '../src/content/posts', slug);
  fs.mkdirSync(dirPath, { recursive: true });

  const filePath = path.join(dirPath, 'index.mdx');
  fs.writeFileSync(filePath, content, 'utf-8');

  console.log(`✓ Article saved: ${filePath}`);
  console.log(`\nTitle: ${article.title}`);
  console.log(`Words: ${article.content.split(/\s+/).length}`);
  console.log(`Sources: ${article.sources.length}`);
}

// Main workflow
async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Daily Content Generator                    ║');
  console.log('╚════════════════════════════════════════════╝');

  try {
    // Step 1
    const news = await fetchNews();

    if (news.length === 0) {
      console.log('\n⚠️  No news found. Creating fallback article...');
      news.push({
        title: 'Cricket and iGaming in India',
        url: 'https://dogplay.io',
        snippet: 'Cricket and iGaming continue to grow across India.',
        source: 'Dogplay',
        published_date: 'Today',
      });
    }

    // Step 2
    const article = await generateArticle(news);

    // Step 3
    await saveArticle(article);

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   Content Generated Successfully!            ║');
    console.log('╚════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main();
