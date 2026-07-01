// backend/services/documentParser.js
const fs = require('fs');
const mammoth = require('mammoth');

async function extractText(filePath, fileType) {
  try {
    let text = '';
    let pageCount = 0;

    if (fileType === 'pdf') {
      const { PdfReader } = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      
      const pdfData = await new Promise((resolve, reject) => {
        let fullText = '';
        let pages = 0;
        new PdfReader().parseBuffer(dataBuffer, (err, item) => {
          if (err) reject(err);
          else if (!item) resolve({ text: fullText, numpages: pages });
          else if (item.page) pages = item.page;
          else if (item.text) fullText += item.text + ' ';
        });
      });

      text = pdfData.text;
      pageCount = pdfData.numpages;

    } else if (fileType === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
      pageCount = Math.ceil(text.length / 3000);

    } else if (fileType === 'txt') {
      text = fs.readFileSync(filePath, 'utf8');
      pageCount = 1;
    }

    return { text: text.trim(), pageCount };

  } catch (error) {
    throw new Error(`Failed to parse document: ${error.message}`);
  }
}

module.exports = { extractText };
