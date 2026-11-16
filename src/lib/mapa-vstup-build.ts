// Sestaví VstupMapy z ověřených dat (běží jen při sestavení stránky /mapa).
import { data } from './data';
import { nezlomitelne } from './sazba.js';
import { rozpeti, zivot } from './casy';
import { ornamenty } from './ornamenty.js';
import { zijeVRoce } from './cas-mapy';
import type { VstupMapy } from './mapa-vstup';

/** `adresa`: adresa stránky osoby (adresaOsoby v src/lib/adresa-osoby.ts); Hipparchia tak vede na společný profil. */
export function vstupMapy(adresa: (osoba: string) => string | undefined): VstupMapy {
  const lide = data.lide.map((o) => ({
    id: o.id,
    jmeno: o.jmeno,
    jmeno2: o.jmeno2,
    zena: o.zena,
    narozen: o.narozen,
    zemrel: o.zemrel,
    aktivni: o.aktivni,
    obdobi: o.obdobi,
    hloubka: o.hloubka,
    tradice: o.tradice,
    mista: o.mista,
    kdo: o.kdo && nezlomitelne(o.kdo),
    proc: o.proc && nezlomitelne(o.proc),
    atribut: o.atribut ? { ikona: o.atribut.ikona, nazev: o.atribut.nazev, proc: o.atribut.proc } : undefined,
    stranka: adresa(o.id),
    zivot: zivot(o),
  }));
  const obdobiSLidmi = new Set(data.lide.map((o) => o.obdobi));
  const obdobi = data.obdobi.map((o) => ({
    id: o.id,
    nazev: o.nazev,
    kratce: o.kratce,
    okno: o.okno,
    oknoText: rozpeti(o.okno.od, o.okno.do, o.id === 8),
    popis: o.mapa.popis,
    otevrene: obdobiSLidmi.has(o.id),
    ornament: { uzky: ornamenty.mini(o.id - 1, 60), siroky: ornamenty.mini(o.id - 1, 180) },
  }));
  const otevrena = obdobi.filter((o) => o.otevrene);
  const rozsah: [number, number] = [Math.min(...otevrena.map((o) => o.okno.od)), Math.max(...otevrena.map((o) => o.okno.do))];
  const dejiny: [number, number] = [data.obdobi[0].okno.od, data.obdobi[data.obdobi.length - 1].okno.do];
  const hustota: { od: number; pocet: number }[] = [];
  for (let r = dejiny[0]; r < dejiny[1]; r += 25) {
    const stred = r + 12 === 0 ? 1 : r + 12;
    hustota.push({ od: r, pocet: data.lide.filter((o) => zijeVRoce(o, stred)).length });
  }
  return {
    lide,
    mista: data.mista.map((m) => ({ id: m.id, nazev: m.nazev, dnes: m.dnes, oblast: m.oblast })),
    vztahy: data.vztahy.map((v) => ({ od: v.od, k: v.k, typ: v.typ, tradovany: v.tradovany, poznamka: v.poznamka && nezlomitelne(v.poznamka) })),
    udalosti: data.udalosti.map((u) => ({ id: u.id, nazev: u.nazev, od: u.od, do: u.do, druh: u.druh, osoby: u.osoby, misto: u.misto, obdobi: u.obdobi })),
    obdobi,
    rozsah,
    hustota,
    dejiny,
  };
}
