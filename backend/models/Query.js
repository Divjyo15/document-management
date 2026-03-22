// backend/models/Query.js
const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  relatedDocuments: [{
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    relevanceScore: Number,
    excerpts: [String]
  }],
  askedBy: String,
  askedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Query', querySchema);