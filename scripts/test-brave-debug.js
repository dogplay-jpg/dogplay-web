/**
 * Test Brave News without freshness filter
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';

async function testWithoutFreshness() {
  console.log('=== Testing Without Freshness Filter ===\n');

  // Test with different freshness values
  const tests = [
    { name: 'No freshness', url: 'https://api.search.brave.com/res/v1/news/search?q=sports&count=5' },
    { name: 'Freshness: 30d', url: 'https://api.search.brave.com/res/v1/news/search?q=sports&count=5&freshness=30d' },
    { name: 'Freshness: 90d', url: 'https://api.search.brave.com/res/v1/news/search?q=sports&count=5&freshness=90d' },
    { name: 'Web Search (not news)', url: 'https://api.search.brave.com/res/v1/search/web?q=sports&count=5' },
  ];

  for (const test of tests) {
    console.log(`\n${test.name}:`);

    try {
      const response = await fetch(test.url, {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY,
        },
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (isJson && response.ok) {
        const data = await response.json();
        const results = data.web?.results || [];
        console.log(`   ✅ JSON! ${results.length} results`);
        if (results.length > 0) {
          console.log(`   First: ${results[0].title.slice(0, 50)}...`);
        }
      } else {
        const text = await response.text();
        if (text.includes('<!DOCTYPE')) {
          console.log(`   ❌ HTML (not activated)`);
        } else {
          console.log(`   ❌ ${response.status} - ${text.slice(0, 50)}...`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

testWithoutFreshness();
