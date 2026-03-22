// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { answerQuery, searchDocuments } = require('../services/llmService');

// Ask a question
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log('Searching for relevant documents...');
    // Find relevant documents
    const relevantDocs = await searchDocuments(question);

    if (relevantDocs.length === 0) {
      return res.json({
        answer: "I couldn't find any documents related to your question. Please try rephrasing or upload relevant documents first.",
        relatedDocuments: []
      });
    }

    console.log('Generating answer...');
    // Generate answer using LLM
    const answer = await answerQuery(question, relevantDocs);

    // Save query to database
    const query = new Query({
      question: question,
      answer: answer,
      relatedDocuments: relevantDocs.map(doc => ({
        documentId: doc._id,
        relevanceScore: doc.score || 0
      })),
      askedBy: req.body.user || 'Anonymous'
    });

    await query.save();

    res.json({
      answer: answer,
      relatedDocuments: relevantDocs.map(doc => ({
        id: doc._id,
        name: doc.originalName,
        category: doc.category,
        summary: doc.summary
      }))
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get query history
router.get('/history', async (req, res) => {
  try {
    const history = await Query.find()
      .populate('relatedDocuments.documentId', 'originalName category')
      .sort({ askedAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;