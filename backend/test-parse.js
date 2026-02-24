const fs = require('fs');
const pdfParse = require('pdf-parse');
console.log('Export type:', typeof pdfParse);
const buffer = fs.readFileSync('package.json'); // Just need a buffer to test if it runs or throws a specific format error

try {
  let result;
  if (typeof pdfParse === 'function') {
    console.log('Trying as direct function...');
    result = pdfParse(buffer);
  } else {
    console.log('Trying with new PDFParse()...');
    result = new pdfParse.PDFParse(buffer);
  }
  console.log('Success!', typeof result);
} catch (e) {
  console.log('Error:', e.message);
}
