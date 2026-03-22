// backend/routes/documents.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const { extractText } = require('../services/documentParser');
const { generateSummary, categorizeDocument } = require('../services/llmService');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Created uploads directory:', uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload document
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).substring(1);

    // Extract text from document
    console.log('Extracting text...');
    const { text, pageCount } = await extractText(filePath, fileType);

    if (!text || text.length < 10) {
      fs.unlinkSync(filePath); // Delete file
      return res.status(400).json({ error: 'Could not extract text from document' });
    }

    // Generate AI metadata
    console.log('Generating summary and categories...');
    const [summary, metadata] = await Promise.all([
      generateSummary(text),
      categorizeDocument(req.file.originalname, text)
    ]);

    // Save to database
    const document = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: fileType,
      fileSize: req.file.size,
      textContent: text,
      pageCount: pageCount,
      summary: summary,
      category: metadata.category,
      tags: metadata.tags,
      uploadedBy: req.body.uploadedBy || 'Admin'
    });

    await document.save();

    // Delete original file to save space (optional - keep if you need download feature)
    // fs.unlinkSync(filePath);

    res.json({
      success: true,
      document: {
        id: document._id,
        name: document.originalName,
        category: document.category,
        tags: document.tags,
        summary: document.summary,
        pageCount: document.pageCount
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all documents
router.get('/list', async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = { status: 'active' };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$text = { $search: search };
    }

    const documents = await Document.find(query)
      .select('-textContent') // Don't send full text in list
      .sort({ uploadedAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single document
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../uploads', document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Document.aggregate([
      { $match: { status: 'active' } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } }
          ],
          byType: [
            { $group: { _id: '$fileType', count: { $sum: 1 } } }
          ],
          totalSize: [
            { $group: { _id: null, size: { $sum: '$fileSize' } } }
          ]
        }
      }
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;