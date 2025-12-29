/**
 * Test Brave Search with web search (not news)
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';

async function testBraveWebSearch(query) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/search/web?q=${encodeURIComponent(query)}&count=10`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error(`Status: ${response.status}`);
      const text = await response.text();
      console.error(`Response: ${text.slice(0, 200)}`);
      return [];
    }

    const data = await response.json();
    const results = data.web?.results || [];

    console.log(`\nQuery: "${query}"`);
    console.log(`Results: ${results.length} articles\n`);

    results.slice(0, 3).forEach((item, i) => {
      console.log(`${i + 1}. ${item.title}`);
      console.log(`   ${item.url}`);
    });

    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('=== Testing Brave Web Search ===\n');

  await testBraveWebSearch('India cricket betting');
  await testBraveWebSearch('IPL 2025');
  await testBraveWebSearch('cricket news India');
}

main();
