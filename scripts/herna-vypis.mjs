// Pracovní výpis pro podklady herny (P6): citáty, osoby a pojmy, ze kterých formáty vybírají.
// node scripts/herna-vypis.mjs citaty|lide|pojmy
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';

const co = process.argv[2] ?? 'citaty';
const cti = (s) => parse(readFileSync(new URL(`../src/data/${s}`, import.meta.url), 'utf8'));

if (co === 'citaty') {
  const z = cti('zdroje.yaml');
  for (const c of z.citaty) {
    console.log(`${c.id} | ${c.osoba ?? c.tradice ?? '—'} | ${c.dilo} ${c.misto} | ${c.cesky}`);
  }
}
if (co === 'lide') {
  const l = cti('lide.yaml');
  for (const o of l) {
    const n = o.narozen ? `${o.narozen.rok}${o.narozen.priblizne ? '~' : ''}` : '?';
    const z = o.zemrel ? `${o.zemrel.rok}${o.zemrel.priblizne ? '~' : ''}` : '?';
    console.log(`${o.id} | ${o.jmeno} | ${n}..${z} | ob ${o.obdobi} | ${o.hloubka} | ${(o.mista ?? []).map((m) => `${m.misto}:${m.role}${m.od ? '@' + m.od : ''}${m.do ? '-' + m.do : ''}`).join(',')}`);
  }
}
if (co === 'pojmy') {
  const slozka = new URL('../src/content/pojmy/', import.meta.url);
  for (const f of readdirSync(slozka)) {
    const t = readFileSync(new URL(f, slozka), 'utf8');
    console.log(`== ${f}\n${t.slice(0, 600)}`);
  }
}
