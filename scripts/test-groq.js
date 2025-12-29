/**
 * Test Groq API - Free & Fast LLM
 * Get API key from: https://console.groq.com/keys
 */

// Test Groq API (no key needed for testing, uses demo endpoint)
async function testGroq() {
  console.log('\n=== Testing Groq API ===\n');

  // Groq's open API endpoint - requires key but free
  const apiKey = 'gsk_demo';  // Demo key, replace with real one from console.groq.com

  const models = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
  ];

  for (const model of models) {
    console.log(`\nModel: ${model}`);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Write one sentence about cricket in India.',
            },
          ],
          max_tokens: 50,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        console.log(`✅ Success: ${content}`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed: ${response.status} - ${error.slice(0, 100)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

// Test without API key first
async function testNoKey() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Groq API Test                            ║');
  console.log('╚════════════════════════════════════════════╝');

  await testGroq();

  console.log('\n\n💡 Note: Groq requires a free API key from https://console.groq.com');
  console.log('   - Sign up is free');
  console.log('   - Very fast inference');
  console.log('   - Supports LLaMA 3, Mixtral, Gemma');
}

testNoKey().catch(console.error);
