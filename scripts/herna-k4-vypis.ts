// Výpis malých aktivit na stránkách osob (herna-v1, K4): pro každou stránku v pořadí seznamu Lidé kandidáti
// z dat a vybraná hra s otázkou, citátem a dalšími razítky. Čti ho jako stránky, ne jako tabulku.
// Spuštění: npx vite-node scripts/herna-k4-vypis.ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { nactiData } from '../src/lib/kontroly';
import { druziKdoZilDriv } from '../src/lib/dvojice';
import { aktivityStranekOsob, kandidatiAktivit, obsahAktivity, poradiLidi, type DruhAktivity, type KontextAktivit } from '../src/lib/herna/aktivity';

const koren = join(import.meta.dirname, '..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const { data } = nactiData({
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'), udalosti: cti('udalosti.yaml'),
  obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
});
// Profily jako v src/lib/stranky-osob.ts › kontextAktivit: profil s <HraOsoby> v MDX dostane hru z dat (herna-v1, T),
// ostatní mají pevnou aktivitu v MDX; bez="…" vyloučí druhy a citáty z textu profilu na kartičku nejdou.
const profily = new Set<string>();
const pevne = new Set<string>();
const bez = new Map<string, Set<DruhAktivity>>();
const citatyProfilu = new Map<string, Set<string>>();
for (const f of readdirSync(join(koren, 'src/content/osobnosti'))) {
  const t = readFileSync(join(koren, 'src/content/osobnosti', f), 'utf8');
  const fm = t.split(/^---$/m)[1] ?? '';
  const ids: string[] = [];
  for (const m of fm.matchAll(/^(?:osoba: (.+)|dalsi: \[(.+)\])$/gm)) (m[1] ?? m[2]).split(',').forEach((x) => ids.push(x.trim()));
  const sHrou = /<HraOsoby\b/.test(t);
  const b = t.match(/<HraOsoby\b[^>]*\bbez="([^"]+)"/);
  const cit = new Set([...t.matchAll(/<Citat id="([a-z0-9-]+)"/g)].map((m) => m[1]));
  const hlavni = fm.match(/^citat: ?"?([a-z0-9-]+)/m);
  if (hlavni) cit.add(hlavni[1]);
  for (const id of ids) {
    profily.add(id);
    if (!sHrou) pevne.add(id);
    citatyProfilu.set(id, cit);
  }
  if (b && ids[0]) bez.set(ids[0], new Set(b[1].split(/[\s,]+/) as DruhAktivity[]));
}
// Váha citátu jako na stránce: hlasy otázek 2, citát v textu atlasu 1 (src/lib/aktivity-stranek.ts).
import { execSync } from 'node:child_process';
const hlasy = new Set(execSync(`grep -rhoE 'citat: ?"?[a-z0-9-]+' ${join(koren, 'src/content/otazky')} || true`).toString().split('\n').map((r) => r.replace(/citat: ?"?/, '').trim()).filter(Boolean));
const vTextu = new Set(execSync(`grep -rhoE 'Citat id="[a-z0-9-]+"' ${join(koren, 'src/content')} || true`).toString().split('\n').map((r) => r.replace(/Citat id="/, '').replace('"', '').trim()).filter(Boolean));
const maStranku = (id: string) => profily.has(id) || !!data.lide.find((o) => o.id === id)?.medailonek;
const druzi = druziKdoZilDriv(data.lide.filter((o) => o.medailonek), data.lide, data.vztahy, (id) => profily.has(id));
const k: KontextAktivit = {
  lide: data.lide, vztahy: data.vztahy, citaty: data.zdroje.citaty,
  mista: new Map(data.mista.map((m) => [m.id, m])), maStranku, kdoZil: (id) => druzi.get(id) ?? null, znama: (id) => profily.has(id), vahaCitatu: (id) => (hlasy.has(id) ? 2 : vTextu.has(id) ? 1 : 0),
  naStrance: (osoba, citat) => !!citatyProfilu.get(osoba)?.has(citat),
  bez: (osoba) => bez.get(osoba),
};
const vyber = aktivityStranekOsob(k, pevne);
const jmeno = (id: string) => data.lide.find((o) => o.id === id)!.jmeno;
const pocty = new Map<string, number>();
for (const o of poradiLidi(data.lide.filter((x) => maStranku(x.id)))) {
  const a = vyber.get(o.id);
  const kand = pevne.has(o.id) ? 'profil' : kandidatiAktivit(o, k).map((x) => `${x.druh}:${x.sila}`).join(' ');
  if (!a) { console.log(`${o.obdobi} ${o.id.padEnd(22)} ${pevne.has(o.id) ? 'PROFIL (Kdo žil dřív? v MDX)' : '— nic —'}`); continue; }
  pocty.set(a.druh, (pocty.get(a.druh) ?? 0) + 1);
  const ob = obsahAktivity(o, a, k);
  let detail = '';
  if (ob.druh === 'kdo-zil') detail = `s ${jmeno(ob.b)}`;
  else if (ob.druh === 'kde') detail = `${ob.blok.scena ?? ''} ${ob.blok.otazka} → ${ob.blok.misto}`;
  else if (ob.druh === 'tipni') detail = `${ob.blok.scena ?? ''} ${ob.blok.otazka}`;
  else {
    const c = data.zdroje.citaty.find((x) => x.id === ob.blok.karty[0].citat)!;
    detail = `${c.id} „${c.cesky}“ (${jmeno(c.osoba!)}) proti ${ob.blok.karty[0].jini.map(jmeno).join(', ')} · rub: ${ob.blok.karty[0].pointa}${ob.blok.karty[0].vztah ? ` / ${ob.blok.karty[0].vztah}` : ''}`;
  }
  console.log(`${o.obdobi} ${o.id.padEnd(22)} ${a.druh.padEnd(9)}${profily.has(o.id) ? ' PROFIL' : ''} [${kand}] ${detail}`);
}
console.log([...pocty].map(([d, n]) => `${d}: ${n}`).join(', '));
