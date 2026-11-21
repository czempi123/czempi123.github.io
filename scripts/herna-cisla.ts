// Podklady herny (P6): čísla pro Tipni si, pětice pro Seřaď na ose a odpovědi Výprav, spočítané z dat.
// Spuštění: npx vite-node scripts/herna-cisla.ts   (volitelně --pobyty: všechny pobyty s časem v obdobích 1 a 2)
// Výsledek je opsaný v docs/podklady/herna.md; když se data změní, pusť skript znovu a porovnej.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { nactiData } from '../src/lib/kontroly';
import { rozdilLet, vek, rok } from '../src/lib/casy';
import { vzdalenost, kdeVRoce, zijiciVRoce, zivotOsoby } from '../src/lib/cas-mapy';

const koren = join(import.meta.dirname, '..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const { data } = nactiData({
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'), udalosti: cti('udalosti.yaml'),
  obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
});
const o = (id: string) => {
  const x = data.lide.find((l) => l.id === id);
  if (!x) throw new Error(`Osoba ${id} není v datech`);
  return x;
};
const misto = (id: string) => data.mista.find((m) => m.id === id)?.nazev ?? id;
const asi = (d?: { priblizne?: boolean }) => (d?.priblizne ? 'asi ' : '');
const vypis = (s: string) => console.log(s.replace(/ /g, ' '));

// ─── Tipni si ────────────────────────────────────────────────────────────────
vypis('## Tipni si');
const delka = (id: string) => {
  const x = o(id);
  if (!x.narozen || !x.zemrel) return `${x.jmeno}: neúplné roky`;
  const pribl = x.narozen.priblizne || x.zemrel.priblizne;
  return `${x.jmeno} (${rok(x.narozen.rok)} až ${rok(x.zemrel.rok)}): dožil se ${pribl ? 'asi ' : ''}${vek(x.narozen.rok, x.zemrel.rok)} let`;
};
for (const id of ['isokrates', 'gorgias', 'demokritos', 'karneades', 'xenofanes', 'epiktetos']) vypis(delka(id));

// Nejdelší a nejkratší život v datech (jen s oběma roky)
const zivoty = data.lide
  .filter((x) => x.narozen && x.zemrel)
  .map((x) => ({ x, let: vek(x.narozen!.rok, x.zemrel!.rok), asi: !!(x.narozen!.priblizne || x.zemrel!.priblizne) }))
  .sort((a, b) => b.let - a.let);
vypis(`Nejdelší životy: ${zivoty.slice(0, 5).map((z) => `${z.x.jmeno} ${z.asi ? '~' : ''}${z.let}`).join(', ')}`);
vypis(`Nejkratší životy: ${zivoty.slice(-4).map((z) => `${z.x.jmeno} ${z.asi ? '~' : ''}${z.let}`).join(', ')}`);

const dvojice: [string, string][] = [
  ['konfucius', 'pythagoras'], ['konfucius', 'herakleitos'], ['konfucius', 'sokrates'], ['sokrates', 'demokritos'],
  ['diogenes', 'aristoteles'], ['diogenes', 'epikuros'], ['platon', 'diogenes'], ['epiktetos', 'marcus-aurelius'],
  ['marcus-aurelius', 'plotinos'], ['seneca', 'filon-alexandrijsky'], ['thales', 'hypatia'], ['sokrates', 'epiktetos'],
  ['thales', 'sokrates'], ['aristoteles', 'epikuros'], ['zenon-z-kitia', 'epikuros'], ['cicero', 'seneca'],
];
for (const [a, b] of dvojice) {
  const v = vzdalenost(o(a), o(b));
  vypis(`${o(a).jmeno} × ${o(b).jmeno}: ${v ? `${v.druh} ${v.let} (${v.asi ? 'asi' : 'přesně'}) · ${v.text}` : 'nelze'}`);
}
const smrt = (id: string) => o(id).zemrel!;
vypis(`Diogenés zemřel ${asi(smrt('diogenes'))}${rok(smrt('diogenes').rok)}, Aristotelés ${asi(smrt('aristoteles'))}${rok(smrt('aristoteles').rok)}: rozdíl ${rozdilLet(smrt('diogenes').rok, smrt('aristoteles').rok)} rok`);
vypis(`Démokritos přežil Sókrata o ${asi(smrt('demokritos'))}${rozdilLet(smrt('sokrates').rok, smrt('demokritos').rok)} let`);
vypis(`Diogenés přežil Platóna o ${rozdilLet(smrt('platon').rok, smrt('diogenes').rok)} let`);

// Roky, kdy nežil nikdo z lidí atlasu (období 1 a 2)
const roky: number[] = [];
for (let r = -650; r <= 420; r++) if (r !== 0) roky.push(r);
const prazdne: [number, number][] = [];
let zac: number | null = null;
let pred: number | null = null;
for (const r of roky) {
  const nikdo = zijiciVRoce(data.lide.filter((x) => x.obdobi <= 2), r).length === 0;
  if (nikdo && zac === null) zac = r;
  if (!nikdo && zac !== null) { prazdne.push([zac, pred!]); zac = null; }
  pred = r;
}
vypis(`Mezery bez lidí atlasu (−650 až 420): ${prazdne.map(([a, b]) => `${rok(a)}–${rok(b)} (${rozdilLet(a, b) + 1} let)`).join('; ') || 'žádná'}`);
// Nejvíc a nejméně lidí naživu po desetiletích
const pocty = roky.filter((r) => r % 10 === 0).map((r) => ({ r, n: zijiciVRoce(data.lide.filter((x) => x.obdobi <= 2), r).length }));
const max = pocty.reduce((a, b) => (b.n > a.n ? b : a));
vypis(`Nejvíc lidí atlasu naživu (po desetiletích): ${rok(max.r)}: ${max.n} (${zijiciVRoce(data.lide, max.r).map((x) => x.jmeno).join(', ')})`);

// ─── Seřaď na ose ────────────────────────────────────────────────────────────
vypis('\n## Seřaď na ose');
type Karta = { id: string; nazev: string; rok: number; asi: boolean };
const narozeni = (id: string): Karta => ({ id, nazev: `${o(id).jmeno} se narodil`, rok: o(id).narozen!.rok, asi: !!o(id).narozen!.priblizne });
const umrti = (id: string): Karta => ({ id, nazev: `${o(id).jmeno} zemřel`, rok: o(id).zemrel!.rok, asi: !!o(id).zemrel!.priblizne });
const udalost = (id: string): Karta => {
  const u = data.udalosti.find((x) => x.id === id);
  if (!u) throw new Error(`Událost ${id} není v datech`);
  return { id, nazev: u.nazev, rok: u.od, asi: false };
};
const petice: { nazev: string; karty: Karta[] }[] = [
  { nazev: 'Kdo se narodil dřív (s Konfuciem)', karty: ['thales', 'konfucius', 'parmenides', 'sokrates', 'aristoteles'].map(narozeni) },
  { nazev: 'Kdo zemřel dřív', karty: ['sokrates', 'demokritos', 'platon', 'diogenes', 'epikuros'].map(umrti) },
  { nazev: 'Události období 1', karty: ['marathon', 'peloponneska-valka', 'proces-sokrata', 'alexandrova-tazeni'].map(udalost).concat(umrti('platon')) },
  { nazev: 'Období 2: Athény a Řím', karty: [udalost('epikurova-zahrada'), udalost('karneades-v-rime'), umrti('cicero'), udalost('seneca-na-korsice'), narozeni('marcus-aurelius')] },
  { nazev: 'Kdo se narodil dřív (stoikové)', karty: ['zenon-z-kitia', 'chrysippos', 'seneca', 'epiktetos', 'marcus-aurelius'].map(narozeni) },
];
for (const p of petice) {
  const s = [...p.karty].sort((a, b) => a.rok - b.rok);
  const mezery = s.slice(1).map((k, i) => ({ k, d: rozdilLet(s[i].rok, k.rok), asi: k.asi || s[i].asi }));
  const slaba = mezery.filter((m) => (m.asi ? m.d < 20 : m.d < 1));
  vypis(`${p.nazev}: ${s.map((k) => `${k.nazev} (${k.asi ? 'asi ' : ''}${rok(k.rok)})`).join(' → ')}`);
  vypis(`   mezery: ${mezery.map((m) => `${m.d}${m.asi ? '~' : ''}`).join(', ')}${slaba.length ? `  POZOR: těsné ${slaba.map((m) => m.k.id).join(', ')}` : ''}`);
}

// ─── Výpravy ─────────────────────────────────────────────────────────────────
vypis('\n## Výpravy');
const vyprava = (id: string, r: number) => {
  const p = kdeVRoce(o(id), r);
  vypis(`${o(id).jmeno} roku ${rok(r)}: ${p ? `${misto(p.misto)} (${p.role}${p.urcite ? ', určitě' : ', odvozené'}${p.priblizne ? ', asi' : ''})` : 'nežije'}`);
};
for (const [id, r] of [
  ['pythagoras', -520], ['aristoteles', -346], ['aristoteles', -343], ['anaxagoras', -440], ['platon', -380], ['xenokrates', -330],
  ['epikuros', -310], ['seneca', 45], ['marcus-aurelius', 173], ['epiktetos', 100], ['plotinos', 240], ['zenon-z-kitia', -300],
] as [string, number][]) vyprava(id, r);
for (const r of [-500, -399, -323, 65, 180]) {
  const z = zijiciVRoce(data.lide, r);
  vypis(`Roku ${rok(r)} žije ${z.length} lidí atlasu: ${z.map((x) => x.jmeno).join(', ')}`);
  const mimo = z
    .map((x) => ({ x, p: kdeVRoce(x, r) }))
    .filter(({ p }) => p && p.misto !== 'athenes')
    .map(({ x, p }) => `${x.jmeno} ${misto(p!.misto)}${p!.urcite ? '' : ' (odvozené)'}`);
  vypis(`   mimo Athény: ${mimo.join(', ') || 'nikdo'}`);
}

if (process.argv.includes('--pobyty')) {
  vypis('\n## Pobyty s časem (období 1 a 2)');
  for (const x of data.lide.filter((l) => l.obdobi <= 2)) {
    const zz = zivotOsoby(x);
    for (const m of x.mista ?? []) {
      if (m.rok === undefined && m.od === undefined && m.do === undefined) continue;
      vypis(`${x.jmeno}: ${misto(m.misto)} ${m.role} ${m.rok ?? ''}${m.od ?? ''}..${m.do ?? ''} (život ${zz?.od}..${zz?.do})`);
    }
  }
}
