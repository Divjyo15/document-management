// backend/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true }, // pdf, docx, txt
  fileSize: { type: Number },
  uploadedBy: { type: String, default: 'Admin' },
  uploadedAt: { type: Date, default: Date.now },
  
  // Extracted content
  textContent: { type: String, required: true },
  pageCount: { type: Number },
  
  // Metadata
  tags: [String],
  category: { type: String }, // contract, report, invoice, etc.
  summary: { type: String }, // AI-generated summary
  
  // Search & Version
  version: { type: Number, default: 1 },
  status: { type: String, default: 'active' }, // active, archived
  
  // Access control
  permissions: {
    viewers: [String],
    editors: [String]
  }
});

// Text index for search
documentSchema.index({ textContent: 'text', originalName: 'text', tags: 'text' });

module.exports = mongoose.model('Document', documentSchema);