// Statický server nad dist/ pro testy v Playwrightu (K7a): chová se jako GitHub Pages, kde atlas opravdu běží.
// Složka dostane index.html, adresa složky bez lomítka přesměruje na adresu s lomítkem, co není, vrátí 404.html se stavem 404.
// Proč ne astro preview: pod ním Chromium přechod mezi dokumenty (pagereveal bez viewTransition) většinou vynechal,
// i ve viditelném okně, kdežto nad týmž dist/ ze statického serveru ani jednou (ram.spec.ts:85, 6 z 6; plán design-v2, Po K7a).
// node scripts/staticky-server.mjs [port]
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const KOREN = resolve(process.cwd(), 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 4322);
const TYPY = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.wasm': 'application/wasm', '.webmanifest': 'application/manifest+json',
};

const soubor = (cesta) => { try { const s = statSync(cesta); return s.isFile() ? s : null; } catch { return null; } };
const slozka = (cesta) => { try { return statSync(cesta).isDirectory(); } catch { return false; } };

function posli(res, cesta, stav = 200) {
  res.writeHead(stav, { 'Content-Type': TYPY[extname(cesta).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'max-age=600' });
  createReadStream(cesta).pipe(res);
}

createServer((req, res) => {
  let adresa;
  try { adresa = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname); } catch { res.writeHead(400).end(); return; }
  const cesta = normalize(join(KOREN, adresa));
  if (!cesta.startsWith(KOREN)) { res.writeHead(403).end(); return; }
  if (soubor(cesta)) return posli(res, cesta);
  if (slozka(cesta)) {
    if (!adresa.endsWith('/')) {
      const q = new URL(req.url ?? '/', 'http://x').search;
      res.writeHead(301, { Location: `${adresa}/${q}` }).end();
      return;
    }
    const index = join(cesta, 'index.html');
    if (soubor(index)) return posli(res, index);
  }
  if (soubor(`${cesta}.html`)) return posli(res, `${cesta}.html`);
  const chyba = join(KOREN, '404.html');
  if (soubor(chyba)) return posli(res, chyba, 404);
  res.writeHead(404).end();
}).listen(PORT, () => console.log(`dist/ na http://localhost:${PORT}`));
