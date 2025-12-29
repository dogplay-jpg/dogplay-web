/**
 * Test Brave Search with different queries
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';

async function testBraveSearch(query) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/news/search?q=${encodeURIComponent(query)}&count=5&freshness=7d`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY,
        },
      }
    );

    const data = await response.json();
    const results = data.web?.results || [];

    console.log(`\nQuery: "${query}"`);
    console.log(`Results: ${results.length} articles\n`);

    results.slice(0, 3).forEach((item, i) => {
      console.log(`${i + 1}. ${item.title}`);
      console.log(`   Age: ${item.age || 'N/A'}`);
    });

    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('=== Testing Brave Search with Different Queries ===\n');

  await testBraveSearch('cricket');
  await testBraveSearch('IPL cricket');
  await testBraveSearch('India sports');
  await testBraveSearch('betting');
}

main();
