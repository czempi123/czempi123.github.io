// Rozdíl dvou katalogů přípravy hodiny (dist/hodina/katalog.json): která zastavení přibyla, ubyla a která se změnila.
// Pole `poradi` se porovnává zvlášť (posun pořadí na stránce není změna zastavení).
// Spuštění: node scripts/katalog-rozdil.mjs <starý.json> [<nový.json>, výchozí dist/hodina/katalog.json]
import { readFileSync } from 'node:fs';

const [stary, novy = 'dist/hodina/katalog.json'] = process.argv.slice(2);
const nacti = (f) => new Map(JSON.parse(readFileSync(f, 'utf8')).zastaveni.map((z) => [z.id, z]));
const a = nacti(stary);
const b = nacti(novy);
const bez = ({ poradi, ...z }) => JSON.stringify(z);
const pribylo = [...b.keys()].filter((id) => !a.has(id));
const ubylo = [...a.keys()].filter((id) => !b.has(id));
const zmena = [...a.keys()].filter((id) => b.has(id) && bez(a.get(id)) !== bez(b.get(id)));
const poradi = [...a.keys()].filter((id) => b.has(id) && a.get(id).poradi !== b.get(id).poradi);
console.log(`Přibylo ${pribylo.length}: ${pribylo.join(', ')}`);
console.log(`Ubylo ${ubylo.length}: ${ubylo.join(', ')}`);
console.log(`Změněno ${zmena.length}: ${zmena.join(', ')}`);
console.log(`Jen jiné pořadí na stránce: ${poradi.length}`);
