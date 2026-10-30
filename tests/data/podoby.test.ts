// Podoba zastavení na plátně (větev hodiny-v1, krok H4): které podoby má který druh bloku, podoba v odkazu
// (značka za id), v souboru a v aktivní hodině, a oddělený deník promítání (čisté bloky, deník studenta beze změny).
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  podobyZastaveni, nazevPodoby, ucinnaPodoba, platnaPodoba, rozeberZastaveniOdkazu, zastaveniDoOdkazu, adresaHodiny, hodinaZAdresy,
  hodinaZeSouboru, hodinaProStudenty, type Zastaveni, type UlozenaHodina,
} from '../../src/lib/hodiny';
import { NAZVY_KRESEB } from '../../src/lib/kresby';
import { aktivniHodina, platnaAktivni, ulozAktivni, vstupDoHodiny, _zapomenPamet as zapomenAktivni } from '../../src/lib/pruchod-hodiny';
import {
  nacti, ulozStavBloku, stavBloku, ulozZapis, zaznamenejKrok, ulozPrectenou, vPromitani, zalozDenikPromitani, zrusDenikPromitani,
  TEXT_DENIKU_SKRIPT, KLIC_PROMITANI, _zapomenPamet as zapomenDenik,
} from '../../src/lib/denik';

const blok = (typ: string) => ({ druh: 'blok' as const, typ });
const KRESBA = Object.keys(NAZVY_KRESEB)[0];

describe('podoby podle druhu bloku', () => {
  it('Volba, Odkryj, Nejdřív sám, Spor, Změň jednu věc, Kdo žil dřív a Slož argument mají celý blok, možnosti a otevřenou otázku', () => {
    for (const t of ['Volba', 'Odkryj', 'NejdrivSam', 'Spor', 'ZmenJednuVec', 'KdoZilDriv', 'SlozArgument']) {
      expect(podobyZastaveni(blok(t))).toEqual(['cely', 'moznosti', 'otevrena']);
    }
  });
  it('Roztřiď nemá otevřenou otázku (bez karet nemá co ukázat), Závěr cesty jen celý blok', () => {
    expect(podobyZastaveni(blok('Roztrid'))).toEqual(['cely', 'moznosti']);
    expect(podobyZastaveni(blok('ZaverCesty'))).toEqual(['cely']);
  });
  it('každá kresba má celou a jen kresbu', () => {
    for (const t of Object.keys(NAZVY_KRESEB)) expect(podobyZastaveni(blok(t))).toEqual(['cely', 'kresba']);
  });
  it('ostatní zastavení a neznámý blok podobu nemají', () => {
    for (const druh of ['krok', 'pribeh', 'kapitola', 'oddil', 'hlas', 'cesta', 'profil', 'otazka'] as const) {
      expect(podobyZastaveni({ druh })).toEqual(['cely']);
    }
    expect(podobyZastaveni(blok('Neznamy'))).toEqual(['cely']);
    expect(podobyZastaveni({ druh: 'blok' })).toEqual(['cely']);
  });
  it('názvy podob; u Odkryj jsou možnosti odkrytí', () => {
    expect(nazevPodoby('cely')).toBe('Celý blok');
    expect(nazevPodoby('moznosti', 'Volba')).toBe('Jen otázka a možnosti');
    expect(nazevPodoby('moznosti', 'Odkryj')).toBe('Jen otázka a odkrytí');
    expect(nazevPodoby('otevrena')).toBe('Otevřená otázka');
    expect(nazevPodoby('kresba')).toBe('Jen kresba');
  });
  it('účinná podoba: podoba, kterou zastavení nemá, je celý blok', () => {
    expect(ucinnaPodoba(blok('Volba'), 'otevrena')).toBe('otevrena');
    expect(ucinnaPodoba(blok('Volba'), 'kresba')).toBe('cely');
    expect(ucinnaPodoba(blok('Roztrid'), 'otevrena')).toBe('cely');
    expect(ucinnaPodoba(blok(KRESBA), 'kresba')).toBe('kresba');
    expect(ucinnaPodoba({ druh: 'krok' }, 'otevrena')).toBe('cely');
    expect(ucinnaPodoba(blok('Volba'), undefined)).toBe('cely');
  });
  it('platná podoba ze souboru: celý blok a neznámé hodnoty nic', () => {
    expect(platnaPodoba('otevrena')).toBe('otevrena');
    expect(platnaPodoba('cely')).toBeUndefined();
    expect(platnaPodoba('obri')).toBeUndefined();
    expect(platnaPodoba(3)).toBeUndefined();
    expect(platnaPodoba(null)).toBeUndefined();
  });
});

describe('podoba v odkazu', () => {
  it('značka za id: zápis a čtení', () => {
    expect(zastaveniDoOdkazu('b:x', 'moznosti')).toBe('b:x~m');
    expect(zastaveniDoOdkazu('b:x', 'otevrena')).toBe('b:x~o');
    expect(zastaveniDoOdkazu('b:x', 'kresba')).toBe('b:x~k');
    expect(zastaveniDoOdkazu('b:x', 'cely')).toBe('b:x');
    expect(zastaveniDoOdkazu('b:x')).toBe('b:x');
    expect(rozeberZastaveniOdkazu('b:x~o')).toEqual({ id: 'b:x', podoba: 'otevrena' });
    expect(rozeberZastaveniOdkazu('b:x')).toEqual({ id: 'b:x' });
    expect(rozeberZastaveniOdkazu('b:x~z')).toEqual({ id: 'b:x' });
    expect(rozeberZastaveniOdkazu('b:x~constructor')).toEqual({ id: 'b:x' });
  });
  it('adresaHodiny nese podoby; verze zůstává 1; poznámky ne', () => {
    const a = adresaHodiny({
      nazev: 'Delfy',
      zastaveni: [{ id: 'k:c/1' }, { id: 'b:volba', podoba: 'otevrena' }, { id: 'b:lod', podoba: 'kresba' }, { id: 'b:spor', podoba: 'cely' }],
    });
    expect(a).toBe('/hodina/?v=1&n=Delfy&z=k:c/1,b:volba~o,b:lod~k,b:spor');
    expect(adresaHodiny({ nazev: 'X', zastaveni: ['b:volba', 'b:lod'], podoby: { 'b:volba': 'moznosti' } })).toBe('/hodina/?v=1&n=X&z=b:volba~m,b:lod');
  });
  it('hodinaZAdresy: podoby se přečtou, id zůstanou bez značky', () => {
    const h = hodinaZAdresy('/hodina/?v=1&n=Delfy&z=k:c/1,b:volba~o,b:lod~k,b:spor~m')!;
    expect(h.zastaveni).toEqual(['k:c/1', 'b:volba', 'b:lod', 'b:spor']);
    expect(h.podoby).toEqual({ 'b:volba': 'otevrena', 'b:lod': 'kresba', 'b:spor': 'moznosti' });
  });
  it('odkaz bez značky je celý blok (starší odkaz se přečte stejně jako dřív)', () => {
    expect(hodinaZAdresy('/hodina/?v=1&n=Delfy&z=k:c/1,b:volba')).toEqual({ nazev: 'Delfy', zastaveni: ['k:c/1', 'b:volba'] });
  });
  it('neznámá značka se bere jako celý blok, nic nespadne; zakódovaná vlnovka se přečte', () => {
    const h = hodinaZAdresy('/hodina/?v=1&n=X&z=b:volba~q,b:spor%7Eo,~o,b:~o')!;
    expect(h.zastaveni).toEqual(['b:volba', 'b:spor']);
    expect(h.podoby).toEqual({ 'b:spor': 'otevrena' });
  });
  it('opakované zastavení: platí první výskyt i s jeho podobou', () => {
    const h = hodinaZAdresy('/hodina/?v=1&z=b:volba,b:volba~o')!;
    expect(h.zastaveni).toEqual(['b:volba']);
    expect(h.podoby).toBeUndefined();
  });
  it('tam a zpět: adresa z přečtené hodiny je stejná', () => {
    const a = '/hodina/?v=1&n=Delfy&z=k:c/1,b:volba~o,b:lod~k';
    expect(adresaHodiny(hodinaZAdresy(a)!)).toBe(a);
  });
});

describe('podoba v souboru a v úložišti', () => {
  const soubor = (zastaveni: unknown[]) => JSON.stringify({ verze: 1, id: 'h1', nazev: 'Delfy', poznamka: '', zastaveni, zmeneno: '2026-10-18T09:00:00.000Z' });
  it('podoba se zachová, celý blok a neznámá hodnota se vypustí', () => {
    const h = hodinaZeSouboru(soubor([
      { id: 'b:volba', poznamka: 'a', podoba: 'otevrena' },
      { id: 'b:lod', poznamka: '', podoba: 'kresba' },
      { id: 'b:spor', poznamka: '', podoba: 'cely' },
      { id: 'b:roz', poznamka: '', podoba: 'obri' },
    ]))!;
    expect(h.zastaveni).toEqual([
      { id: 'b:volba', poznamka: 'a', podoba: 'otevrena' },
      { id: 'b:lod', poznamka: '', podoba: 'kresba' },
      { id: 'b:spor', poznamka: '' },
      { id: 'b:roz', poznamka: '' },
    ]);
  });
  it('starší hodina bez podoby: všechna zastavení celá', () => {
    const h = hodinaZeSouboru(soubor([{ id: 'b:volba', poznamka: 'x' }, { id: 'k:c/1', poznamka: '' }]))!;
    expect(h.zastaveni.every((z) => z.podoba === undefined)).toBe(true);
    expect(hodinaProStudenty(h)).toEqual({ nazev: 'Delfy', zastaveni: ['b:volba', 'k:c/1'] });
  });
  it('hodina pro studenty nese podoby, poznámky ne', () => {
    const h = hodinaZeSouboru(soubor([{ id: 'b:volba', poznamka: 'TAJNE', podoba: 'otevrena' }]))!;
    const s = hodinaProStudenty(h);
    expect(s).toEqual({ nazev: 'Delfy', zastaveni: ['b:volba'], podoby: { 'b:volba': 'otevrena' } });
    expect(JSON.stringify(s)).not.toContain('TAJNE');
  });
});

describe('podoba v aktivní hodině', () => {
  const zast = (id: string, druh: Zastaveni['druh'], typ?: string): Zastaveni => ({
    id, druh, nazev: id, kde: '', stranka: '/cesta/c/2/', kotva: id.slice(2), adresa: `/cesta/c/2/#${id.slice(2)}`, obdobi: 1, rodic: null, poradi: 0, ...(typ ? { typ } : {}),
  });
  const KATALOG = [zast('b:volba', 'blok', 'Volba'), zast('b:roz', 'blok', 'Roztrid'), zast('b:lod', 'blok', KRESBA), zast('p:pribeh', 'pribeh', 'Pribeh')];
  it('podoba zůstane jen u zastavení, které ji má', () => {
    const h = aktivniHodina(
      { nazev: 'X', zastaveni: ['b:volba', 'b:roz', 'b:lod', 'p:pribeh', 'b:zruseny'], podoby: { 'b:volba': 'otevrena', 'b:roz': 'otevrena', 'b:lod': 'kresba', 'p:pribeh': 'moznosti', 'b:zruseny': 'otevrena' } },
      KATALOG,
      '/hodina/?v=1',
      true,
    );
    expect(h.polozky.map((p) => p.podoba)).toEqual(['otevrena', undefined, 'kresba', undefined, undefined]);
  });
  it('platnaAktivni: neplatná podoba z úložiště zmizí, platná zůstane', () => {
    const h = aktivniHodina({ nazev: 'X', zastaveni: ['b:volba', 'b:roz'], podoby: { 'b:volba': 'moznosti' } }, KATALOG, '/hodina/?v=1');
    const ulozena = JSON.parse(JSON.stringify(h));
    ulozena.polozky[1].podoba = 'obri';
    const p = platnaAktivni(ulozena)!;
    expect(p.polozky[0].podoba).toBe('moznosti');
    expect('podoba' in p.polozky[1]).toBe(false);
  });
});

// ─── Deník promítání ──────────────────────────────────────────────────────────

class Uloziste {
  data = new Map<string, string>();
  getItem(k: string) { return this.data.get(k) ?? null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}
const g = globalThis as unknown as { localStorage?: unknown; sessionStorage?: unknown };

describe('deník promítání', () => {
  let ls: Uloziste;
  let ss: Uloziste;
  const KATALOG: Zastaveni[] = [
    { id: 'b:volba', druh: 'blok', typ: 'Volba', nazev: 'V', kde: '', stranka: '/cesta/c/1/', kotva: 'volba', adresa: '/cesta/c/1/#volba', obdobi: 1, rodic: null, poradi: 0 },
  ];
  const hodina = () => aktivniHodina({ nazev: 'X', zastaveni: ['b:volba'] }, KATALOG, '/hodina/?v=1&z=b:volba');
  beforeEach(() => {
    ls = new Uloziste();
    ss = new Uloziste();
    g.localStorage = ls;
    g.sessionStorage = ss;
    zapomenDenik();
    zapomenAktivni();
    // Plný deník studenta: zvolená Volba, zápis, prošlý krok.
    ulozStavBloku('volba', { vyber: 1, potvrzeno: true });
    ulozZapis({ id: 'jak-zit/prvni', otazka: '?', odpoved: 'Mám názor', odkaz: '/otazka/jak-zit/' });
    zaznamenejKrok('c', 1, 'Cesta', 3);
  });
  afterEach(() => { delete g.localStorage; delete g.sessionStorage; });

  it('Promítat hodinu začne s prázdným deníkem; deník studenta zůstane beze změny', () => {
    const pred = ls.getItem('atlas-denik');
    expect(vstupDoHodiny(hodina(), 0, true)).toBe('/cesta/c/1/#volba');
    expect(vPromitani()).toBe(true);
    expect(stavBloku('volba')).toBeUndefined();
    expect(nacti().zapisy).toEqual([]);
    expect(nacti().cesty).toEqual({});
    ulozStavBloku('volba', { vyber: 3, potvrzeno: true });
    ulozZapis({ id: 'jak-zit/prvni', otazka: '?', odpoved: 'Třída', odkaz: '/' });
    zaznamenejKrok('c', 2, 'Cesta', 3);
    ulozPrectenou('/osobnost/sokrates/', 'soud');
    expect(stavBloku('volba')).toEqual({ vyber: 3, potvrzeno: true });
    expect(ls.getItem('atlas-denik')).toBe(pred);
  });
  it('stav bloků drží napříč stránkami jednoho promítání (sessionStorage), nové Promítat hodinu je zase čisté', () => {
    vstupDoHodiny(hodina(), 0, true);
    ulozStavBloku('volba', { vyber: 2 });
    zapomenDenik(); // „další stránka“: paměť modulu je pryč, sessionStorage zůstává
    expect(stavBloku('volba')).toEqual({ vyber: 2 });
    vstupDoHodiny(hodina(), 0, true);
    expect(stavBloku('volba')).toBeUndefined();
  });
  it('konec promítání smaže deník promítání a bloky zase čtou deník studenta', () => {
    const pred = ls.getItem('atlas-denik');
    const h = hodina();
    vstupDoHodiny(h, 0, true);
    ulozStavBloku('volba', { vyber: 0 });
    ulozAktivni({ ...h, promitani: false });
    expect(vPromitani()).toBe(false);
    expect(ss.getItem(KLIC_PROMITANI)).toBeNull();
    expect(stavBloku('volba')).toEqual({ vyber: 1, potvrzeno: true });
    expect(ls.getItem('atlas-denik')).toBe(pred);
  });
  it('vstup do hodiny bez promítání (student s lištou) pracuje s deníkem studenta', () => {
    vstupDoHodiny(hodina(), 0, true);
    vstupDoHodiny(hodina(), 0, false);
    expect(vPromitani()).toBe(false);
    expect(stavBloku('volba')).toEqual({ vyber: 1, potvrzeno: true });
  });
  it('bez sessionStorage drží deník promítání aspoň v paměti stránky', () => {
    delete g.sessionStorage;
    const pred = ls.getItem('atlas-denik');
    zalozDenikPromitani();
    expect(vPromitani()).toBe(true);
    ulozStavBloku('volba', { vyber: 2 });
    expect(stavBloku('volba')).toEqual({ vyber: 2 });
    expect(ls.getItem('atlas-denik')).toBe(pred);
    zrusDenikPromitani();
    expect(stavBloku('volba')).toEqual({ vyber: 1, potvrzeno: true });
  });
  it('skript před vykreslením čte při promítání deník promítání, jinak deník studenta', () => {
    const precti = () => JSON.parse(new Function('sessionStorage', 'localStorage', `return ${TEXT_DENIKU_SKRIPT};`)(ss, ls));
    expect(precti().zapisy).toHaveLength(1);
    zalozDenikPromitani();
    expect(precti().zapisy).toEqual([]);
    zrusDenikPromitani();
    expect(precti().zapisy).toHaveLength(1);
  });
});

// Typ UlozenaHodina musí nést podobu (kontrola při překladu).
const _typ: UlozenaHodina['zastaveni'][number] = { id: 'b:x', poznamka: '', podoba: 'otevrena' };
void _typ;
