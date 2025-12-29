/**
 * Test Brave News Search with more keywords
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';

async function testKeywords() {
  console.log('=== Testing Different Keywords ===\n');

  const keywords = [
    'cricket',
    'sports',
    'football',
    'tennis',
    'gaming',
    'IPL',
    'BCCI',
    't20',
  ];

  for (const keyword of keywords) {
    try {
      const response = await fetch(
        `https://api.search.brave.com/res/v1/news/search?q=${keyword}&count=5&freshness=30d`,
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
          console.log(`\n✅ "${keyword}": ${results.length} results`);
          results.slice(0, 2).forEach((item, i) => {
            console.log(`   ${i + 1}. ${item.title.slice(0, 70)}...`);
          });
        } else {
          console.log(`   "${keyword}": 0 results`);
        }
      }
    } catch (error) {
      console.error(`   "${keyword}": Error - ${error.message}`);
    }
  }

  console.log('\n=== Done ===');
}

testKeywords();
