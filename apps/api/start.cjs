const fs = require('fs');
const path = require('path');
const candidates = [
  path.join(__dirname, 'dist/server.js'),
  path.join(__dirname, 'dist/src/server.js'),
  path.join(__dirname, 'dist/apps/api/src/server.js'),
];
const entry = candidates.find((p) => fs.existsSync(p));
if (!entry) {
  console.error('[oneallhost-api] built server.js not found. Looked in:', candidates);
  process.exit(1);
}
console.log('[oneallhost-api] starting', entry);
require(entry);
