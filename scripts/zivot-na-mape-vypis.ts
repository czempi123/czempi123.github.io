// Kdo dostane v kartě člověka oddíl Život na mapě a čí trasa je tenká (podklad pro skill atlas-data).
// Spuštění: npx vite-node scripts/zivot-na-mape-vypis.ts   (volitelně --podrobne: zastávky každého člověka)
// Tenká trasa: žádné místo s časem (rok, od, do) kromě rodiště a místa smrti.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { nactiData } from '../src/lib/kontroly';
import { zastavkyZivota, maZastavky, radekZastavky } from '../src/lib/zivot-na-mape';

const koren = join(import.meta.dirname, '..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const { data } = nactiData({
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'), udalosti: cti('udalosti.yaml'),
  obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
});
const nazev = new Map(data.mista.map((m) => [m.id, m.nazev]));
const podrobne = process.argv.includes('--podrobne');
const sCasem = (o: (typeof data.lide)[number]) =>
  o.mista.filter((m) => m.role !== 'narozeni' && m.role !== 'smrt' && (m.rok !== undefined || m.od !== undefined || m.do !== undefined)).length;

const maji = data.lide.filter((o) => maZastavky(o));
const nemaji = data.lide.filter((o) => !maZastavky(o));
console.log(`Oddíl Život na mapě: ${maji.length} z ${data.lide.length} lidí\n`);
for (const o of maji) {
  const z = zastavkyZivota(o);
  const tenka = sCasem(o) === 0;
  console.log(`${o.jmeno}: ${z.length} zastávek${tenka ? ' · tenká trasa' : ''} (${z.map((x) => nazev.get(x.misto)).join(' → ')})`);
  if (podrobne) for (const x of z) console.log(`    ${nazev.get(x.misto)} · ${radekZastavky(x, o).replaceAll('\u00a0', ' ')}`);
}
console.log(`\nBez oddílu (jedno místo za život): ${nemaji.map((o) => o.jmeno).join(', ')}`);
console.log(`\nTenké trasy: ${maji.filter((o) => sCasem(o) === 0).map((o) => o.jmeno).join(', ') || 'žádné'}`);
