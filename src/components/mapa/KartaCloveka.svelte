<script lang="ts">
  // Karta člověka: medailonek z dat, věk ve zvoleném roce, kde právě je, atribut s „proč“,
  // vztahy s poznámkou vůči zvolenému roku a Změř vzdálenost mezi dvěma lidmi.
  // Život na mapě (u lidí s aspoň dvěma místy): zastávky života, Předchozí a Další zastávka a Přehrát;
  // přehrávání samo běží v MapaACas.svelte, karta jen ukazuje, kde člověk právě je.
  import { onMount } from 'svelte';
  import type { OsobaV, MistoV, UdalostV, ObdobiV, VstupMapy } from '../../lib/mapa-vstup';
  import { kdeVRoce, odkudPrisla, vetaOVeku, poznamkaVRoce, vzdalenost, zijeVRoce } from '../../lib/cas-mapy';
  import { rok as rokText, rozpeti } from '../../lib/casy';
  import { sporNaDalku } from '../../lib/vztahy';
  import { type Zastavka, zastavkaVRoce, predchoziZastavka, dalsiZastavka, radekZastavky, oznameniZastavky, ZIVOT_NA_MAPE as T } from '../../lib/zivot-na-mape';
  import Mince from './Mince.svelte';

  interface Props {
    osoba?: OsobaV;
    rok: number;
    lide: OsobaV[];
    podleId: Map<string, OsobaV>;
    vztahy: VstupMapy['vztahy'];
    mista: Map<string, MistoV>;
    udalosti: UdalostV[];
    obdobi: ObdobiV[];
    zijici: OsobaV[];
    srovnat?: string;
    onvyber: (id: string) => void;
    onsrovnat: (id: string | undefined) => void;
    onzavrit: () => void;
    zastavky?: Zastavka[];
    prehrava?: boolean;
    /** bez omezeného pohybu; jinak tlačítko Přehrát chybí */
    mohuPrehrat?: boolean;
    onprehrat?: () => void;
    onzastavit?: () => void;
    onzastavka?: (rok: number) => void;
  }
  let {
    osoba, rok, lide, podleId, vztahy, mista, udalosti, obdobi, zijici, srovnat, onvyber, onsrovnat, onzavrit,
    zastavky = [], prehrava = false, mohuPrehrat = true, onprehrat, onzastavit, onzastavka,
  }: Props = $props();

  // ── Život na mapě ──────────────────────────────────────────────────────────
  let aktualni = $derived(zastavkaVRoce(zastavky, rok));
  let predchozi = $derived(predchoziZastavka(zastavky, rok));
  let dalsi = $derived(dalsiZastavka(zastavky, rok));
  // Oblast aria-live: mění se jen při příchodu na jinou zastávku, ne s každým rokem.
  let oznameni = $derived(osoba && aktualni >= 0 ? oznameniZastavky(zastavky[aktualni], mista.get(zastavky[aktualni].misto)?.nazev ?? '', osoba) : '');
  // Seznam zastávek je jedna zastávka tabulátoru; šipky mezi nimi přesouvají fokus (Enter nastaví rok).
  let fokusZastavky = $state(0);
  $effect(() => {
    fokusZastavky = Math.max(0, aktualni);
  });
  let seznamZastavek: HTMLOListElement | undefined = $state();
  function sipkyZastavek(e: KeyboardEvent) {
    const n = zastavky.length;
    const cil = { ArrowDown: fokusZastavky + 1, ArrowRight: fokusZastavky + 1, ArrowUp: fokusZastavky - 1, ArrowLeft: fokusZastavky - 1, Home: 0, End: n - 1 }[e.key];
    if (cil === undefined) return;
    e.preventDefault();
    fokusZastavky = Math.min(n - 1, Math.max(0, cil));
    seznamZastavek?.querySelectorAll<HTMLButtonElement>('button')[fokusZastavky]?.focus();
  }
  const naRok = (r: number | null) => {
    if (r !== null) onzastavka?.(r);
  };

  // Atribut se při prvním setkání s člověkem ukáže rozbalený.
  let videne = $state(new Set<string>());
  onMount(() => {
    try {
      videne = new Set(JSON.parse(localStorage.getItem('atlas-atributy-videne') ?? '[]'));
    } catch {}
  });
  let prvniSetkani = $state(false);
  $effect(() => {
    const id = osoba?.id;
    if (!id) return;
    prvniSetkani = !videne.has(id);
    if (prvniSetkani) {
      const nove = new Set(videne).add(id);
      try {
        localStorage.setItem('atlas-atributy-videne', JSON.stringify([...nove]));
      } catch {}
    }
  });

  let zije = $derived(osoba ? zijeVRoce(osoba, rok) : false);
  let poloha = $derived(osoba ? kdeVRoce(osoba, rok) : null);
  let misto = $derived(poloha ? mista.get(poloha.misto) : undefined);
  let odkud = $derived(osoba ? odkudPrisla(osoba, rok) : null);
  let udalostiRoku = $derived(osoba ? udalosti.filter((u) => u.osoby.includes(osoba!.id) && rok >= u.od && rok <= (u.do ?? u.od)) : []);
  let nazevObdobi = $derived(osoba ? obdobi.find((o) => o.id === osoba!.obdobi)?.nazev : '');

  const ROLE: Record<string, string> = {
    narozeni: 'rodiště', studium: 'studium', pusobeni: 'působení', pobyt: 'pobyt', exil: 'vyhnanství', tazeni: 'vojenské tažení', smrt: 'místo smrti',
  };
  const tvar = (o: OsobaV, muz: string, zena: string) => (o.zena ? zena : muz);

  type RadekVztahu = { druhy: OsobaV; typ: string; role: string; poznamka?: string; tradovany?: boolean };
  let vztahyOsoby = $derived.by((): RadekVztahu[] => {
    if (!osoba) return [];
    const id = osoba.id;
    const out: RadekVztahu[] = [];
    for (const v of vztahy) {
      if (v.od !== id && v.k !== id) continue;
      const druhy = podleId.get(v.od === id ? v.k : v.od);
      if (!druhy) continue;
      const jaOd = v.od === id;
      let role = '';
      if (v.typ === 'ucitel') role = jaOd ? tvar(druhy, 'žák', 'žákyně') : tvar(druhy, 'učitel', 'učitelka');
      else if (v.typ === 'znali-se') role = 'znali se';
      else if (v.typ === 'vliv-textem') role = jaOd ? `${tvar(druhy, 'četl', 'četla')} ${tvar(osoba, 'jeho', 'její')} spisy` : `${tvar(osoba, 'četl', 'četla')} ${tvar(druhy, 'jeho', 'její')} spisy`;
      else if (sporNaDalku(v, osoba, druhy)) {
        // Spor na dálku (Karneadés a Chrýsippos, Aristotelés a Sókratés): stejná slova jako v Době a lidech.
        const kritik = jaOd ? osoba : druhy;
        const cil = jaOd ? druhy : osoba;
        role = `${tvar(kritik, 'přel', 'přela')} se s ${tvar(cil, 'jeho', 'jejím')} učením`;
      } else role = jaOd ? `${tvar(osoba, 'polemizoval', 'polemizovala')} s ${tvar(druhy, 'ním', 'ní')}` : `${tvar(druhy, 'polemizoval', 'polemizovala')} s ${tvar(osoba, 'ním', 'ní')}`;
      out.push({ druhy, typ: v.typ, role, poznamka: v.poznamka, tradovany: v.tradovany });
    }
    const poradi = { ucitel: 0, 'znali-se': 1, 'vliv-textem': 2, polemika: 3 } as Record<string, number>;
    return out.sort((a, b) => poradi[a.typ] - poradi[b.typ] || (a.druhy.narozen?.rok ?? 0) - (b.druhy.narozen?.rok ?? 0));
  });

  let srovnavany = $derived(srovnat ? podleId.get(srovnat) : undefined);
  let vysledek = $derived(osoba && srovnavany ? vzdalenost(osoba, srovnavany) : null);
  let skupiny = $derived(obdobi.filter((ob) => lide.some((o) => o.obdobi === ob.id)).map((ob) => ({ ob, lide: lide.filter((o) => o.obdobi === ob.id && o.id !== osoba?.id).sort((a, b) => a.jmeno.localeCompare(b.jmeno, 'cs')) })));
  let rychle = $derived(zijici.filter((o) => o.hloubka !== 'medailonek').slice(0, 8));
</script>

{#if osoba}
  <article class="karta obdobi-{osoba.obdobi}" aria-labelledby="karta-jmeno">
    <header class="karta__hlava">
      <Mince ikona={osoba.atribut?.ikona} obdobi={osoba.obdobi} varianta="tint" velikost={48} />
      <div class="karta__titul">
        <h2 id="karta-jmeno" class="karta__jmeno">{osoba.jmeno}</h2>
        <p class="karta__zivot">{osoba.zivot} · {nazevObdobi}</p>
      </div>
      <button type="button" class="zavrit" onclick={onzavrit} aria-label="Zavřít kartu">
        <svg width="20" height="20" aria-hidden="true"><use href="/ikony/ui.svg#zavrit" /></svg>
      </button>
    </header>

    <p class="karta__kdo">{osoba.kdo}</p>
    <p class="karta__proc">{osoba.proc}</p>

    {#if osoba.atribut}
      {#key osoba.id}
        <details class="atribut" open={prvniSetkani}>
          <summary>Proč {osoba.atribut.nazev}?</summary>
          <p>{osoba.atribut.proc}</p>
        </details>
      {/key}
    {/if}

    <section class="box" aria-label="V roce {rokText(rok)}">
      {#if zije}
        <p class="box__vek">{vetaOVeku(osoba, rok) ?? `V roce ${rokText(rok)} právě působí.`}</p>
        {#if misto}
          <p class="box__misto"><strong>{misto.nazev}</strong> <span>· {ROLE[poloha!.role]}{misto.dnes ? ` · dnes ${misto.dnes}` : ''}</span></p>
        {/if}
        {#if odkud && mista.get(odkud)}
          <p class="box__cesta">Cesta: {mista.get(odkud)!.nazev} → {misto?.nazev}</p>
        {/if}
        {#each udalostiRoku as u (u.id)}
          <p class="box__udalost">{u.nazev}{u.do ? ` (${rozpeti(u.od, u.do)})` : ''}</p>
        {/each}
      {:else}
        <p class="box__vek">V roce {rokText(rok)}: {poznamkaVRoce(osoba, rok)}.</p>
      {/if}
    </section>

    {#if zastavky.length}
      <section class="zivot" aria-labelledby="zivot-nadpis">
        <h3 id="zivot-nadpis" class="nadtitulek">{T.nadpis}</h3>
        <div class="zivot__ovladani">
          <button
            type="button"
            id="zivot-predchozi"
            class="zivot__tl"
            aria-label={T.predchoziCelkem}
            aria-disabled={predchozi === null}
            onclick={() => naRok(predchozi)}
          >
            <svg width="18" height="18" aria-hidden="true"><use href="/ikony/ui.svg#zpet" /></svg>{T.predchozi}
          </button>
          {#if mohuPrehrat}
            <button
              type="button"
              id="zivot-prehrat"
              class="zivot__tl zivot__tl--hlavni"
              onclick={() => (prehrava ? onzastavit?.() : onprehrat?.())}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                {#if prehrava}<rect x="2" y="2" width="10" height="10" rx="1.5" />{:else}<path d="M3 1.5v11l9.5-5.5z" />{/if}
              </svg>{prehrava ? T.zastavit : T.prehrat}
            </button>
          {/if}
          <button
            type="button"
            id="zivot-dalsi"
            class="zivot__tl"
            aria-label={T.dalsiCelkem}
            aria-disabled={dalsi === null}
            onclick={() => naRok(dalsi)}
          >
            {T.dalsi}<svg class="zivot__vpravo" width="18" height="18" aria-hidden="true"><use href="/ikony/ui.svg#zpet" /></svg>
          </button>
        </div>
        <ol class="zastavky" aria-label={T.seznam} bind:this={seznamZastavek} onkeydown={sipkyZastavek}>
          {#each zastavky as z, i (i)}
            <li class="zastavka" class:zastavka--ted={i === aktualni} class:zastavka--byla={i < aktualni}>
              <button
                type="button"
                tabindex={i === fokusZastavky ? 0 : -1}
                aria-current={i === aktualni ? 'step' : undefined}
                onclick={() => {
                  fokusZastavky = i;
                  onzastavka?.(z.rok);
                }}
              >
                <span class="zastavka__bod" aria-hidden="true"></span>
                <span class="zastavka__misto">{mista.get(z.misto)?.nazev}</span>
                <span class="zastavka__radek">{radekZastavky(z, osoba)}</span>
              </button>
            </li>
          {/each}
        </ol>
        <p class="vizualne-skryte" aria-live="polite">{oznameni}</p>
      </section>
    {/if}

    {#if vztahyOsoby.length}
      <section class="vztahy" aria-labelledby="vztahy-nadpis">
        <h3 id="vztahy-nadpis" class="nadtitulek">Vztahy</h3>
        <ul>
          {#each vztahyOsoby as v (v.druhy.id + v.typ)}
            <li class="obdobi-{v.druhy.obdobi}">
              <svg class="cara" width="28" height="12" aria-hidden="true">
                {#if v.typ === 'polemika'}
                  <path d="M1 6 L5 2 L9 10 L13 2 L17 10 L21 2 L25 6" />
                {:else}
                  <path d="M1 6 H27" class="cara--{v.typ}" />
                {/if}
              </svg>
              <div class="vztah">
                <span class="vztah__role">{v.role}{v.tradovany ? ' · vypráví se' : ''}</span>
                <button type="button" class="vztah__jmeno" onclick={() => onvyber(v.druhy.id)}>{v.druhy.jmeno}</button>
                <span class="vztah__pozn">{poznamkaVRoce(v.druhy, rok)}{v.poznamka ? ` · ${v.poznamka}` : ''}</span>
              </div>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    <section class="zmer" aria-labelledby="zmer-nadpis">
      <h3 id="zmer-nadpis" class="nadtitulek">Změř vzdálenost</h3>
      <label class="zmer__pole">
        <span>{osoba.jmeno} a</span>
        <select value={srovnat ?? ''} onchange={(e) => onsrovnat((e.currentTarget as HTMLSelectElement).value || undefined)}>
          <option value="">vyber člověka…</option>
          {#each skupiny as s (s.ob.id)}
            <optgroup label="{s.ob.id} · {s.ob.nazev}">
              {#each s.lide as o (o.id)}<option value={o.id}>{o.jmeno}</option>{/each}
            </optgroup>
          {/each}
        </select>
      </label>
      {#if vysledek && srovnavany}
        <p class="zmer__vysledek" aria-live="polite">{vysledek.text}</p>
        <p class="zmer__data">{osoba.jmeno}: {osoba.zivot} · {srovnavany.jmeno}: {srovnavany.zivot}</p>
      {/if}
    </section>

    <div class="tlacitka">
      {#if osoba.stranka}
        <a class="tlacitko tlacitko--hlavni" href={osoba.stranka}>Otevřít stránku</a>
      {:else}
        <a class="tlacitko" href="/lide/#{osoba.id}">Najít v Lidech a směrech</a>
      {/if}
    </div>
  </article>
{:else}
  <div class="karta karta--prazdna">
    <h2 class="karta__jmeno">Kdo tu žije?</h2>
    <p>V roce {rokText(rok)} žije {zijici.length} {zijici.length === 1 ? 'člověk' : zijici.length < 5 ? 'lidé' : 'lidí'} z atlasu. Klepni na minci na mapě nebo na pruh v řece životů.</p>
    {#if rychle.length}
      <ul class="rychle">
        {#each rychle as o (o.id)}
          <li class="obdobi-{o.obdobi}">
            <button type="button" onclick={() => onvyber(o.id)}>
              <Mince ikona={o.atribut?.ikona} obdobi={o.obdobi} varianta="tint" velikost={32} />
              <span>{o.jmeno}</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}

<style>
  .karta { display: flex; flex-direction: column; gap: var(--s-3); padding: var(--s-4) var(--s-5) var(--s-5); font-family: var(--font-sans); font-size: 15px; line-height: 1.45; }
  .karta__hlava { display: flex; align-items: center; gap: var(--s-3); }
  .karta__titul { flex: 1; min-width: 0; }
  .karta__jmeno { font-family: var(--font-serif); font-size: 32px; line-height: 1.05; letter-spacing: -0.01em; }
  .karta__zivot { margin: 2px 0 0; font-size: 13px; color: var(--muted); font-variant-numeric: lining-nums; }
  .zavrit { display: grid; place-items: center; width: 40px; height: 40px; flex: none; border: 0; border-radius: 999px; background: none; color: var(--ink-2); cursor: pointer; }
  .zavrit:hover { background: var(--sunk); }
  .karta__kdo { margin: 0; font-family: var(--font-serif); font-size: 18px; line-height: 1.4; }
  .karta__proc { margin: 0; color: var(--ink-2); }
  .atribut { border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: var(--s-2) 0; }
  .atribut summary { font-weight: 600; cursor: pointer; color: var(--pc); }
  .atribut summary:hover { text-decoration: underline; }
  .atribut p { margin: var(--s-1) 0 0; }
  .box { padding: var(--s-3) var(--s-4); border-radius: var(--r-sm); background: var(--pc-tint); }
  .box p { margin: 0; }
  .box__vek { font-family: var(--font-serif); font-size: 19px; line-height: 1.3; }
  .box__misto { margin-top: 4px !important; }
  .box__misto span, .box__cesta { color: var(--ink-2); font-size: 14px; }
  .box__udalost { margin-top: 4px !important; font-size: 14px; font-weight: 600; }
  .nadtitulek { margin: 0 0 var(--s-1); font-family: var(--font-sans); font-size: 11.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .vztahy ul { margin: 0; padding: 0; list-style: none; }
  .vztahy li { display: flex; gap: var(--s-2); align-items: flex-start; padding: 5px 0; border-bottom: 1px solid color-mix(in srgb, var(--rule) 60%, transparent); }
  .vztahy li:last-child { border-bottom: 0; }
  .cara { flex: none; margin-top: 5px; fill: none; stroke: var(--pc); stroke-width: 1.8; }
  .cara--znali-se { stroke-dasharray: 1.5 3.5; stroke-linecap: round; }
  .cara--vliv-textem { stroke-dasharray: 6 4; }
  .vztah { display: flex; flex-wrap: wrap; column-gap: 6px; }
  .vztah__role { font-size: 13px; color: var(--muted); }
  .vztah__jmeno { padding: 0; border: 0; background: none; font-weight: 600; text-decoration: underline; text-decoration-color: var(--pc); text-underline-offset: 3px; cursor: pointer; }
  .vztah__pozn { flex-basis: 100%; font-size: 13px; color: var(--ink-2); }
  .zmer__pole { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .zmer select { flex: 1; min-width: 160px; min-height: 40px; padding: 0 8px; border: 1px solid var(--rule); border-radius: var(--r-xs); background: var(--surface); }
  .zmer__vysledek { margin: var(--s-2) 0 0; font-family: var(--font-serif); font-size: 19px; line-height: 1.3; }
  .zmer__data { margin: 2px 0 0; font-size: 12.5px; color: var(--muted); }
  .tlacitka { display: flex; gap: var(--s-2); }
  /* Život na mapě: svislá linka zastávek, prošlé plné, aktuální větší s prstencem, budoucí prázdné.
     Oddíl je umístěný, aby skrytá oblast aria-live (vizualne-skryte, absolutní) zůstala v posuvné kartě;
     jinak ji prohlížeč umístí vůči stránce a ta na telefonu dostane svislý posuvník. */
  .zivot { position: relative; }
  .zastavky { margin: 0; padding: 0; list-style: none; }
  .zastavka { position: relative; }
  .zastavka::before { content: ''; position: absolute; left: 6px; top: 0; bottom: 0; width: 2px; background: var(--rule); }
  .zastavka:first-child::before { top: 50%; }
  .zastavka:last-child::before { bottom: 50%; }
  .zastavka { --cara-byla: color-mix(in srgb, var(--pc) 60%, var(--rule)); }
  .zastavka--byla::before { background: var(--cara-byla); }
  .zastavka--ted::before { background: linear-gradient(to bottom, var(--cara-byla) 50%, var(--rule) 50%); }
  .zastavka--ted:first-child::before { background: var(--rule); }
  .zastavka--ted:last-child::before { background: var(--cara-byla); }
  .zastavka button {
    position: relative;
    display: grid;
    grid-template-columns: 14px minmax(0, 1fr);
    column-gap: var(--s-3);
    align-items: center;
    width: 100%;
    min-height: 44px;
    padding: 3px 4px 3px 0;
    border: 0;
    border-radius: var(--r-xs);
    background: none;
    text-align: left;
    cursor: pointer;
  }
  .zastavka button:hover .zastavka__misto { text-decoration: underline; text-decoration-color: var(--pc); text-underline-offset: 3px; }
  .zastavka__bod { grid-row: 1 / span 2; justify-self: center; width: 10px; height: 10px; border: 2px solid var(--muted); border-radius: 999px; background: var(--surface); }
  .zastavka--byla .zastavka__bod { border-color: var(--pc); background: var(--pc); }
  .zastavka--ted .zastavka__bod { width: 14px; height: 14px; border-color: var(--pc); background: var(--pc); box-shadow: 0 0 0 3px var(--pc-tint); }
  .zastavka__misto { font-weight: 600; line-height: 1.25; }
  .zastavka--ted .zastavka__misto { color: var(--pc); }
  .zastavka__radek { grid-column: 2; font-size: 13px; line-height: 1.3; color: var(--ink-2); }
  .zivot__ovladani { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-bottom: var(--s-2); }
  .zivot__tl {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 0 var(--s-3);
    border: 1px solid var(--rule);
    border-radius: var(--r-xs);
    background: var(--surface);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  .zivot__tl:hover { border-color: var(--muted); }
  .zivot__tl[aria-disabled='true'] { cursor: not-allowed; border-style: dashed; color: var(--muted); }
  .zivot__tl--hlavni { flex: 1; justify-content: center; border: 1.5px solid var(--ink); background: var(--ink); color: var(--paper); }
  .zivot__tl--hlavni:hover { background: var(--ink-2); border-color: var(--ink-2); }
  .zivot__tl--hlavni svg { fill: currentColor; }
  .zivot__vpravo { transform: scaleX(-1); }
  .tlacitko {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 var(--s-4);
    border: 1.5px solid var(--ink);
    border-radius: var(--r-xs);
    color: var(--ink);
    font-weight: 600;
    text-decoration: none;
  }
  .tlacitko--hlavni { background: var(--ink); color: var(--paper); }
  .karta--prazdna p { margin: 0; color: var(--ink-2); }
  .rychle { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 0; padding: 0; list-style: none; }
  .rychle button { display: flex; align-items: center; gap: 8px; width: 100%; min-height: 44px; padding: 4px 8px; border: 1px solid var(--rule); border-radius: var(--r-sm); background: var(--surface); text-align: left; font-weight: 500; cursor: pointer; }
  .rychle button:hover { border-color: var(--pc); }
</style>
