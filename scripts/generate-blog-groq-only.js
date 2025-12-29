/**
 * Blog Content Generator using Groq API only
 * Pure LLM-based content generation without external news source
 */

const fs = require('fs').promises;
const path = require('path');

// API Keys
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

// Configuration
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // or 'llama-3.1-8b-instant' for faster responses

// Topics for Indian sports blog
const BLOG_TOPICS = [
  {
    keyword: 'IPL 2025 auction predictions',
    category: 'IPL',
    title: 'IPL 2025 Auction: Top Players to Watch and Predictions'
  },
  {
    keyword: 'India cricket team next match schedule',
    category: 'Cricket',
    title: 'India Cricket Team: Upcoming Matches and Key Fixtures to Watch'
  },
  {
    keyword: 'T20 cricket evolving strategies',
    category: 'Cricket',
    title: 'How T20 Cricket is Evolving: New Strategies and Game-Changing Tactics'
  },
  {
    keyword: 'young Indian cricketers rising stars',
    category: 'Cricket',
    title: 'Rising Stars: Young Indian Cricketers Set to Dominate 2025'
  },
  {
    keyword: 'women cricket India growth',
    category: 'Cricket',
    title: 'Women\'s Cricket in India: The Growth and Future of the Game'
  },
  {
    keyword: 'online gaming and sports betting trends India',
    category: 'Gaming',
    title: 'Online Sports Gaming Trends in India: What\'s Driving the Growth?'
  },
];

/**
 * Generate blog article using Groq API
 */
async function generateArticle(topic) {
  console.log(`\n🤖 Generating article with Groq...`);
  console.log(`   Topic: ${topic.title}`);

  const prompt = `You are an expert sports content writer for an Indian audience. Write a SEO-optimized blog article.

TOPIC: ${topic.title}
KEYWORD: ${topic.keyword}
CATEGORY: ${topic.category}

Requirements:
1. Write in English for Indian readers (en-IN)
2. Length: 1000-1200 words
3. Use conversational but professional tone
4. Include:
   - Catchy title
   - Meta description (150-160 chars)
   - Introduction
   - 4-5 main sections with H2/H3 headings
   - Practical insights and analysis
   - Conclusion with call-to-action
5. SEO keywords: ${topic.keyword}, ${topic.category}, India, cricket, sports
6. Format in Markdown with proper heading hierarchy
7. Include bullet points, lists for readability
8. Add a "Key Takeaways" section at the end

Output ONLY the content in this exact format:

---
title: [SEO Title]
slug: [url-friendly-slug]
meta_description: [Meta description 150-160 chars]
category: ${topic.category}
tags: ["${topic.category.toLowerCase()}", "india", "sports", "cricket"]
---

# [Title]

[Article content in Markdown with proper formatting]

## Key Takeaways

- [3-5 bullet points of key insights]`;

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
            content: 'You are an expert sports content writer specializing in Indian cricket and sports. Your articles are engaging, well-researched, and optimized for search engines. You use proper Markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
      signal: AbortSignal.timeout(90000),
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
  let frontmatterData = {
    title: '',
    slug: '',
    metaDescription: '',
    category: 'Cricket',
    tags: ['cricket', 'india', 'sports'],
  };
  let body = rawContent;

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    body = rawContent.replace(frontmatterMatch[0], '').trim();

    // Parse title
    const titleMatch = frontmatter.match(/title:\s*"?(.+?)"?\s*$/m);
    if (titleMatch) frontmatterData.title = titleMatch[1].replace(/"/g, '').trim();

    // Parse slug
    const slugMatch = frontmatter.match(/slug:\s*(.+)/);
    if (slugMatch) frontmatterData.slug = slugMatch[1].trim();

    // Parse meta description
    const metaMatch = frontmatter.match(/meta_description:\s*"?(.+?)"?\s*$/m);
    if (metaMatch) frontmatterData.metaDescription = metaMatch[1].replace(/"/g, '').trim();

    // Parse category
    const categoryMatch = frontmatter.match(/category:\s*(.+)/);
    if (categoryMatch) frontmatterData.category = categoryMatch[1].trim();

    // Parse tags
    const tagsMatch = frontmatter.match(/tags:\s*\[(.+?)\]/s);
    if (tagsMatch) {
      const tagsStr = tagsMatch[1];
      frontmatterData.tags = tagsStr.split(',').map(t => t.replace(/['"\s]/g, '').trim()).filter(Boolean);
    }
  }

  // Generate slug if not provided
  if (!frontmatterData.slug && frontmatterData.title) {
    frontmatterData.slug = frontmatterData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60);
  }

  return { ...frontmatterData, body };
}

/**
 * Save article to filesystem
 */
async function saveArticle(articleData) {
  const { title, slug, metaDescription, category, tags, body } = articleData;

  // Generate date-based directory
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dirName = `${date}-${slug}`;
  const dirPath = path.join(CONTENT_DIR, dirName);

  try {
    await fs.mkdir(dirPath, { recursive: true });

    // Format tags for YAML
    const tagsYaml = tags.map(t => `"${t}"`).join(', ');

    // Write index.mdx with frontmatter
    const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${date}"
excerpt: "${metaDescription.replace(/"/g, '\\"')}"
category: "${category}"
tags: [${tagsYaml}]
---

${body}
`;

    await fs.writeFile(path.join(dirPath, 'index.mdx'), mdxContent);

    console.log(`\n💾 Article saved: src/content/posts/${dirName}/index.mdx`);
    console.log(`   Title: ${title}`);
    console.log(`   Category: ${category}`);

    return { success: true, path: dirPath };

  } catch (error) {
    console.log(`   ❌ Save error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main generation function
 */
async function generateBlogArticle(topicIndex = null) {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Blog Content Generator (Groq Only)      ║');
  console.log('╚════════════════════════════════════════════╝');

  // Select topic
  const topic = topicIndex !== null
    ? BLOG_TOPICS[topicIndex]
    : BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];

  console.log(`\n📝 Selected topic: ${topic.title}`);

  // Generate article
  const rawContent = await generateArticle(topic);

  if (!rawContent) {
    console.log('\n❌ Failed to generate article. Exiting.');
    return null;
  }

  // Parse and save
  const articleData = parseArticleContent(rawContent);
  const result = await saveArticle(articleData);

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   Generation Complete                      ║');
  console.log('╚════════════════════════════════════════════╝');

  return result;
}

// Run if called directly
if (require.main === module) {
  const topicIndex = process.argv[2] ? parseInt(process.argv[2]) : null;
  generateBlogArticle(topicIndex)
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

module.exports = { generateBlogArticle, BLOG_TOPICS };
