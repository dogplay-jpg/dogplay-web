/**
 * Debug API issues
 */

const BRAVE_API_KEY = 'BSAUcMmrNxLEbhLsNRnfZasu8D8BRIf';

async function testBraveWithDebug() {
  console.log('=== Debugging Brave Search API ===\n');

  const url = 'https://api.search.brave.com/res/v1/search/web?q=cricket&count=2';

  console.log(`URL: ${url}`);
  console.log(`API Key: ${BRAVE_API_KEY.slice(0, 10)}...${BRAVE_API_KEY.slice(-4)}\n`);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY,
      },
    });

    console.log(`Response Status: ${response.status}`);
    console.log(`Response Headers:`);

    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    console.log('\nResponse Body (first 500 chars):');
    const text = await response.text();
    console.log(text.slice(0, 500));

    if (response.ok) {
      try {
        const json = JSON.parse(text);
        console.log('\nParsed JSON:');
        console.log(JSON.stringify(json, null, 2).slice(0, 500));
      } catch (e) {
        console.log('\nFailed to parse as JSON');
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

testBraveWithDebug();
