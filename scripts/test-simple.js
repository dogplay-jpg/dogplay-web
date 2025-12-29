/**
 * Test Brave with simple common terms
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';

async function testSimpleTerms() {
  console.log('=== Testing Common Terms (No Filters) ===\n');

  const terms = [
    'news',
    'world',
    'tech',
    'india',
    '2025',
  ];

  for (const term of terms) {
    try {
      const response = await fetch(
        `https://api.search.brave.com/res/v1/news/search?q=${term}&count=10`,
        {
          headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': BRAVE_API_KEY,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const results = data.web?.results || [];

        if (results.length > 0) {
          console.log(`\n✅ "${term}": ${results.length} results`);
          results.slice(0, 3).forEach((item, i) => {
            console.log(`   ${i + 1}. ${item.title}`);
          });
        } else {
          console.log(`   "${term}": 0 results`);
        }
      } else {
        console.log(`   "${term}": HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`   "${term}": ${error.message}`);
    }
  }
}

testSimpleTerms();
