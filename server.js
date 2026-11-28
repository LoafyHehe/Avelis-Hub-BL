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
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
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

app.get('/Lucide-LICENSE.txt', (req, res) => {
  res.type('text/plain; charset=utf-8');
  return res.send(`ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
`);
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

app.use(express.static(__dirname, { etag: false, lastModified: false, maxAge: 0 }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Avelis Hub BL static server listening on http://${HOST}:${PORT}`);
});
