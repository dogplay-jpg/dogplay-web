/**
 * SEO-Optimized Blog Content Generator
 * Follows Google E-E-A-T guidelines and SEO best practices
 *
 * Google SEO Standards:
 * - E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness
 * - Content length: 1500-2500 words for comprehensive coverage
 * - Meta title: 50-60 characters
 * - Meta description: 150-160 characters
 * - Keyword density: 1-2%
 * - Readability: Short paragraphs, bullet points, clear structure
 * - Internal links: 3-5 relevant links
 * - External sources: Authoritative references
 * - Schema markup: Structured data
 */

const fs = require('fs').promises;
const path = require('path');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * SEO-Optimized Article Topics with target keywords
 * Based on Indian cricket and sports betting market research
 */
const SEO_ARTICLES = [
  {
    id: 1,
    keyword: 'IPL 2025 schedule venues',
    primaryKeyword: 'IPL 2025 Schedule',
    secondaryKeywords: ['IPL venues', 'IPL match timings', 'IPL 2025 dates', 'IPL teams'],
    searchIntent: 'informational',
    targetWordCount: 2000,
    title: 'IPL 2025 Schedule: Complete Match Timings, Venues and Fixtures Guide',
    category: 'IPL'
  },
  {
    id: 2,
    keyword: 'IPL auction biggest buys 2025',
    primaryKeyword: 'IPL Auction 2025',
    secondaryKeywords: ['IPL most expensive players', 'IPL auction results', 'IPL team squads'],
    searchIntent: 'informational',
    targetWordCount: 1800,
    title: 'IPL Auction 2025: Biggest Buys and Complete Analysis of Team Squads',
    category: 'IPL'
  },
  {
    id: 3,
    keyword: 'India vs England T20 series 2025',
    primaryKeyword: 'India vs England 2025',
    secondaryKeywords: ['IND vs ENG T20', 'India England schedule', 'India England tickets'],
    searchIntent: 'informational',
    targetWordCount: 1600,
    title: 'India vs England T20 Series 2025: Schedule, Venues and Key Players to Watch',
    category: 'Cricket'
  },
  {
    id: 4,
    keyword: 'online cricket betting India guide',
    primaryKeyword: 'cricket betting India',
    secondaryKeywords: ['online cricket betting', 'cricket betting sites', 'how to bet on cricket'],
    searchIntent: 'informational',
    targetWordCount: 2200,
    title: 'Complete Guide to Cricket Betting in India: How to Bet Safely and Legally',
    category: 'Betting Guide'
  },
  {
    id: 5,
    keyword: ' IPL live streaming apps India',
    primaryKeyword: 'IPL live streaming',
    secondaryKeywords: ['watch IPL online', 'IPL streaming apps', 'JioHotstar IPL', 'IPL broadcast'],
    searchIntent: 'informational',
    targetWordCount: 1500,
    title: 'IPL 2025 Live Streaming: Where and How to Watch Matches in India',
    category: 'IPL'
  },
  {
    id: 6,
    keyword: 'IPL betting tips strategies',
    primaryKeyword: 'IPL betting tips',
    secondaryKeywords: ['IPL betting strategies', 'cricket betting tips', 'IPL match prediction'],
    searchIntent: 'informational',
    targetWordCount: 2000,
    title: 'IPL Betting Tips and Strategies: Expert Guide for Indian Punters 2025',
    category: 'Betting Guide'
  },
  {
    id: 7,
    keyword: 'Tata IPL prize money 2025',
    primaryKeyword: 'IPL prize money',
    secondaryKeywords: ['IPL winner prize', 'IPL team earnings', 'IPL 2025 awards'],
    searchIntent: 'informational',
    targetWordCount: 1400,
    title: 'IPL 2025 Prize Money: Complete Breakdown of Winners and Team Earnings',
    category: 'IPL'
  },
  {
    id: 8,
    keyword: 'IPL playoffs qualification 2025',
    primaryKeyword: 'IPL playoffs 2025',
    secondaryKeywords: ['IPL qualifying rules', 'IPL points table', 'IPL knockout stage'],
    searchIntent: 'informational',
    targetWordCount: 1600,
    title: 'IPL 2025 Playoffs: Qualification Rules, Format and Everything You Need to Know',
    category: 'IPL'
  },
  {
    id: 9,
    keyword: 'women IPL 2025',
    primaryKeyword: 'Women IPL 2025',
    secondaryKeywords: ['WIPL 2025', 'women cricket IPL', 'Women T20 Challenge'],
    searchIntent: 'informational',
    targetWordCount: 1700,
    title: 'Women IPL 2025: Everything About the Women Premier League Tournament',
    category: 'Cricket'
  },
  {
    id: 10,
    keyword: 'IPL best captain records',
    primaryKeyword: 'IPL captains',
    secondaryKeywords: ['most successful IPL captain', 'IPL captaincy records', 'best IPL leaders'],
    searchIntent: 'informational',
    targetWordCount: 1800,
    title: 'Most Successful IPL Captains: All-Time Records and Leadership Analysis',
    category: 'Cricket'
  },
  {
    id: 11,
    keyword: 'cricket betting apps India real money',
    primaryKeyword: 'cricket betting apps',
    secondaryKeywords: ['betting apps India', 'real money betting apps', 'online betting apps'],
    searchIntent: 'commercial',
    targetWordCount: 2300,
    title: 'Top Cricket Betting Apps in India for Real Money: Complete 2025 Review',
    category: 'Betting Guide'
  },
  {
    id: 12,
    keyword: 'IPL orange cap holders history',
    primaryKeyword: 'IPL Orange Cap',
    secondaryKeywords: ['IPL highest run scorer', 'Orange Cap winners list', 'IPL batting records'],
    searchIntent: 'informational',
    targetWordCount: 1500,
    title: 'IPL Orange Cap Winners: Complete History of Highest Run Scorers',
    category: 'IPL'
  },
  {
    id: 13,
    keyword: 'IPL purple cap winners list',
    primaryKeyword: 'IPL Purple Cap',
    secondaryKeywords: ['IPL highest wicket taker', 'Purple Cap winners', 'IPL bowling records'],
    searchIntent: 'informational',
    targetWordCount: 1400,
    title: 'IPL Purple Cap Winners: Complete History of Leading Wicket-Takers',
    category: 'IPL'
  },
  {
    id: 14,
    keyword: 'responsible gambling India',
    primaryKeyword: 'responsible gambling',
    secondaryKeywords: ['gambling addiction help', 'betting limits', 'safe gambling practices'],
    searchIntent: 'informational',
    targetWordCount: 2000,
    title: 'Responsible Gambling in India: How to Bet Safely and Stay in Control',
    category: 'Responsible Gambling'
  },
  {
    id: 15,
    keyword: 'IPL all team squad 2025',
    primaryKeyword: 'IPL team squads 2025',
    secondaryKeywords: ['IPL players list', 'IPL team composition', 'IPL retained players'],
    searchIntent: 'informational',
    targetWordCount: 1900,
    title: 'IPL 2025 Complete Team Squads: Full Player List and Team Analysis',
    category: 'IPL'
  }
];

/**
 * Generate SEO-optimized article using Groq API
 */
async function generateSEOOptimizedArticle(article) {
  console.log(`\n📝 Generating: ${article.title}`);
  console.log(`   Target: ${article.targetWordCount} words | ${article.category}`);

  const secondaryKeywordsStr = article.secondaryKeywords.join(', ');

  const systemPrompt = `You are an expert SEO content writer specializing in Indian cricket and sports betting. You create content that follows Google E-E-A-T guidelines (Experience, Expertise, Authoritativeness, Trustworthiness).

Your content must:
- Be comprehensive, accurate, and provide genuine value to readers
- Demonstrate expertise through detailed analysis and insights
- Include real facts, statistics, and examples
- Maintain an authoritative yet accessible tone
- Build trust through accurate, well-sourced information
- Use proper formatting for readability (H2, H3, bullet points, short paragraphs)
- Include internal link suggestions for site structure
- Add external reference suggestions to authoritative sources
- Optimize for featured snippets where appropriate`;

  const userPrompt = `Write a comprehensive, SEO-optimized article following Google's quality guidelines.

TARGET KEYWORD DATA:
- Primary Keyword: "${article.primaryKeyword}"
- Secondary Keywords: ${secondaryKeywordsStr}
- Search Intent: ${article.searchIntent}
- Target Word Count: ${article.targetWordCount} words
- Category: ${article.category}

ARTICLE TITLE: ${article.title}

REQUIREMENTS:

1. TITLE TAG (50-60 chars):
Create an SEO-friendly title tag that includes the primary keyword and attracts clicks.

2. META DESCRIPTION (150-160 chars):
Write a compelling meta description that includes the primary keyword and encourages clicks while accurately describing the content.

3. CONTENT STRUCTURE:
- Engaging introduction (100-150 words) that hooks the reader
- 4-6 comprehensive H2 sections covering the topic in depth
- H3 subsections where appropriate for detailed information
- Practical examples, statistics, and data points
- Bulleted lists for key takeaways
- Conclusion with clear call-to-action

4. SEO ELEMENTS:
- Naturally include primary keyword in first 100 words
- Use secondary keywords throughout (1-2% density)
- Include related long-tail variations naturally
- Add 3-5 internal link suggestions with anchor text
- Suggest 2-3 external authoritative sources to reference

5. READABILITY:
- Short paragraphs (2-3 sentences max)
- Mix of sentence lengths
- Conversational but professional tone
- Indian English conventions (crore/lakh, Indian spellings)
- Avoid jargon unless explained

6. VALUE ADD:
- Include specific tips or strategies readers can apply
- Add relevant statistics or data points
- Provide unique insights or perspectives
- Address common questions related to the topic

7. KEY TAKEAWAYS SECTION:
Add a "Key Takeaways" or "Quick Points" section at the end with 5-7 bullet points.

OUTPUT FORMAT (exactly):

---
title: "SEO Title (50-60 chars)"
slug: "url-friendly-slug"
meta_description: "Meta description exactly 150-160 chars"
category: "${article.category}"
tags: ["${article.category.toLowerCase()}", "india", "cricket", "2025", "${article.primaryKeyword.toLowerCase().replace(/ /g, '-')}"]
featured: true
---

# ${article.title}

[Introduction - 100-150 words]

## Main Section 1

[Detailed content with examples, data, H3 subsections as needed]

## Main Section 2

[Continue with comprehensive coverage...]

## Key Takeaways

- [5-7 key insights from the article]

[Conclusion with CTA]

---
INTERNAL LINKS SUGGESTIONS:
1. [Link text] → /relative-url
2. [Link text] → /relative-url

EXTERNAL REFERENCES SUGGESTIONS:
1. [Source name] → URL
2. [Source name] → URL`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 6000,
      }),
      signal: AbortSignal.timeout(120000),
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

    const wordCount = content.split(/\s+/).length;
    console.log(`   ✅ Generated (${wordCount} words)`);

    return content;

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Parse frontmatter and content
 */
function parseArticleContent(rawContent, defaultCategory) {
  const frontmatterMatch = rawContent.match(/^---\n([\s\S]+?)\n---/);

  let frontmatterData = {
    title: '',
    slug: '',
    metaDescription: '',
    category: defaultCategory,
    tags: ['cricket', 'india', 'sports'],
    featured: false,
  };
  let body = rawContent;

  if (frontmatterMatch) {
    const frontmatterStr = frontmatterMatch[1];
    body = rawContent.replace(frontmatterMatch[0], '').trim();

    // Parse YAML frontmatter
    const parseField = (pattern, fallback = '') => {
      const match = frontmatterStr.match(pattern);
      return match ? match[1].replace(/"/g, '').trim() : fallback;
    };

    frontmatterData.title = parseField(/title:\s*"(.+?)"/);
    frontmatterData.slug = parseField(/slug:\s*"(.+?)"/);
    frontmatterData.metaDescription = parseField(/meta_description:\s*"(.+?)"/);
    frontmatterData.category = parseField(/category:\s*"(.+?)"/, defaultCategory);

    const tagsMatch = frontmatterStr.match(/tags:\s*\[(.+?)\]/s);
    if (tagsMatch) {
      frontmatterData.tags = tagsMatch[1]
        .split(',')
        .map(t => t.replace(/['"\s]/g, '').trim())
        .filter(Boolean);
    }

    const featuredMatch = frontmatterStr.match(/featured:\s*(true|false)/);
    if (featuredMatch) {
      frontmatterData.featured = featuredMatch[1] === 'true';
    }
  }

  // Generate slug from title if not provided
  if (!frontmatterData.slug && frontmatterData.title) {
    frontmatterData.slug = frontmatterData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 70);
  }

  return { ...frontmatterData, body };
}

/**
 * Save article with proper frontmatter
 */
async function saveArticle(rawContent, articleId) {
  const { title, slug, metaDescription, category, tags, body } = parseArticleContent(
    rawContent,
    SEO_ARTICLES.find(a => a.id === articleId)?.category || 'Cricket'
  );

  const date = new Date().toISOString().split('T')[0];
  const dirName = `${date}-${slug}`;
  const dirPath = path.join(CONTENT_DIR, dirName);

  try {
    await fs.mkdir(dirPath, { recursive: true });

    const tagsYaml = tags.map(t => `"${t}"`).join(', ');

    const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${date}"
excerpt: "${metaDescription.replace(/"/g, '\\"')}"
category: "${category}"
tags: [${tagsYaml}]
featured: true
---

${body}
`;

    await fs.writeFile(path.join(dirPath, 'index.mdx'), mdxContent);

    console.log(`   💾 Saved: ${slug}`);
    return { success: true, slug, title };

  } catch (error) {
    console.log(`   ❌ Save error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Batch generate all SEO articles
 */
async function generateAllArticles(startId = 1, endId = 15) {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║      Google SEO-Optimized Content Generation                ║');
  console.log('║      Following E-E-A-T Guidelines                            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const results = { success: 0, failed: 0, errors: [] };

  for (const article of SEO_ARTICLES) {
    if (article.id < startId || article.id > endId) continue;

    console.log(`\n[${article.id}/${SEO_ARTICLES.length}] ${article.title.substring(0, 60)}...`);

    const content = await generateSEOOptimizedArticle(article);

    if (content) {
      const result = await saveArticle(content, article.id);
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({ id: article.id, error: result.error });
      }
    } else {
      results.failed++;
      results.errors.push({ id: article.id, error: 'Generation failed' });
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                     Generation Summary                       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`✅ Success: ${results.success} articles`);
  console.log(`❌ Failed:  ${results.failed} articles`);

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(e => console.log(`   Article ${e.id}: ${e.error}`));
  }

  return results;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const startId = args[0] ? parseInt(args[0]) : 1;
  const endId = args[1] ? parseInt(args[1]) : 15;

  generateAllArticles(startId, endId)
    .then((results) => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateAllArticles, SEO_ARTICLES };
