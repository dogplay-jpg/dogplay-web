/**
 * Test Free APIs - Updated
 * Hugging Face Router API (new endpoint)
 */

// Test Hugging Face LLM (free, no API key needed)
async function testHuggingFace() {
  console.log('\n=== Testing HuggingFace LLM API ===\n');

  // Updated endpoint
  const model = 'mistralai/Mistral-Nemo-Instruct-2407';
  const apiUrl = `https://router.huggingface.co/hf-inference/${model}`;

  const prompt = 'Write a 2-sentence summary about cricket betting in India. Return only the summary.';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ HuggingFace Error: ${response.status}`);
      console.error(`   ${error.slice(0, 300)}`);
      return null;
    }

    const result = await response.json();
    let content = '';

    if (Array.isArray(result)) {
      content = result[0]?.generated_text || '';
    } else if (result.generated_text) {
      content = result.generated_text;
    } else if (result.choices && result.choices[0]) {
      content = result.choices[0].text || result.choices[0].message?.content || '';
    }

    console.log(`✅ HuggingFace API Success!\n`);
    console.log(`Generated content:\n${content}\n`);

    return content;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// Test multiple models
async function testMultipleModels() {
  console.log('\n=== Testing Multiple HuggingFace Models ===\n');

  const models = [
    { name: 'Mistral-Nemo (fast)', id: 'mistralai/Mistral-Nemo-Instruct-2407' },
    { name: 'Phi-3-mini', id: 'microsoft/Phi-3-mini-4k-instruct' },
    { name: 'Qwen2.5-32B', id: 'Qwen/Qwen2.5-32B-Instruct' },
    { name: 'Gemma-3-4B', id: 'unsloth/gemma-3-4b-it' },
  ];

  for (const model of models) {
    console.log(`\nTesting: ${model.name}`);
    console.log(`Model ID: ${model.id}`);

    try {
      const apiUrl = `https://router.huggingface.co/hf-inference/${model.id}`;
      const prompt = 'Say "Hello from India!" in one sentence.';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 50,
            temperature: 0.7,
          },
        }),
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      if (response.ok) {
        const result = await response.json();
        let content = '';
        if (Array.isArray(result)) {
          content = result[0]?.generated_text || '';
        } else if (result.generated_text) {
          content = result.generated_text;
        } else if (result.choices) {
          content = JSON.stringify(result).slice(0, 100);
        }

        if (content) {
          console.log(`✅ Success: ${content.slice(0, 80)}...`);
        } else {
          console.log(`⚠️  No content generated`);
        }
      } else {
        const error = await response.text();
        console.log(`❌ Failed: ${response.status} - ${error.slice(0, 50)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

// Run tests
async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Free LLM API Test (Updated)              ║');
  console.log('╚════════════════════════════════════════════╝');

  await testHuggingFace();
  await testMultipleModels();

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   Test Complete                             ║');
  console.log('╚════════════════════════════════════════════╝');
}

main().catch(console.error);
