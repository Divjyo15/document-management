// backend/test-groq.js
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function test() {
  try {
    console.log('Testing Groq API...\n');
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: 'Say "Hello from Groq!" in 5 words' }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 50,
    });

    console.log('✅ SUCCESS!\n');
    console.log('Response:', completion.choices[0].message.content);
    console.log('\n✅ Groq is working perfectly!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Check GROQ_API_KEY in .env file');
  }
}

test();