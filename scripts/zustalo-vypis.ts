// Výpis všech otázek Co ti zůstalo? jednoho období jako text pro kroky T a R (denik-v2, K2).
// Spuštění: npx vite-node scripts/zustalo-vypis.ts [soubor]   (výchozí Claude outputs/zustalo-antika.md)
// Skládá totéž co stránka Tvoje antika (src/lib/herna/zustalo-data.ts), včetně kontroly; u každé otázky správná
// odpověď, vysvětlení, odkaz zpět a kde ji student potká.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { katalogZustalo, vstupZustalo } from '../src/lib/herna/zustalo-data';
import { NAZVY_DRUHU, type DruhZustalo } from '../src/lib/herna/zustalo';

const OBDOBI = [1, 2];
const soubor = process.argv[2] ?? join(import.meta.dirname, '..', 'Claude outputs', 'zustalo-antika.md');
const k = katalogZustalo(OBDOBI);
const v = vstupZustalo(OBDOBI);
const r: string[] = [];
const pocty = (d: DruhZustalo) => k.otazky.filter((o) => o.druh === d).length;
r.push('# Co ti zůstalo? Všechny otázky antiky', '');
r.push(`Vypsáno ${new Date().toISOString().slice(0, 10)} skriptem scripts/zustalo-vypis.ts. ${k.otazky.length} otázek: ` +
  (['pojem', 'hlas', 'kresba'] as DruhZustalo[]).map((d) => `${NAZVY_DRUHU[d].toLocaleLowerCase('cs')} ${pocty(d)}`).join(', ') + '.', '');
r.push('Správná možnost je označená ✓. „Potká“ říká, kde student musel být, aby otázku dostal.', '');

const bezOtazky = v.pojmy.filter((p) => p.obdobi.some((o) => OBDOBI.includes(o)) && !k.otazky.some((o) => o.id === `pojem:${p.id}`));
const hlasyBez = v.otazky.flatMap((o) => (o.hlasy.length >= 3 ? o.hlasy.filter((h) => !k.otazky.some((x) => x.id === `hlas:${o.slug}:${h.osoba}`)).map((h) => `${h.jmeno} (${o.otazka})`) : []));
const kresbyBez = v.kresby.filter((x) => !x.veta && !k.otazky.some((o) => o.id === `kresba:${x.komponenta}`)).map((x) => x.nazev);
r.push('## Co do kvízu nepřišlo', '');
r.push(`- Pojmy bez situace (příklad pojem jmenuje a v Párech není): ${bezOtazky.map((p) => p.pojem).join(', ') || 'žádné'}`);
r.push(`- Hlasy, jejichž odpověď jmenuje některého z mluvčích: ${hlasyBez.join('; ') || 'žádné'}`);
r.push(`- Kresby bez věty nad sebou: ${kresbyBez.join(', ') || 'žádné'}`);
r.push(`- Kresby, ke kterým by poctivě patřilo víc otázek (BLIZKE_OTAZKY_KRESEB): ${v.kresby.filter((x) => x.veta && !k.otazky.some((o) => o.id === `kresba:${x.komponenta}`)).map((x) => x.nazev).join(', ') || 'žádné'}`);
r.push(`- Otázky s méně než třemi hlasy z antiky: ${v.otazky.filter((o) => o.hlasy.length < 3).map((o) => o.otazka).join(', ')}`, '');

for (const d of ['pojem', 'hlas', 'kresba'] as DruhZustalo[]) {
  r.push(`## ${NAZVY_DRUHU[d]} (${pocty(d)})`, '');
  for (const o of k.otazky.filter((x) => x.druh === d)) {
    r.push(`### ${o.nazev}`, '', `\`${o.id}\``, '');
    for (const odst of o.podnet.split(/\n\s*\n/)) r.push(`> ${odst}`, '>');
    r.pop();
    r.push('', `**${o.zadani}**`, '');
    for (const m of o.moznosti) r.push(`- ${m.id === o.spravna ? '✓ ' : ''}${m.text}`);
    r.push('', `Vysvětlení: ${o.vysvetleni}`, '', `Zpět: ${o.zpet.text} (${o.zpet.href})`, '');
    r.push(`Potká: ${o.potkal.map((p) => (k.mista[p] ? `${p}` : `${p} (bez odkazu)`)).join(', ')}`, '');
  }
}
mkdirSync(dirname(soubor), { recursive: true });
writeFileSync(soubor, r.join('\n').replaceAll('\u00a0', ' '));
console.log(`${soubor}: ${k.otazky.length} otázek`);
