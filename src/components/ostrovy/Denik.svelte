<script lang="ts">
  // Můj deník jako opravdový zápisník (design-v2, K6; plán větve › Mapa a deník: funkce). Nahoře nejvýš jedna tichá
  // nabídka Návratu (nový případ ke zkoušce vlastního pravidla, nejdřív tři dny po dokončení cesty), připomenutí zálohy
  // po dokončené cestě a Moje filozofie po velkých otázkách. Pod ní kapitoly po obdobích (K6 dodatek, logika
  // kapitolyDeniku v src/lib/zapisnik.ts): rozpracované cesty a otázky, záznamy jako lístky podle cest (nebo podle data)
  // a sbírka období (razítka, pahýly, vystřižené citáty). Pak výzvy, hodiny, pero a záloha s přenosem jednou pro celý
  // deník. Vše jen v tomto prohlížeči; nic se nehodnotí.
  import { onMount, tick } from 'svelte';
  import { nacti, exportuj, stavBloku, ulozStavBloku, type Denik } from '../../lib/denik';
  import { nabidkaNavratu, platnyStavNavratu, type NavratDeniku } from '../../lib/navrat';
  import { prehledObdobi, type KatalogObdobi, type OtazkaPrehledu } from '../../lib/tvoje-obdobi';
  import {
    potkaniFilozofove, pripomenutiZalohy, kapitolyDeniku, otevreneKapitoly, rozeberStavKapitol, KLIC_KAPITOL,
    type MapaPotkanych, type MapaStranek, type ObdobiZapisniku, type SkupinaZaznamu,
  } from '../../lib/zapisnik';
  import type { UdajeRazitka } from './bloky-typy';
  import Navrat from './Navrat.svelte';
  import VolbaPera from './VolbaPera.svelte';
  import MojeHodiny from '../hodina/MojeHodiny.svelte';
  import MojeFilozofie from '../denik/MojeFilozofie.svelte';
  import SbirkaDeniku from '../denik/SbirkaDeniku.svelte';
  import PrenosDeniku from '../denik/PrenosDeniku.svelte';
  import { cisteDny, hotoveDnyText, idVyzvyTydne } from '../../lib/tydny';

  interface Props {
    /** návraty všech cest (obsah z YAML); který a kdy nabídnout, rozhodne nabidkaNavratu */
    navraty?: NavratDeniku[];
    /** týdny cvičení (Stoický týden): přijatý se ukáže mezi výzvami s počtem hotových dnů, nepřijatý jako tichý odkaz */
    tydny?: { id: string; nazev: string; odkaz: string; vstup: string; pocet: number }[];
    /** deník na konci období (Tvoje antika): tichý odkaz, jakmile v deníku něco je */
    konecObdobi?: { adresa: string; nazev: string; odkaz: string; obdobi?: number[] };
    /** katalog otázek, cest a zastánců (Moje filozofie, volby v záznamech) */
    katalog?: KatalogObdobi;
    razitka?: Record<string, UdajeRazitka>;
    osoby?: Record<string, { obdobi: number; adresa?: string }>;
    potkani?: MapaPotkanych;
    obdobiCest?: Record<string, number>;
    prvniCesta?: { nazev: string; adresa: string };
    /** stránky atlasu s obdobím (kapitoly) a období se stránkou */
    stranky?: MapaStranek;
    obdobi?: ObdobiZapisniku[];
  }
  let { navraty = [], tydny = [], konecObdobi, katalog, razitka = {}, osoby = {}, potkani = { stranky: {}, cesty: {} }, obdobiCest = {}, prvniCesta, stranky = {}, obdobi = [] }: Props = $props();

  let denik = $state<Denik | null>(null);
  // Nabídka se určí jednou při otevření deníku: po odložení nebo skrytí se hned nenabídne další.
  let nabidka = $state<NavratDeniku | null>(null);
  // Moje filozofie se složí jednou při otevření (jako Tvoje antika), ať se pod rukama nemění.
  let prehled = $state<OtazkaPrehledu[]>([]);
  let otevreny = $state(false);
  let zprava = $state('');
  // Jak řadit záznamy v kapitolách: platí pro všechny kapitoly a deník si to pamatuje (KLIC_KAPITOL).
  let pohled = $state<'data' | 'cesty'>('cesty');
  // Otevřené kapitoly; určí se jednou při otevření deníku (otevreneKapitoly), pak je mění jen student.
  let otevrene = $state<Record<string, boolean>>({});
  let obalNavratu = $state<HTMLElement>();
  let zpravaPrvek = $state<HTMLElement>();
  let cesty = $derived(denik ? Object.entries(denik.cesty).sort((a, b) => b[1].kdy.localeCompare(a[1].kdy)) : []);
  let rozpracovane = $derived(denik ? denik.aktivita.filter((a) => !a.hotovo) : []);
  let hodiny = $derived(denik?.hodiny ?? []);
  let nabidkaTydnu = $derived(denik ? tydny.filter((t) => !denik!.vyzvy.some((v) => v.id === idVyzvyTydne(t.id))) : []);
  let kapitoly = $derived(denik ? kapitolyDeniku(denik, { obdobi, stranky, katalog, potkani: potkaniFilozofove(denik, potkani), osoby }) : []);
  // Tvoje antika stojí na konci poslední kapitoly svých období; bez takové kapitoly pod kapitolami.
  let klicKonce = $derived([...kapitoly].reverse().find((k) => k.obdobi !== null && konecObdobi?.obdobi?.includes(k.obdobi))?.klic);
  const DRUH_SKUPINY: Record<SkupinaZaznamu['druh'], string> = { cesta: 'cesta', otazka: 'otázka', stranka: 'stránka' };
  let zaloha = $derived(denik ? pripomenutiZalohy(denik) : null);
  let prazdny = $derived(!!denik && denik.zapisy.length === 0 && denik.vyzvy.length === 0 && cesty.length === 0 && rozpracovane.length === 0 && hodiny.length === 0 && !denik.citaty?.length);
  const tydenVyzvy = (id: string) => tydny.find((t) => idVyzvyTydne(t.id) === id);
  const datum = (iso: string) => new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const trida = (slug: string) => (obdobiCest[slug] ? `obdobi-${obdobiCest[slug]}` : 'bez-obdobi');

  onMount(() => {
    denik = nacti();
    nabidka = nabidkaNavratu(denik, navraty, Date.now());
    if (katalog) prehled = prehledObdobi(denik, katalog);
    const stav = nactiStav();
    if (stav?.pohled) pohled = stav.pohled;
    otevrene = Object.fromEntries(otevreneKapitoly(kapitoly, stav).map((k) => [k, true]));
    const obnov = () => (denik = nacti());
    window.addEventListener('atlas-denik', obnov);
    return () => window.removeEventListener('atlas-denik', obnov);
  });

  function nactiStav() {
    try {
      return rozeberStavKapitol(JSON.parse(localStorage.getItem(KLIC_KAPITOL) ?? 'null'));
    } catch {
      return null;
    }
  }
  function ulozStav() {
    try {
      localStorage.setItem(KLIC_KAPITOL, JSON.stringify({ otevrene: Object.keys(otevrene).filter((k) => otevrene[k]), kdy: new Date().toISOString(), pohled }));
    } catch {
      /* bez úložiště si deník stav pamatuje jen do zavření stránky */
    }
  }
  /** Student kapitolu otevřel nebo zavřel (toggle přijde i při prvním vykreslení: tehdy se nic neukládá). */
  function prepni(klic: string, otevrena: boolean) {
    if ((otevrene[klic] ?? false) === otevrena) return;
    otevrene[klic] = otevrena;
    ulozStav();
  }
  function zmenPohled(p: 'cesty' | 'data') {
    pohled = p;
    ulozStav();
  }

  async function zkusit() {
    otevreny = true;
    await tick();
    obalNavratu?.focus();
  }
  /** Odloží (vrátí se za pár dní), nebo skryje (už se nenabídne); odpověď rozepsanou v bloku nechá být. */
  async function odloz(natrvalo: boolean) {
    if (!nabidka) return;
    const stav = platnyStavNavratu(stavBloku(nabidka.id));
    ulozStavBloku(nabidka.id, natrvalo ? { ...stav, skryto: true } : { ...stav, odlozeno: new Date().toISOString() });
    zprava = natrvalo ? 'Tenhle návrat se už nenabídne.' : 'Návrat se nabídne znovu za pár dní.';
    nabidka = null;
    await tick();
    zpravaPrvek?.focus();
  }
</script>

<PrenosDeniku cast="prichozi" />
{#if denik}
  {#if prazdny}
    <p class="t-perex prazdny">Zatím je prázdný. Když v cestě, u osobnosti nebo u otázky napíšeš vlastní odpověď nebo přijmeš výzvu, najdeš ji tady.</p>
    {#if prvniCesta}<p class="t-ovladani"><a class="prvni" href={prvniCesta.adresa}>Začít cestou {prvniCesta.nazev}</a></p>{/if}
    {@render nabidka_tydnu()}
  {:else}
    {#if nabidka}
      <section class="navrat" aria-labelledby="navrat-nadpis">
        <h2 class="t-h3 nadpis" id="navrat-nadpis">Návrat</h2>
        {#if otevreny}
          <div class="navrat__blok" tabindex="-1" bind:this={obalNavratu}><Navrat navrat={nabidka} /></div>
        {:else}
          <div class="nabidka listek-paska obdobi-{nabidka.blok.obdobi}">
            <span class="paska paska--mala paska--nahore" aria-hidden="true"></span>
            <p class="nabidka__kde">návrat ke cestě <span class="nabidka__cesta">{nabidka.nazevCesty}</span></p>
            <p class="nabidka__text">Tuhle cestu máš za sebou. Zkusíš své pravidlo na jednom novém případu?</p>
            <div class="blok__akce">
              <button class="blok__tl blok__tl--hlavni" type="button" onclick={zkusit}>Zkusit</button>
              <button class="blok__tl blok__tl--tiche" type="button" onclick={() => odloz(false)}>Později</button>
              <button class="blok__tl blok__tl--tiche" type="button" onclick={() => odloz(true)}>Už nenabízet</button>
            </div>
          </div>
        {/if}
      </section>
    {:else if zprava}
      <p class="navrat-zprava t-ovladani" role="status" tabindex="-1" bind:this={zpravaPrvek}>{zprava}</p>
    {/if}

    {#if zaloha}
      <div class="zaloha">
        <p class="zaloha__text">Máš za sebou cestu „{zaloha.nazev}“. Ulož si deník, ať o něj nepřijdeš, kdyby se prohlížeč vymazal.</p>
        <div class="blok__akce">
          <button class="blok__tl blok__tl--vedlejsi" type="button" onclick={exportuj}>Uložit do souboru</button>
          <a class="blok__tl blok__tl--tiche" href="#prenos-n">Jinak</a>
        </div>
      </div>
    {/if}

    {#if katalog}<MojeFilozofie {prehled} {razitka} upravit={konecObdobi?.adresa} {prvniCesta} />{/if}

    <!-- Kapitoly (K6 dodatek): jedno další členění, kapitola na období. Rozbalovací lístek; otevřená je kapitola, kde
         student naposledy byl, a ty, které si nechal otevřené. -->
    {#if kapitoly.length}
      <section class="kapitoly" aria-labelledby="kapitoly-n">
        <h2 class="t-h2 kapitoly__nadpis" id="kapitoly-n">Kapitoly</h2>
        {#each kapitoly as k (k.klic)}
          <details class={['kapitola', k.obdobi ? `obdobi-${k.obdobi}` : 'bez-obdobi']} open={otevrene[k.klic] ?? false} ontoggle={(e) => prepni(k.klic, e.currentTarget.open)}>
            <summary class="kapitola__listek">
              <span class="kapitola__hl">
                <span class="kapitola__nad">{k.obdobi ? `období ${k.obdobi}` : 'velké otázky'}</span>
                <h3 class="kapitola__nazev">{k.nazev}</h3>
                {#if k.leta || k.naposledy}
                  <span class="t-popisek kapitola__pod">{#if k.leta}<span class="t-letopocet">{k.leta}</span>{/if}{#if k.leta && k.naposledy}{' · '}{/if}{#if k.naposledy}naposledy {datum(k.naposledy)}{/if}</span>
                {/if}
              </span>
              <span class="kapitola__znak" aria-hidden="true"></span>
            </summary>
            <div class="kapitola__obsah">
              {#if k.cesty.length || k.otazky.length}
                <h4 class="t-h3 kapitola__cast">Rozpracované</h4>
                <div class="seznam--rozpracovane">
                  {#if k.cesty.length}
                    <ul class="rozpr">
                      {#each k.cesty as slug (slug)}
                        {@const c = denik.cesty[slug]}
                        {@const hotova = c.navstivene.length >= c.pocet}
                        <li class={trida(slug)}>
                          <a class="rozpr__listek" href={hotova ? `/cesta/${slug}/` : `/cesta/${slug}/${c.krok}/`}>
                            <span class="rozpr__hl">
                              <span class="t-popisek rozpr__co">cesta · {hotova ? 'prošel jsi celou' : `krok ${c.krok} z ${c.pocet}`}</span>
                              <span class="rozpr__nazev">{c.nazev}</span>
                              <span class="rozpr__mista" aria-hidden="true">{#each Array.from({ length: c.pocet }, (_, i) => i + 1) as n (n)}<i class:hotovo={c.navstivene.includes(n)}></i>{/each}</span>
                            </span>
                            <span class="rozpr__pahyl" aria-hidden="true"><span class="rozpr__trh"></span><b>{c.navstivene.length}</b>ze {c.pocet}</span>
                          </a>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                  {#if k.otazky.length}
                    <!-- Otázky jako záložky zastrčené v listu zápisníku: všechny stejně vysoké, spodkem pod okrajem listu. -->
                    <ul class="rozpr-zalozky">
                      {#each k.otazky as a (a.id)}
                        <li>
                          <a class="rozpr__zalozka" href={a.odkaz}><span class="rozpr__zal-c">otázka, ke které ses ještě nevrátil</span><span class="rozpr__zal-t">{a.otazka}</span></a>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                </div>
              {/if}

              {#if k.skupiny.length}
                <div class="zaznamy">
                  <div class="zaznamy__hlava">
                    <h4 class="t-h3 zaznamy__nadpis" id={`zaznamy-${k.klic}`}>Moje odpovědi a stanoviska</h4>
                    <div class="pohled" role="group" aria-label="Jak záznamy seřadit">
                      <button type="button" class="pohled__tl" aria-pressed={pohled === 'cesty'} onclick={() => zmenPohled('cesty')}>{k.obdobi ? 'Podle cest' : 'Podle otázek'}</button>
                      <button type="button" class="pohled__tl" aria-pressed={pohled === 'data'} onclick={() => zmenPohled('data')}>Podle data</button>
                    </div>
                  </div>
                  {#if pohled === 'cesty'}
                    {#each k.skupiny as s, i (s.adresa)}
                      <section class="skupina" aria-labelledby={`sk-${k.klic}-${i}`}>
                        <!-- Nadpis cesty je řádek, ne další rozbalování. -->
                        <h5 class="skupina__radek" id={`sk-${k.klic}-${i}`}><span class="skupina__co">{DRUH_SKUPINY[s.druh]}</span>{' '}<a href={s.adresa}>{s.nazev}</a></h5>
                        <ul class="listky">
                          {#each s.zaznamy as z (z.id)}
                            <li class="listek-zaznamu">
                              {#if s.druh === 'cesta'}
                                <p class="t-popisek zaznam__kde"><a href={z.adresa}>krok {z.krok}</a>{#if z.otazka} · {z.otazka}{/if}</p>
                              {:else}
                                <p class="t-popisek zaznam__kde">{#if z.kdy}{datum(z.kdy)} · {/if}<a href={z.adresa}>zpět ke stránce</a></p>
                                {#if z.otazka}<p class="otazka">{z.otazka}</p>{/if}
                              {/if}
                              {#if z.volba}<p class="zaznam__volba"><span class="vizualne-skryte">{'Tvoje volba: '}</span>{z.volba}</p>{/if}
                              {#if z.odpoved}<p class="odpoved">{z.odpoved}</p>{/if}
                            </li>
                          {/each}
                        </ul>
                      </section>
                    {/each}
                  {:else if k.podleData.length}
                    <ul class="seznam--zapisy listky">
                      {#each k.podleData as z (z.id)}
                        <li class="listek-zaznamu">
                          <p class="t-popisek zaznam__kde">{datum(z.kdy)} · <a href={z.odkaz}>zpět ke stránce</a></p>
                          <p class="otazka">{z.otazka}</p>
                          <p class="odpoved">{z.odpoved}</p>
                        </li>
                      {/each}
                    </ul>
                  {:else}
                    <p class="t-popisek">Podle data se tu seřadí, co v tomhle období napíšeš.</p>
                  {/if}
                </div>
              {/if}

              <SbirkaDeniku uroven={4} klic={k.klic} potkani={k.potkani} {razitka} {osoby} pahyly={k.pahyly} citaty={k.citaty} {obdobiCest} />

              {#if konecObdobi && k.klic === klicKonce}{@render konec_obdobi()}{/if}
            </div>
          </details>
        {/each}
      </section>
    {/if}
    {#if konecObdobi && !klicKonce}{@render konec_obdobi()}{/if}

    {#if hodiny.length}
      <h2 class="t-h3 nadpis" id="denik-hodiny">Hodiny</h2>
      <ul class="seznam seznam--hodiny" aria-labelledby="denik-hodiny">
        {#each hodiny as h (h.adresa)}
          <li>
            <p class="t-popisek">otevřeno {datum(h.kdy)}</p>
            <p class="otazka"><a href={h.adresa}>{h.nazev || 'Hodina bez názvu'}</a></p>
          </li>
        {/each}
      </ul>
    {/if}
    {#if denik.vyzvy.length}
      <h2 class="t-h3 nadpis">Přijaté výzvy</h2>
      <ul class="vyzvy">
        {#each denik.vyzvy as v (v.id)}
          {@const t = tydenVyzvy(v.id)}
          <li class="vyzva">
            <span class="paska paska--mala paska--nahore" aria-hidden="true"></span>
            <p class="t-popisek">přijato {datum(v.prijato)}</p>
            <p class="otazka"><a href={v.odkaz}>{v.nazev}</a></p>
            {#if t}
              <p class="t-popisek tyden-pocet">{hotoveDnyText(cisteDny(denik.tydny?.[t.id]?.hotove, t.pocet).length, t.pocet)}</p>
              {#if denik.tydny?.[t.id]?.veta}<p class="odpoved">{denik.tydny[t.id].veta}</p>{/if}
            {/if}
            {#if v.poznamka}<p class="odpoved">{v.poznamka}</p>{/if}
          </li>
        {/each}
      </ul>
    {/if}
    {@render nabidka_tydnu()}
  {/if}
  <MojeHodiny />
  <!-- Studentova ruka (K4a, bod 3): pero, kterým píše a volí v celém atlasu. -->
  <VolbaPera />
  <PrenosDeniku cast="zaloha" />
{/if}

{#snippet konec_obdobi()}
  <a class="konec obdobi-2" href={konecObdobi!.adresa}>
    <span class="konec__nad">na konci období</span>
    <span class="konec__nazev">{konecObdobi!.nazev}</span>
    <span class="t-popisek konec__popis">{konecObdobi!.odkaz}</span>
  </a>
{/snippet}

{#snippet nabidka_tydnu()}
  {#if nabidkaTydnu.length}
    <h2 class="t-h3 nadpis" id="denik-tydny">Zkus to žít</h2>
    <ul class="seznam seznam--tydny" aria-labelledby="denik-tydny">
      {#each nabidkaTydnu as t (t.id)}
        <li>
          <p class="otazka"><a href={t.odkaz}>{t.nazev}</a></p>
          <p class="t-popisek">{t.vstup}. Začni, až budeš chtít.</p>
        </li>
      {/each}
    </ul>
  {/if}
{/snippet}

<style>
  .prazdny { margin-top: var(--s-5); }
  .prvni { display: inline-flex; align-items: center; min-height: var(--dotyk); }
  .nadpis { margin: var(--s-7) 0 var(--s-4); }
  .navrat .nadpis { margin-top: var(--s-5); }
  .nabidka__kde { margin: 0 0 var(--s-1); font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .nabidka__cesta { font-weight: 600; color: var(--ink); }
  .nabidka__text { margin: 0; font-size: 19px; line-height: 1.5; }
  .nabidka .blok__akce { margin-top: var(--s-4); }
  .navrat__blok { outline: none; }
  .navrat__blok :global(.blok) { margin: 0; }
  .navrat-zprava { margin: var(--s-5) 0 0; color: var(--ink-2); outline: none; }
  .navrat-zprava:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
  /* Připomenutí zálohy: tichá poznámka tužkou na okraji listu, ne poplach. */
  .zaloha { margin-top: var(--s-5); padding: var(--s-3) 0 var(--s-3) var(--s-4); border-left: 2px solid var(--tuzka); }
  .zaloha__text { margin: 0; font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .zaloha .blok__akce { margin-top: var(--s-2); }
  /* Rozpracované: lístky cest s pahýlem a záložky otázek, ke kterým se student nevrátil. */
  .rozpr { display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }
  .rozpr li:has(.rozpr__listek) { flex: 0 1 420px; min-width: 0; }
  /* Týž lístek cesty jako v profilu, na otázce a na Domů (CestaKarta.astro): po najetí se pahýl u perforace odtrhne. */
  .rozpr__listek { display: flex; color: var(--ink); text-decoration: none; }
  .rozpr__hl, .rozpr__pahyl { background: var(--plocha); box-shadow: var(--vyst); transition: transform var(--d-stisk) var(--k-stisk), rotate var(--d-stisk) var(--k-stisk); }
  .rozpr__hl { position: relative; border-radius: var(--r-ovladani) 0 0 var(--r-ovladani); }
  .rozpr__hl::after, .rozpr__trh { content: ""; position: absolute; top: 0; bottom: 0; width: 8px; background: var(--plocha); opacity: 0; pointer-events: none; transition: opacity var(--d-stisk) var(--k-stisk); }
  .rozpr__hl::after { right: -7px; clip-path: polygon(0 0, 60% 0, 100% 6%, 30% 13%, 85% 20%, 20% 28%, 75% 35%, 35% 43%, 95% 50%, 25% 58%, 80% 66%, 30% 73%, 90% 80%, 20% 88%, 70% 94%, 40% 100%, 0 100%); }
  .rozpr__trh { left: -7px; z-index: 1; clip-path: polygon(100% 0, 40% 0, 0 6%, 70% 13%, 15% 20%, 80% 28%, 25% 35%, 65% 43%, 5% 50%, 75% 58%, 20% 66%, 70% 73%, 10% 80%, 80% 88%, 30% 94%, 60% 100%, 100% 100%); }
  @media (hover: hover) {
    .rozpr__listek:hover .rozpr__hl { transform: translateY(-2px); }
    .rozpr__listek:hover .rozpr__pahyl { transform: translate(14px, 4px); rotate: calc(2deg * var(--natoceni)); border-left-color: transparent; }
    .rozpr__listek:hover .rozpr__hl::after,
    .rozpr__listek:hover .rozpr__trh { opacity: 1; }
  }
  .rozpr__listek:active .rozpr__hl { transform: translateY(1px); }
  .rozpr__listek:focus-visible, .rozpr__zalozka:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .rozpr__hl { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; padding: 14px 18px 16px; }
  .rozpr__co { color: var(--ink-2); }
  .rozpr__nazev { font-size: 21px; line-height: 1.2; }
  .rozpr__listek:hover .rozpr__nazev { text-decoration: underline; text-decoration-color: var(--tuzka); text-underline-offset: 4px; }
  .rozpr__mista { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
  .rozpr__mista i { width: 16px; height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--tuzka) 35%, transparent); }
  .rozpr__mista i.hotovo { background: var(--p); }
  .rozpr__pahyl {
    position: relative;
    flex: none;
    border-radius: 0 var(--r-ovladani) var(--r-ovladani) 0;
    transform-origin: 0 0;
    width: 84px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-left: 2px dashed var(--linka);
    font: 13px/1.3 var(--font-sans);
    color: var(--ink-2);
  }
  .rozpr__pahyl b { font: 500 22px/1 var(--font-serif); color: var(--p); }
  .rozpr__pahyl::before, .rozpr__pahyl::after { content: ""; position: absolute; left: -11px; width: 20px; height: 20px; border-radius: 50%; background: var(--papir); }
  .rozpr__pahyl::before { top: -10px; }
  .rozpr__pahyl::after { bottom: -10px; }
  /* Záložky v mřížce, všechny stejně vysoké a text uprostřed. Spodní hrana je ohyb záložky: tmavší pruh téže barvy
     a stín pod ním, takže záložka končí jako zastrčená, ne useknutá. Po najetí se povytáhne. */
  .rozpr-zalozky {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-auto-rows: 82px;
    gap: var(--s-3) 8px;
    margin: var(--s-5) 0 0;
    padding: 0;
    list-style: none;
  }
  .rozpr-zalozky li { display: flex; min-width: 0; }
  .rozpr__zalozka {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    min-width: 0;
    padding: 6px 16px 6px;
    border-bottom: 7px solid color-mix(in srgb, var(--pp-1) 72%, #000);
    border-radius: var(--r-ovladani) var(--r-ovladani) 3px 3px;
    background: linear-gradient(170deg, rgb(255 255 255 / .04), rgb(0 0 0 / .08)), var(--pp-1);
    color: var(--na-papiru);
    text-decoration: none;
    box-shadow: inset 1.5px 1.5px 0 rgb(255 255 255 / .16), var(--lezi);
    transition: transform var(--d-stisk) var(--k-stisk);
  }
  .rozpr__zalozka:hover { transform: translateY(-4px); }
  .rozpr__zal-c { font-family: var(--font-ruka); font-size: 15px; line-height: 1.1; }
  .rozpr__zal-t { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden; font: 500 15px/1.3 var(--font-sans); }
  /* Záznamy jako lístky: kde (cesta, krok, datum) tiskem, co student napsal jeho perem. */
  .zaznamy { margin-top: var(--s-8); }
  .zaznamy__hlava { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--s-3) var(--s-5); margin-bottom: var(--s-4); }
  .zaznamy__nadpis { margin: 0; }
  .pohled { display: inline-flex; gap: 4px; padding: 3px; border-radius: var(--r-plne); background: var(--papir); box-shadow: var(--vtla-mele); }
  .pohled__tl {
    min-height: var(--dotyk);
    padding: 0 16px;
    border: 0;
    border-radius: var(--r-plne);
    background: none;
    color: var(--ink-2);
    font: 500 var(--fs-ovladani) / 1.2 var(--font-sans);
    cursor: pointer;
  }
  .pohled__tl[aria-pressed='true'] { background: var(--plocha); box-shadow: var(--vyst-m); color: var(--ink); font-weight: 600; }
  .pohled__tl:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .listky { display: grid; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }
  .listek-zaznamu { padding: 18px 20px 14px; background: var(--list); box-shadow: var(--lezi); }
  .listek-zaznamu:nth-child(3n + 2) { rotate: calc(.3deg * var(--natoceni)); }
  .listek-zaznamu:nth-child(3n) { rotate: calc(-.25deg * var(--natoceni)); }
  .listek-zaznamu p { margin: 0 0 var(--s-1); }
  .zaznam__kde { color: var(--ink-2); }
  .zaznam__kde a { color: inherit; }
  .zaznam__volba { font-family: var(--font-ruka); font-size: var(--fs-ruka); color: var(--pero); }
  .otazka { font-family: var(--font-sans); font-weight: 600; font-size: var(--fs-ovladani); }
  .otazka a { display: inline-block; min-height: 24px; }
  /* Co student napsal, jeho perem (bod 3). */
  .odpoved { font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--pero); white-space: pre-line; overflow-wrap: anywhere; }
  /* Kapitoly (K6 dodatek): lístek s ohybem dole v inkoustu období jako záložky rozpracovaných otázek; páska na
     obrazovce deníku patří jen Návratu (revize R, otázka 1). Rozbalený pokračuje listem zápisníku s čárkovaným okrajem
     v inkoustu období. Znak rozbalení je vystouplý knoflík se šipkou, po otevření otočenou. */
  .kapitoly { margin-top: var(--s-8); }
  .kapitoly__nadpis { margin: 0 0 var(--s-2); }
  .kapitola { margin-top: var(--s-6); }
  .kapitola__listek {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--s-4);
    min-height: var(--dotyk);
    padding: 16px 18px 12px 22px;
    border-bottom: 6px solid color-mix(in srgb, var(--p) 34%, var(--listek));
    border-radius: 2px 2px 3px 3px;
    background: var(--listek);
    box-shadow: var(--lezi);
    color: var(--ink);
    list-style: none;
    cursor: pointer;
    rotate: calc(-.4deg * var(--natoceni));
    transition: translate var(--d-stisk) var(--k-stisk), rotate var(--d-stisk) var(--k-stisk);
  }
  .kapitola:nth-of-type(2n) .kapitola__listek { rotate: calc(.3deg * var(--natoceni)); }
  .kapitola__listek::-webkit-details-marker { display: none; }
  .kapitola__listek::marker { content: ''; }
  .kapitola[open] .kapitola__listek { rotate: 0deg; }
  @media (hover: hover) { .kapitola__listek:hover { translate: 0 -2px; } }
  .kapitola__listek:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
  .kapitola__hl { flex: 1 1 auto; min-width: 0; display: grid; gap: 2px; }
  .kapitola__nad { font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: 1.1; color: var(--p); }
  .kapitola__nazev { margin: 0; font-family: var(--font-serif); font-weight: 500; font-size: 26px; line-height: 1.15; }
  .kapitola__pod { color: var(--ink-2); }
  .kapitola__znak { flex: none; position: relative; width: 40px; height: 40px; border-radius: 50%; background: var(--plocha); box-shadow: var(--vyst-m); }
  .kapitola__znak::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 9px;
    height: 9px;
    border-right: 2px solid var(--ink-2);
    border-bottom: 2px solid var(--ink-2);
    translate: -50% -70%;
    rotate: 45deg;
    transition: rotate var(--d-stisk) var(--k-stisk), translate var(--d-stisk) var(--k-stisk);
  }
  .kapitola[open] .kapitola__znak::before { translate: -50% -30%; rotate: 225deg; }
  .kapitola__obsah { margin: 0 0 0 var(--s-3); padding: var(--s-2) 0 var(--s-4) var(--s-5); border-left: 2px dashed color-mix(in srgb, var(--p) 40%, transparent); }
  .kapitola__cast { margin: var(--s-6) 0 var(--s-4); }
  .kapitola .zaznamy { margin-top: var(--s-6); }
  /* Nadpis cesty nebo stránky v kapitole je řádek zápisníku, ne další rozbalování. */
  .skupina { margin-top: var(--s-5); }
  .skupina__radek { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px var(--s-3); margin: 0 0 var(--s-3); padding-bottom: var(--s-1); border-bottom: 1px dashed var(--tuzka); font: 500 19px/1.3 var(--font-serif); }
  .skupina__co { font: 400 var(--fs-popisek) / 1.3 var(--font-sans); color: var(--ink-2); }
  .skupina__radek a { color: inherit; text-decoration-color: var(--p); text-underline-offset: .18em; }
  .konec { display: grid; gap: 2px; width: fit-content; max-width: 100%; margin-top: var(--s-7); padding: 18px 22px 16px; background: var(--listek); box-shadow: var(--lezi); rotate: calc(-.5deg * var(--natoceni)); color: var(--ink); text-decoration: none; }
  .konec:hover .konec__nazev { text-decoration: underline; text-decoration-color: var(--tuzka); text-underline-offset: 4px; }
  .konec:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .konec__nad { font-family: var(--font-ruka); font-size: var(--fs-ruka); color: var(--p); }
  .konec__nazev { font-family: var(--font-serif); font-size: 24px; line-height: 1.2; }
  .konec__popis { color: var(--ink-2); }
  .seznam { margin: 0; padding: 0; list-style: none; }
  .seznam li { padding: var(--s-4) 0; border-top: 1px dashed var(--tuzka); }
  .seznam p { margin: 0 0 var(--s-1); }
  .vyzvy { display: grid; gap: var(--s-5); margin: 0; padding: 0; list-style: none; }
  .vyzva { position: relative; padding: 24px 22px 16px; background: var(--list); box-shadow: var(--lezi); }
  .vyzva p { margin: 0 0 var(--s-1); }
  @media (max-width: 699px) {
    .listek-zaznamu, .vyzva { rotate: 0deg; }
    .kapitola__obsah { margin-left: 2px; padding-left: var(--s-3); }
    .kapitola__nazev { font-size: 22px; }
  }
</style>
