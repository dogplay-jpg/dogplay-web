/**
 * Test API connections for Brave Search and Chutes.ai
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';
const CHUTES_API_KEY = 'cpk_917d54141b5446bdac51407cc45954d1.3b7e58ac24245c07b904fea7f98d7587.AxOOOIcIeHzn9eXCLnzIgsdITB4uvOMB';

// Test Brave Search API
async function testBraveSearch() {
  console.log('\n=== Testing Brave Search API ===\n');

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/news/search?q=India%20cricket%20betting&count=2&freshness=1d`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error(`❌ Brave Search API failed: ${response.status}`);
      return;
    }

    const data = await response.json();
    const results = data.web?.results || [];

    console.log(`✅ Brave Search API: Found ${results.length} articles\n`);

    results.slice(0, 2).forEach((item, i) => {
      console.log(`${i + 1}. ${item.title}`);
      console.log(`   ${item.url}`);
      console.log(`   ${item.description?.slice(0, 100)}...\n`);
    });

    return results;
  } catch (error) {
    console.error(`❌ Brave Search API error: ${error.message}`);
    return [];
  }
}

// Test Chutes.ai LLM API
async function testChutesLLM() {
  console.log('\n=== Testing Chutes.ai LLM API ===\n');

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
          {
            role: 'user',
            content: 'Write a brief 2-sentence summary about cricket betting in India.',
          },
        ],
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      console.error(`❌ Chutes.ai API failed: ${response.status}`);
      const error = await response.text();
      console.error(`   ${error.slice(0, 200)}`);
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    console.log(`✅ Chutes.ai API: Success!\n`);
    console.log(`Generated content:\n${content}\n`);

    return content;
  } catch (error) {
    console.error(`❌ Chutes.ai API error: ${error.message}`);
    return null;
  }
}

// Test full workflow
async function testFullWorkflow() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Dogplay Agent API Test Suite            ║');
  console.log('╚════════════════════════════════════════════╝');

  // Test 1: Brave Search
  const newsResults = await testBraveSearch();

  // Test 2: Chutes.ai LLM
  await testChutesLLM();

  // Summary
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   Test Complete                             ║');
  console.log('╚════════════════════════════════════════════╝\n');
}

// Run tests
testFullWorkflow().catch(console.error);
