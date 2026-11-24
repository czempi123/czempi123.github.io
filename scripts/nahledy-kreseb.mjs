// Náhledy kreseb pro Co ti zůstalo? a kartičky (denik-v2, O): plátno každé kresby v klidovém stavu (omezený pohyb,
// výchozí ovládání), světlý a tmavý režim, WebP 480 px do public/kresby/nahled/<Komponenta>-{svetly,tmavy}.webp.
// Fotí scripts/snimky-prvek.mjs na šířce 390 px (popisky kresby jsou na telefonu největší, náhled je malý).
// Spuštění (běžící web): ZAKLAD=http://localhost:4321 node scripts/nahledy-kreseb.mjs [Komponenta …]
// Kresba se bere z prvního kroku cesty, kde stojí (stejně jako src/lib/herna/zustalo-data.ts).
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const KOREN = join(import.meta.dirname, '..');
const nazvy = readFileSync(join(KOREN, 'src/lib/kresby.ts'), 'utf8').match(/export const NAZVY_KRESEB = \{([\s\S]*?)\}/)[1];
const komponenty = [...nazvy.matchAll(/^\s*([A-Z]\w+):/gm)].map((m) => m[1]);
const chci = process.argv.slice(2);
const CESTY = join(KOREN, 'src/content/cesty');
const kroky = readdirSync(CESTY, { withFileTypes: true }).filter((d) => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))
  .flatMap((d) => readdirSync(join(CESTY, d.name)).filter((f) => /^\d+-.*\.mdx$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b))
    .map((f) => ({ cesta: d.name, krok: parseInt(f), text: readFileSync(join(CESTY, d.name, f), 'utf8') })));

for (const k of komponenty.filter((x) => !chci.length || chci.includes(x))) {
  const krok = kroky.find((x) => new RegExp(`<${k}[\\s/>]`).test(x.text));
  const id = krok?.text.match(new RegExp(`<${k}\\s[^>]*?id="([^"]+)"`))?.[1];
  if (!krok || !id) {
    console.log(`${k}: v cestách není`);
    continue;
  }
  for (const [rezim, jmeno] of [['light', 'svetly'], ['dark', 'tmavy']]) {
    execFileSync('node', ['scripts/snimky-prvek.mjs', `/cesta/${krok.cesta}/${krok.krok}/`, `#${id} .kresba__platno`, `${k}-${jmeno}`, '390', rezim], {
      cwd: KOREN, stdio: 'inherit', env: { ...process.env, WEBP: '480', VEN: 'public/kresby/nahled' },
    });
  }
}
