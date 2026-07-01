const fs = require('fs');
const mammoth = require('mammoth');
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;

async function extractText(filePath, fileType) {
  try {
    let text = '';
    let pageCount = 0;

    if (fileType === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
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
