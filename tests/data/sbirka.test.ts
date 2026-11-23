// Sbírka citátů (denik-v2, K4): pořadí, období stránky, údaje pod citátem a sbírka jako text (plán › Formáty).
import { describe, expect, it } from 'vitest';
import { obdobiVystrizku, sbirkaJakoText, seradSbirku, souborSbirky, udajeCitatu } from '../../src/lib/sbirka';
import { CITATY_NEJVYS, sCitatem, sbirkaPlna, type CitatVDeniku, type Denik } from '../../src/lib/denik';

const c = (id: string, kdy: string, cast: Partial<CitatVDeniku> = {}): CitatVDeniku => ({
  id, text: `Věta ${id}.`, kde: `Autor ${id}, Dílo 1`, odkaz: `/osobnost/${id}/`, kdy, ...cast,
});

describe('sbírka citátů', () => {
  it('řadí od nejnovějšího', () => {
    const s = seradSbirku([c('a', '2026-11-01T10:00:00Z'), c('b', '2026-11-03T10:00:00Z'), c('c', '2026-11-02T10:00:00Z')]);
    expect(s.map((x) => x.id)).toEqual(['b', 'c', 'a']);
  });

  it('údaje pod citátem: autor, dílo a místo', () => {
    expect(udajeCitatu({ autor: 'Seneca', dilo: 'Listy Luciliovi', misto: '1, 1' })).toBe('Seneca, Listy Luciliovi 1, 1');
  });

  it('období stránky, odkud citát je: krok cesty patří cestě, kotva se nepočítá', () => {
    const m = { '/osobnost/epikuros/': 1, '/cesta/kolik-je-dost/': 1, '/otazka/jak-zit/': undefined };
    expect(obdobiVystrizku('/osobnost/epikuros/#myslenky', m)).toBe(1);
    expect(obdobiVystrizku('/cesta/kolik-je-dost/3/', m)).toBe(1);
    expect(obdobiVystrizku('/otazka/jak-zit/', m)).toBeUndefined();
    expect(obdobiVystrizku('/dilna/', m)).toBeUndefined();
  });

  it('jméno souboru s místním datem', () => {
    expect(souborSbirky(new Date(2026, 10, 2, 23, 30))).toBe('atlas-citaty-2026-11-02.txt');
  });

  it('text podle formátu: hlavička, výstřižky od nejnovějšího, poznámka jen když je, adresa stránky', () => {
    const text = sbirkaJakoText([
      c('a', '2026-11-01T10:00:00Z', { text: 'Komu je málo dost, tomu není dost nic.', kde: 'Epikúros, Výrok 68', odkaz: '/osobnost/epikuros/' }),
      c('b', '2026-11-05T10:00:00Z', { text: 'Uber\u00a0si.', kde: 'Seneca, Listy 1, 1', odkaz: '/cesta/kam-mi-mizi-cas/2/', poznamka: '  Na ráno. ' }),
    ], new Date(2026, 10, 22));
    expect(text).toBe([
      'Moje sbírka citátů z Atlasu myšlení (22. 11. 2026)',
      '',
      '„Uber si.“',
      'Seneca, Listy 1, 1',
      'Proč zrovna tenhle: Na ráno.',
      'https://czempi123.github.io/cesta/kam-mi-mizi-cas/2/',
      '',
      '„Komu je málo dost, tomu není dost nic.“',
      'Epikúros, Výrok 68',
      'https://czempi123.github.io/osobnost/epikuros/',
      '',
    ].join('\n'));
  });

  it('prázdná sbírka: jen hlavička', () => {
    expect(sbirkaJakoText([], new Date(2026, 0, 5))).toBe('Moje sbírka citátů z Atlasu myšlení (5. 1. 2026)\n');
  });

  it('plná sbírka nový citát nevezme, už vystřižený posune navrch', () => {
    const citaty = Array.from({ length: CITATY_NEJVYS }, (_, i) => c(`x${i}`, '2026-11-01T10:00:00Z'));
    const d = { verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, citaty } as unknown as Denik;
    expect(sbirkaPlna(d)).toBe(true);
    expect(sCitatem(d, { id: 'novy', text: 'N', kde: 'K', odkaz: '/' }, '2026-11-22T10:00:00Z')).toBeNull();
    expect(sCitatem(d, { id: 'x5', text: 'Věta x5.', kde: 'K', odkaz: '/' }, '2026-11-22T10:00:00Z')?.citaty?.[0].id).toBe('x5');
  });
});
