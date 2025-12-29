/**
 * Test Brave Search API - Check if activated
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';

async function testBraveAPI() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Testing Brave Search API                  ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const endpoints = [
    { name: 'Web Search', url: 'https://api.search.brave.com/res/v1/search/web?q=cricket&count=3' },
    { name: 'News Search', url: 'https://api.search.brave.com/res/v1/news/search?q=cricket&count=3&freshness=7d' },
  ];

  for (const endpoint of endpoints) {
    console.log(`\n=== ${endpoint.name} ===`);

    try {
      const response = await fetch(endpoint.url, {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY,
        },
      });

      const contentType = response.headers.get('content-type');
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Content-Type: ${contentType}`);

      if (response.ok && contentType?.includes('application/json')) {
        const data = await response.json();
        const results = data.web?.results || data.results || [];
        console.log(`✅ JSON Response! Found ${results.length} results\n`);

        results.slice(0, 2).forEach((item, i) => {
          console.log(`  ${i + 1}. ${item.title}`);
        });
      } else {
        const text = await response.text();
        if (text.includes('<!DOCTYPE')) {
          console.log(`❌ Still returning HTML (not activated yet)`);
        } else {
          console.log(`❌ Error: ${text.slice(0, 200)}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   Test Complete                             ║');
  console.log('╚════════════════════════════════════════════╝\n');
}

testBraveAPI();
