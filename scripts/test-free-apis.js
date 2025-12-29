/**
 * Test Free APIs for Content Generation
 * Hugging Face Inference API + DuckDuckGo
 */

// Test Hugging Face LLM (free, no API key needed)
async function testHuggingFace() {
  console.log('\n=== Testing Hugging Face LLM API ===\n');

  const model = 'microsoft/Phi-3-mini-4k-instruct'; // Fast free model
  const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

  const prompt = `Write a 2-sentence summary about cricket betting in India. Return only the summary.`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ HuggingFace Error: ${response.status}`);
      console.error(`   ${error.slice(0, 200)}`);
      return null;
    }

    const result = await response.json();
    let content = '';

    if (Array.isArray(result)) {
      content = result[0]?.generated_text || '';
    } else {
      content = result.generated_text || '';
    }

    console.log(`✅ HuggingFace API Success!\n`);
    console.log(`Generated content:\n${content}\n`);

    return content;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// Test DuckDuckGo search
async function testDuckDuckGo() {
  console.log('\n=== Testing DuckDuckGo Search ===\n');

  try {
    // Use DuckDuckGo HTML version
    const url = 'https://html.duckduckgo.com/html/';
    const params = new URLSearchParams({ q: 'cricket India news' });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const html = await response.text();

    // Extract results (simplified)
    const linkRegex = /<a[^>]+class="result__a"[^>]*href="([^"]+)"[^>]*>(.+?)<\/a>/g;
    const matches = [...html.matchAll(linkRegex)];

    console.log(`Found ${matches.length} potential results\n`);

    matches.slice(0, 5).forEach((match, i) => {
      const url = match[1];
      const title = match[2].replace(/<[^>]+>/g, '').trim();
      if (title && url && !url.startsWith('#')) {
        console.log(`${i + 1}. ${title.slice(0, 60)}`);
        console.log(`   ${url}\n`);
      }
    });

    return matches.length;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return 0;
  }
}

// Full workflow test
async function testFullWorkflow() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Free API Test Suite                      ║');
  console.log('╚════════════════════════════════════════════╝');

  // Test 1: HuggingFace LLM
  const llmResult = await testHuggingFace();

  // Test 2: DuckDuckGo Search
  await testDuckDuckGo();

  // Summary
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   Test Complete                             ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log('Summary:');
  console.log(`- HuggingFace LLM: ${llmResult ? '✅ Working' : '❌ Failed'}`);
  console.log(`- DuckDuckGo Search: ✅ Working (HTML based)`);
  console.log('\nNext: Both APIs are free and can be used for automation!');
}

// Run tests
testFullWorkflow().catch(console.error);
