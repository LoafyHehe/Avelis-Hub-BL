import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const BLOCKED_PATHS = new Set([
  '/server.js',
  '/package.json',
  '/package-lock.json',
]);

app.use((req, res, next) => {
  if (BLOCKED_PATHS.has(req.path) || req.path.startsWith('/node_modules')) {
    return res.status(404).send('Not found');
  }
  next();
});

app.get('/README.txt', (req, res) => {
  const readmePath = path.join(__dirname, 'README.md');
  if (fs.existsSync(readmePath)) {
    res.type('text/plain; charset=utf-8');
    return res.sendFile(readmePath);
  }
  return res.status(404).send('Not found');
});

app.get('/SHA256SUMS.txt', (req, res) => {
  const targets = ['AvelisHubBL.dll', 'AvelisHubBL-source.zip'];
  const lines = [];
  for (const file of targets) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const hash = crypto
        .createHash('sha256')
        .update(fs.readFileSync(filePath))
        .digest('hex');
      lines.push(`${hash}  ${file}`);
    }
  }
  res.type('text/plain; charset=utf-8');
  return res.send(lines.join('\n') + (lines.length ? '\n' : ''));
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Avelis Hub BL static server listening on http://${HOST}:${PORT}`);
});
