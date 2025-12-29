/**
 * Test Brave Search API with correct endpoint
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';

async function testBraveEndpoint() {
  const endpoints = [
    'https://api.search.brave.com/res/v1/search/web',
    'https://api.search.brave.com/api/search',
    'https://search.brave.com/api/search',
  ];

  for (const baseUrl of endpoints) {
    console.log(`\n=== Testing: ${baseUrl} ===`);

    try {
      const url = `${baseUrl}?q=cricket&count=2`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY,
        },
      });

      const contentType = response.headers.get('content-type');
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${contentType}`);

      const text = await response.text();
      const isJson = contentType?.includes('application/json');

      if (isJson) {
        console.log(`✅ JSON Response!`);
        const json = JSON.parse(text);
        const results = json.web?.results || json.results || [];
        console.log(`Results: ${results.length}`);
        if (results.length > 0) {
          console.log(`First result: ${results[0].title}`);
        }
      } else {
        console.log(`❌ Not JSON (HTML returned)`);
        console.log(`Response starts with: ${text.slice(0, 100)}...`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

testBraveEndpoint();
