// backend/services/llmService.js
const Groq = require('groq-sdk');
const Document = require('../models/Document');

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

if (!process.env.GROQ_API_KEY) {
  console.error('⚠️ GROQ_API_KEY missing in .env');
}

// Call Groq API
async function callGroq(prompt, maxTokens = 1000) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile', // Fast & powerful
      max_tokens: maxTokens,
      temperature: 0.7,
    });
    
    return completion.choices[0].message.content;
    
  } catch (error) {
    console.error('Groq Error:', error.message);
    throw new Error('AI generation failed');
  }
}

// Generate summary
async function generateSummary(textContent) {
  console.log('🤖 Generating summary with Groq...');
  
  const prompt = `Summarize this document in 3-4 clear sentences:

${textContent.substring(0, 6000)}`;

  const summary = await callGroq(prompt, 500);
  console.log('✅ Summary done');
  return summary.trim();
}

// Categorize document
async function categorizeDocument(filename, textContent) {
  console.log('🤖 Categorizing with Groq...');
  
  const prompt = `Categorize this document. Choose ONE from: contract, invoice, report, memo, presentation, policy, email, letter, other

Add 3-5 single-word tags.

Filename: ${filename}
Content: ${textContent.substring(0, 2000)}

Respond ONLY with JSON:
{"category": "report", "tags": ["business", "analysis"]}`;

  const response = await callGroq(prompt, 300);
  
  // Parse response
  let clean = response.trim()
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  
  const jsonMatch = clean.match(/\{[\s\S]*?\}/);
  if (jsonMatch) {
    clean = jsonMatch[0];
  }
  
  try {
    const parsed = JSON.parse(clean);
    console.log('✅ Category:', parsed.category);
    return {
      category: parsed.category || 'other',
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['document']
    };
  } catch (error) {
    console.error('Parse error:', clean);
    return {
      category: 'other',
      tags: ['document']
    };
  }
}

// Answer questions
async function answerQuery(question, documents) {
  console.log('🤖 Answering with Groq...');
  
  let context = 'Documents:\n\n';
  documents.forEach((doc, index) => {
    context += `Document ${index + 1}: ${doc.originalName}\n`;
    context += `Category: ${doc.category}\n`;
    context += `Content: ${doc.textContent.substring(0, 2500)}...\n\n`;
  });

  const prompt = `Question: "${question}"

${context}

Answer clearly based on the documents above:`;

  const answer = await callGroq(prompt, 1000);
  console.log('✅ Answer done');
  return answer.trim();
}

// Search documents
async function searchDocuments(query) {
  console.log('🔍 Searching:', query);
  
  // MongoDB text search
  let docs = await Document.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(5);

  // Fallback to regex
  if (docs.length === 0) {
    docs = await Document.find({
      $or: [
        { originalName: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(5);
  }

  return docs;
}

module.exports = {
  generateSummary,
  categorizeDocument,
  answerQuery,
  searchDocuments
};