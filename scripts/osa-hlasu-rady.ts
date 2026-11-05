// Výpis rozvržení osy hlasů pro všech osm otázek a tři šířky (počet řádků, výška, poloha mincí).
// Spuštění: npx vite-node scripts/osa-hlasu-rady.ts
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { osoby } from '../src/lib/data';
import { seradHlasy } from '../src/lib/otazky';
import { zivot } from '../src/lib/casy';
import { rozlozeniOsy, type SirkaOsy } from '../src/lib/osa-hlasu';

const slozka = 'src/content/otazky';
for (const f of readdirSync(slozka).filter((x) => /^[^_].*\.mdx?$/.test(x))) {
  const fm = parse(readFileSync(`${slozka}/${f}`, 'utf8').split('---')[1]);
  if (!fm.hlasy?.length) continue;
  const hlasy = seradHlasy(fm.hlasy as { osoba: string }[], osoby).map((h) => {
    const o = osoby.get(h.osoba)!;
    return { ...o, ikona: o.atribut?.ikona, zivotText: zivot(o) };
  });
  const radky = (['uzka', 'stredni', 'siroka'] as SirkaOsy[]).map((s) => {
    const r = rozlozeniOsy(hlasy, s);
    return `${s} ${r.rad}r ${Math.round(r.vyska)}px [${r.mince.map((m) => `${m.id.slice(0, 5)}:${Math.round(m.x)}/${m.rada}`).join(' ')}] ${r.znacky.map((z) => z.text).join(' | ')}`;
  });
  console.log(f, '\n  ' + radky.join('\n  '));
}
