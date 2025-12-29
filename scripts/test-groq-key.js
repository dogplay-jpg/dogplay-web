/**
 * Test Groq API
 */

const GROQ_API_KEY = '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';

async function testGroq() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Testing Groq API                          ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const models = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
  ];

  for (const model of models) {
    console.log(`=== Model: ${model} ===`);

    try {
      const start = Date.now();

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Write one exciting sentence about cricket in India.',
            },
          ],
          max_tokens: 50,
        }),
        signal: AbortSignal.timeout(30000),
      });

      const elapsed = Date.now() - start;

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        console.log(`✅ Success (${elapsed}ms)`);
        console.log(`   ${content}\n`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed: ${response.status}`);
        console.log(`   ${error.slice(0, 150)}...\n`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }

  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Test Complete                             ║');
  console.log('╚════════════════════════════════════════════╝');
}

testGroq().catch(console.error);
