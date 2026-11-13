// Čistý list a aktivity na tečkách (design-v2, K3 dodatek, body 1 a 7): src/lib/listy.ts.
import { describe, expect, it } from 'vitest';
import { uzlyNejvyssiUrovne, druhUzlu, useky, uchyceniCitatu, uchytCitaty, listyKroku, OKRAJ_NEJVYS_ZNAKU } from '../../src/lib/listy';

describe('uzly nejvyšší úrovně', () => {
  it('rozdělí odstavce, citát a ostrov a nesáhne dovnitř', () => {
    const html = '<p>A <em>b</em></p>\n<figure class="citat" data-delka="40"><blockquote><p>„x“</p></blockquote></figure>'
      + '<astro-island uid="1" props="{&quot;a&quot;:&quot;<p>&gt;&quot;}"><div class="blok"><p>uvnitř</p><img src="a.png"><br/></div></astro-island><p>Konec</p>';
    const u = uzlyNejvyssiUrovne(html);
    expect(u.map((x) => x.tag ?? 'text')).toEqual(['p', 'text', 'figure', 'astro-island', 'p']);
    expect(u[2].trida).toBe('citat');
    expect(u.map((x) => x.html).join('')).toBe(html);
  });

  it('skript a styl čte jako surový text, komentář jako jeden uzel', () => {
    const html = '<script>if (a < b) document.write("</p>")</script><!-- <div> --><style>p>a{}</style><p>t</p>';
    const u = uzlyNejvyssiUrovne(html);
    expect(u.map((x) => x.tag ?? (x.html.startsWith('<!--') ? 'komentář' : 'text'))).toEqual(['script', 'komentář', 'style', 'p']);
  });

  it('druh: text, citát a seznam patří na list, blok a kresba ne', () => {
    const d = (h: string) => druhUzlu(uzlyNejvyssiUrovne(h)[0]);
    expect(d('<p>a</p>')).toBe('text');
    expect(d('<ul><li>a</li></ul>')).toBe('text');
    expect(d('<figure class="citat citat--velky"><p>a</p></figure>')).toBe('text');
    expect(d('<figure class="kresba"></figure>')).toBe('aktivita');
    expect(d('<div class="blok"></div>')).toBe('aktivita');
    expect(d('<astro-island></astro-island>')).toBe('aktivita');
    expect(d('\n  ')).toBe('nic');
  });
});

describe('úseky kapitoly', () => {
  it('souvislý text se slije do jednoho úseku, aktivita ho rozdělí', () => {
    const u = useky('<p>1</p>\n<p>2</p>\n<figure class="citat"><p>c</p></figure>\n<div class="blok">b</div>\n<p>3</p>\n');
    expect(u.map((x) => x.druh)).toEqual(['text', 'aktivita', 'text']);
    expect(u[0].html).toContain('<p>2</p>');
    expect(u[0].html).toContain('citat');
    expect(u.map((x) => x.html).join('')).toBe('<p>1</p>\n<p>2</p>\n<figure class="citat"><p>c</p></figure>\n<div class="blok">b</div>\n<p>3</p>\n');
  });

  it('kapitola, která začíná aktivitou, nemá první textový úsek', () => {
    expect(useky('<div class="blok">b</div><p>a</p>').map((x) => x.druh)).toEqual(['aktivita', 'text']);
    expect(useky('')).toEqual([]);
  });
});

describe('uchycení citátů (bod 7)', () => {
  it('v pořadí na stránce sponka, špendlík, roh, rukou na okraji a znovu', () => {
    const k = { delka: 60, velky: false };
    expect(uchyceniCitatu([k, k, k, k, k, k])).toEqual(['sponka', 'spendlik', 'roh', 'okraj', 'sponka', 'spendlik']);
  });

  it('rukou jen krátký citát a nikdy velký citát pod úvodem; dva stejné se nesejdou', () => {
    const k = { delka: 60, velky: false };
    const dlouhy = { delka: OKRAJ_NEJVYS_ZNAKU + 1, velky: false };
    const r = uchyceniCitatu([k, k, k, dlouhy, k]);
    expect(r[3]).toBe('sponka');
    expect(uchyceniCitatu([k, k, k, { delka: 20, velky: true }])[3]).toBe('sponka');
    for (let i = 1; i < r.length; i++) expect(r[i]).not.toBe(r[i - 1]);
  });

  it('páska patří listům: citát ji jako uchycení nikdy nedostane', () => {
    const r = uchyceniCitatu(Array.from({ length: 12 }, (_, i) => ({ delka: i * 20, velky: i === 0 })));
    expect(r).not.toContain('paska');
  });

  it('doplní třídu do HTML podle pořadí, kompaktní citát vynechá a výsledek je pokaždé stejný', () => {
    const html = '<figure class="citat citat--velky" data-delka="50" data-astro-cid-x>A</figure>'
      + '<figure class="citat citat--kompaktni" data-astro-cid-x>B</figure>'
      + '<figure class="citat" data-delka="300" data-astro-cid-x>C</figure>';
    const v = uchytCitaty(html);
    expect(v).toContain('class="citat citat--velky citat--sponka"');
    expect(v).toContain('class="citat citat--kompaktni"');
    expect(v).toContain('class="citat citat--spendlik"');
    expect(uchytCitaty(html)).toBe(v);
  });
});

describe('obsah kroku cesty na listech (K4a)', () => {
  it('text v čtenářském sloupci leží na listech, blok mezi nimi zůstane na tečkách, páska jen na prvním listu', () => {
    const html = '<div class="ctenarsky"><p>A</p><h2>Mezititulek</h2><p>B</p><astro-island uid="1"><section class="blok">x</section></astro-island><p>C</p></div>'
      + '<astro-island uid="2"><section class="blok">y</section></astro-island>';
    const ven = listyKroku(html);
    expect(ven).toBe('<div class="ctenarsky"><div class="cisty-list"><span class="paska paska--mala" aria-hidden="true"></span><p>A</p><h2>Mezititulek</h2><p>B</p></div>'
      + '<astro-island uid="1"><section class="blok">x</section></astro-island><div class="cisty-list"><p>C</p></div></div>'
      + '<astro-island uid="2"><section class="blok">y</section></astro-island>');
  });
  it('krok jen s blokem nemá list; text mimo čtenářský sloupec dostane sloupec i list', () => {
    const blok = '<astro-island uid="1"><section class="blok">x</section></astro-island>';
    expect(listyKroku(blok)).toBe(blok);
    expect(listyKroku('<p>A</p>\n' + blok)).toBe('<div class="ctenarsky"><div class="cisty-list"><span class="paska paska--mala" aria-hidden="true"></span><p>A</p>\n</div></div>' + blok);
  });
});
