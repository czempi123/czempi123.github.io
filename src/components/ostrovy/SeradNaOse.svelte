<script lang="ts">
  // Seřaď na ose (herna-v1, K1; plátno D5 › Seřaď na ose): karty visí na šňůře s kolíčky (na úzkém rámu svisle).
  // Student je seřadí tažením (myš i prst), klepnutím na dvě karty (prohodí se), nebo z klávesnice: šipky mezi
  // kartami, Enter kartu zvedne, šipky ji posouvají, Enter ji položí, Escape ji vrátí. Zkontrolovat pořadí: „sedí“,
  // nebo „zkus to jinak“ se značkami dvojic a jednou větou, kam se podívat. Roky až po správném pořadí; po třech
  // kontrolách se nabídne Ukázat pořadí. Po správném pořadí (i po Ukázat pořadí) stojí mezi sousedními lidmi, co je
  // spojuje: vztah z vztahy.yaml, „mohli se potkat“, nebo nic (K2, zásada Pointa není paměť); roky jen drobně pod jménem.
  // Pod jménem je od začátku napověda, podle čeho řadit (revize R): z YAML, jinak první věta proc z dat. „Zkus to
  // jinak“ jmenuje první obrácenou dvojici.
  // Do deníku jen stav (pořadí, kontrola, pokusy), žádný zápis.
  // Použití v MDX (obsah v src/content/bloky/dilna-serad-narozeni.yaml, druh: serad):
  // <SeradNaOse id="dilna-serad-narozeni" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import {
    zamichaniOsy, spravnePoradi, vyhodnotPoradi, verdiktPoradi, presun, prohod, stejnePoradi, platnyStavOsy,
    POKUSU_DO_UKAZANI, SEDI, type KartaOsy, type VazbaDvou,
  } from '../../lib/herna';
  import { LEGENDA_TRADOVANY } from '../../lib/vztahy';
  import { prelet, omezenyPohyb } from '../../lib/pohyb';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import type { Dal } from './bloky-typy';

  interface BlokOsy {
    obdobi: number;
    nadtitulek: string;
    nazev: string;
    scena?: string;
    otazka: string;
    zacatek: string;
    konec: string;
    vysvetleni: string;
    karty: KartaOsy[];
    /** co spojuje sousedy ve správném pořadí: [i] mezi místem i a i+1 */
    vazby: (VazbaDvou | null)[];
  }
  interface Props {
    id: string;
    blok: BlokOsy;
    odkaz: string;
    dal?: Dal;
  }
  let { id, blok, odkaz, dal }: Props = $props();

  const n = $derived(blok.karty.length);
  const roky = $derived(blok.karty.map((k) => k.rok));
  // Výchozí pořadí je stejné při sestavení i po hydrataci (semínko z id bloku).
  let poradi = $state<number[]>(zamichaniOsy(blok.karty.map((k) => k.rok), id));
  let kontrola = $state<number[] | null>(null);
  let pokusy = $state(0);
  let hotovo = $state(false);
  let ukazano = $state(false);
  /** zvednutá karta (klepnutím nebo Enterem) a pořadí, kam ji Escape vrátí */
  let zvednuta = $state<{ karta: number; puvodni: number[] } | null>(null);
  /** místo, které má tabulátor (roving tabindex) */
  let aktivni = $state(0);
  let cerstve = $state(false);
  /** číslo kola: Začít znovu rozdá karty znovu (nové prvky dostanou třídu rozdat) */
  let kolo = $state(0);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();

  const vysledek = $derived(kontrola ? vyhodnotPoradi(kontrola, roky) : null);
  /** značky dvojic platí jen pro pořadí, které student zkontroloval */
  const znacky = $derived(!hotovo && vysledek && stejnePoradi(kontrola, poradi) ? vysledek.dvojice : null);
  const verdikt = $derived(kontrola && !hotovo ? verdiktPoradi(blok.karty, kontrola) : null);
  const smiKontrolovat = $derived(!hotovo && !stejnePoradi(kontrola, poradi));
  const nabidnoutUkazani = $derived(!hotovo && pokusy >= POKUSU_DO_UKAZANI);

  onMount(() => {
    const s = platnyStavOsy(stavBloku(id), n);
    if (s) ({ poradi, kontrola, pokusy, hotovo, ukazano } = s);
  });

  function ulozStav() {
    if (!kontrola && !hotovo && stejnePoradi(poradi, zamichaniOsy(roky, id))) return smazStavBloku(id);
    ulozStavBloku(id, { poradi, kontrola, pokusy, hotovo, ukazano }, { odkaz, otazka: blok.otazka, druh: 'serad', hotovo });
  }

  const koren = () => document.getElementById(id);
  const tlacitko = (karta: number) => koren()?.querySelector<HTMLElement>(`[data-karta="${karta}"]`);
  const text = (karta: number) => blok.karty[karta].text;
  const misto = (karta: number) => poradi.indexOf(karta) + 1;

  /** Polohy karet před změnou; po vykreslení každá přejede ze svého starého místa. */
  function polohy(): Map<number, DOMRect> {
    const m = new Map<number, DOMRect>();
    for (const k of poradi) {
      const r = tlacitko(k)?.getBoundingClientRect();
      if (r) m.set(k, r);
    }
    return m;
  }
  async function zmen(nove: number[], hlas: string, fokus?: number) {
    const pred = polohy();
    poradi = nove;
    hlaseni = hlas;
    ulozStav();
    await tick();
    for (const [k, r] of pred) prelet(tlacitko(k), r);
    if (fokus !== undefined) {
      aktivni = poradi.indexOf(fokus);
      tlacitko(fokus)?.focus();
    }
  }

  function klepnuti(karta: number) {
    if (hotovo) return;
    if (potlacKlik) { potlacKlik = false; return; }
    aktivni = poradi.indexOf(karta);
    if (!zvednuta) {
      zvednuta = { karta, puvodni: [...poradi] };
      hlaseni = `Zvednutá karta „${text(karta)}“, místo ${misto(karta)} z ${n}. Klepni na jinou kartu a prohodí se. Z klávesnice ji posuneš šipkami a Enter ji položí.`;
      return;
    }
    const prvni = zvednuta.karta;
    zvednuta = null;
    if (prvni === karta) {
      hlaseni = `Karta „${text(karta)}“ leží na místě ${misto(karta)} z ${n}.`;
      return;
    }
    zmen(prohod(poradi, poradi.indexOf(prvni), poradi.indexOf(karta)), `„${text(prvni)}“ a „${text(karta)}“ si vyměnily místa.`, karta);
  }

  function klavesa(e: KeyboardEvent, karta: number) {
    if (hotovo) return;
    const i = poradi.indexOf(karta);
    const zpet = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    const dal_ = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    if (e.key === 'Escape' && zvednuta) {
      e.preventDefault();
      const z = zvednuta;
      zvednuta = null;
      zmen(z.puvodni, `Karta „${text(z.karta)}“ je zpátky na místě ${z.puvodni.indexOf(z.karta) + 1}.`, z.karta);
      return;
    }
    if (!zpet && !dal_ && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    if (zvednuta?.karta === karta) {
      const cil = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : i + (zpet ? -1 : 1);
      if (cil < 0 || cil >= n || cil === i) return;
      zmen(presun(poradi, i, cil), `„${text(karta)}“ je na místě ${cil + 1} z ${n}.`, karta);
      return;
    }
    const cil = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : Math.min(n - 1, Math.max(0, i + (zpet ? -1 : 1)));
    aktivni = cil;
    tlacitko(poradi[cil])?.focus();
  }

  async function zkontroluj() {
    if (!smiKontrolovat) return;
    zvednuta = null;
    kontrola = [...poradi];
    const v = vyhodnotPoradi(poradi, roky);
    cerstve = true;
    if (v.sedi) {
      hotovo = true;
      hlaseni = `${SEDI} Karty visí ve správném pořadí.`;
    } else {
      pokusy += 1;
      hlaseni = '';
    }
    ulozStav();
    await tick();
    oblast?.focus();
  }

  async function ukaz() {
    zvednuta = null;
    ukazano = true;
    hotovo = true;
    cerstve = true;
    kontrola = spravnePoradi(roky);
    await zmen(spravnePoradi(roky), 'Karty visí ve správném pořadí i s roky.');
    await tick();
    oblast?.focus();
  }

  async function znovu() {
    poradi = zamichaniOsy(roky, id);
    kontrola = null;
    pokusy = 0;
    hotovo = false;
    ukazano = false;
    zvednuta = null;
    cerstve = false;
    aktivni = 0;
    hlaseni = 'Karty jsou zamíchané znovu.';
    smazStavBloku(id);
    if (!omezenyPohyb()) kolo += 1;
    await tick();
    tlacitko(poradi[0])?.focus();
  }

  // ── Tažení po šňůře (myš i prst); klepnutí a klávesnici obstará klepnuti() a klavesa() ──
  let tah = $state<{ karta: number; x: number; y: number } | null>(null);
  let start: { karta: number; x: number; y: number; stredy: { k: number; x: number; y: number }[]; svisle: boolean } | null = null;
  let potlacKlik = false;
  const PRAH = 6;

  function stisk(e: PointerEvent, karta: number) {
    if (hotovo || e.button !== 0) return;
    const ol = koren()?.querySelector<HTMLElement>('.snura');
    const svisle = !!ol && getComputedStyle(ol).flexDirection === 'column';
    const stredy = poradi.map((k) => {
      const r = tlacitko(k)!.getBoundingClientRect();
      return { k, x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    start = { karta, x: e.clientX, y: e.clientY, stredy, svisle };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* syntetická událost */ }
  }
  function pohyb(e: PointerEvent) {
    if (!start) return;
    const x = e.clientX - start.x;
    const y = e.clientY - start.y;
    if (!tah && Math.hypot(x, y) < PRAH) return;
    tah = { karta: start.karta, x, y };
  }
  /** Místo, kam karta padne: nejbližší střed místa podle osy šňůry. */
  function cilTahu(e: PointerEvent): number {
    if (!start) return -1;
    const s = start;
    let nejlepsi = 0;
    let vzd = Infinity;
    s.stredy.forEach((m, i) => {
      const d = s.svisle ? Math.abs(e.clientY - m.y) : Math.abs(e.clientX - m.x);
      if (d < vzd) { vzd = d; nejlepsi = i; }
    });
    return nejlepsi;
  }
  function pusteni(e: PointerEvent) {
    if (!start) return;
    const karta = start.karta;
    const tazeno = !!tah;
    const cil = tazeno && e.type === 'pointerup' ? cilTahu(e) : -1;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* už uvolněno */ }
    start = null;
    tah = null;
    if (!tazeno) return;
    potlacKlik = e.type === 'pointerup';
    // Klepnutí po tažení nepřijde vždy (dotyk); pojistka ho po chvíli zapomene.
    setTimeout(() => { potlacKlik = false; }, 400);
    zvednuta = null;
    const z = poradi.indexOf(karta);
    if (cil < 0 || cil === z) return;
    zmen(presun(poradi, z, cil), `„${text(karta)}“ je na místě ${cil + 1} z ${n}.`);
  }
</script>

{#snippet vazba()}
  {#if hotovo}
    <p class="blok__zpetna-titulek">{ukazano ? 'Takhle jdou po sobě.' : SEDI}</p>
    {#each odstavce(blok.vysvetleni) as o, i (i)}<p>{@html o}</p>{/each}
  {:else if verdikt}
    <p class="zkus"><svg class="zkus__sipka" width="30" height="18" viewBox="0 0 30 18" aria-hidden="true" focusable="false"><path d="M2 12c6-7 15-9 24-4M20 3l6 5-7 3" /></svg>{verdikt.slovo}</p>
    {#if verdikt.veta}<p>{@html radek(verdikt.veta)}</p>{/if}
  {/if}
{/snippet}

{#snippet akce()}
  {#if !hotovo}
    {#if nabidnoutUkazani}<button class="blok__tl blok__tl--vedlejsi vystouple" type="button" onclick={ukaz}>Ukázat pořadí</button>{/if}
    <button class="blok__tl blok__tl--hlavni" type="button" onclick={zkontroluj} disabled={!smiKontrolovat}>Zkontrolovat pořadí</button>
  {:else}
    <BlokDal {dal} />
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="serad"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  labelledby={`${id}-otazka`}
  vazba={hotovo || verdikt ? vazba : undefined}
  vazbaPopisek={hotovo ? 'Pořadí' : 'Zkus to jinak'}
  {cerstve}
  bind:vazbaPrvek={oblast}
  znovu={hotovo || kontrola ? znovu : undefined}
  hlavni={!hotovo || dal ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  <div class={['osa', hotovo && 'osa--hotovo', hotovo && blok.vazby.some(Boolean) && 'osa--vazby']} data-cast="moznosti">
    <span class="osa__kraj osa__kraj--zacatek" aria-hidden="true">{blok.zacatek}</span>
    <ol class="snura" aria-label={`Šňůra od „${blok.zacatek}“ po „${blok.konec}“`} aria-describedby={hotovo ? undefined : `${id}-jak`}>
      <svg class="snura__provaz" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="snura__vodorovne" d="M0 50 Q 50 70 100 50" vector-effect="non-scaling-stroke" />
        <path class="snura__svisle" d="M50 0 Q 62 50 50 100" vector-effect="non-scaling-stroke" />
      </svg>
      {#each poradi as k, i (`${kolo}-${k}`)}
        {@const karta = blok.karty[k]}
        <li class={['misto', kolo > 0 && 'rozdat']} style={`--i: ${i}; --nat: ${[-1.2, .9, -.5, 1.1, -.8, .6][k % 6]}deg`}>
          <span class="kolicek" aria-hidden="true"></span>
          <button
            class={['karta-osy', zvednuta?.karta === k && 'karta-osy--zvednuta', tah?.karta === k && 'karta-osy--tazena']}
            type="button"
            data-karta={k}
            tabindex={i === aktivni ? 0 : -1}
            aria-pressed={hotovo ? undefined : zvednuta?.karta === k}
            aria-disabled={hotovo ? 'true' : undefined}
            style={tah?.karta === k ? `transform: translate(${tah.x}px, ${tah.y}px)` : undefined}
            onclick={() => klepnuti(k)}
            onkeydown={(e) => klavesa(e, k)}
            onpointerdown={(e) => stisk(e, k)}
            onpointermove={pohyb}
            onpointerup={pusteni}
            onpointercancel={pusteni}
          >
            <span class="karta-osy__text">{@html radek(karta.text)}</span>
            {#if karta.napoveda}<span class="karta-osy__napoveda">{@html radek(karta.napoveda)}</span>{/if}
            {#if hotovo}<span class="karta-osy__rok">{karta.rokText}</span>{/if}
            <span class="vizualne-skryte">, místo {i + 1} z {n}</span>
          </button>
          {#if hotovo && i < n - 1 && blok.vazby[i]}
            {@const v = blok.vazby[i]!}
            <span class={['vazba-osy', `vazba-osy--${v.druh}`, v.tradovany && 'vazba-osy--tradovana']}>
              <span aria-hidden="true">{#if v.kPrvnimu}<span class="vazba-osy__sipka"></span>{/if}{v.text}{#if v.tradovany}<span class="vazba-osy__tradovany">{LEGENDA_TRADOVANY}</span>{/if}</span>
              <span class="vizualne-skryte">{v.veta}</span>
            </span>
          {/if}
          {#if znacky && i < n - 1}
            <span class={['dvojice', znacky[i] ? 'dvojice--sedi' : 'dvojice--obracene']}>
              <span aria-hidden="true">{znacky[i] ? '✓' : '⇄'}</span>
              <span class="vizualne-skryte">Dvojice „{karta.text}“ a „{blok.karty[poradi[i + 1]].text}“ {znacky[i] ? 'sedí' : 'visí obráceně'}.</span>
            </span>
          {/if}
        </li>
      {/each}
    </ol>
    <span class="osa__kraj osa__kraj--konec" aria-hidden="true">{blok.konec}</span>
    {#if hotovo && !ukazano}<span class={['herni-otisk', 'osa__otisk', cerstve && 'otisk']} aria-hidden="true">sedí</span>{/if}
  </div>
  {#if !hotovo}
    <p class="osa__napoveda" id={`${id}-jak`}>Přetáhni kartu na jiné místo, nebo klepni na dvě karty a prohodí se.</p>
  {/if}
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  /* Šňůra: provázek s kolíčky, karty na něm visí. Vodorovně, když je v rámu místo (od O s napovědou pod jménem
     aspoň asi 160 px na kartu: v kroku cesty a v dílně), jinak svisle: provázek vlevo, karty vpravo od něj
     (telefon, čtenářský sloupec stránky období). */
  .osa {
    position: relative;
    display: grid;
    grid-template-areas: 'zacatek' 'snura' 'konec';
    gap: var(--s-2);
    margin: var(--s-4) 0 var(--s-3);
  }
  .osa__kraj { font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .osa__kraj--zacatek { grid-area: zacatek; }
  .osa__kraj--konec { grid-area: konec; }
  .osa__kraj--zacatek::before { content: '↑ '; }
  .osa__kraj--konec::before { content: '↓ '; }
  .snura {
    grid-area: snura;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin: 0;
    padding: 4px 0 4px 38px;
    list-style: none;
  }
  .snura__provaz { position: absolute; left: 4px; top: 0; width: 24px; height: 100%; overflow: visible; fill: none; stroke: var(--tuzka); stroke-width: 2; }
  .snura__vodorovne { display: none; }
  .misto { position: relative; }
  /* Kolíček: dřevěný štípek přes provázek, na kartu míří ze strany provázku. */
  .kolicek {
    position: absolute;
    z-index: 2;
    left: -32px;
    top: 50%;
    width: 30px;
    height: 10px;
    translate: 0 -50%;
    border-radius: 2px;
    background: var(--plocha);
    box-shadow: inset 0 0 0 1.5px var(--tuzka), 0 1px 1px rgb(0 0 0 / .12);
  }
  .kolicek::after { content: ''; position: absolute; left: 6px; right: 6px; top: 50%; height: 1.5px; translate: 0 -50%; background: var(--tuzka); }
  .karta-osy {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    width: 100%;
    min-height: 56px;
    padding: var(--s-2) var(--s-4);
    border: 0;
    border-radius: 2px;
    background: var(--list);
    box-shadow: var(--lezi);
    rotate: calc(var(--nat, 0deg) * var(--natoceni));
    color: var(--ink);
    font-family: var(--font-serif);
    font-size: calc(var(--meritko) * 18px);
    line-height: 1.25;
    text-align: left;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    /* Kartu vede prst; stránka se posouvá všude kolem šňůry. */
    touch-action: none;
    transition: rotate var(--d-stisk) var(--k-stisk), translate var(--d-stisk) var(--k-stisk), box-shadow var(--d-stisk) var(--k-stisk);
  }
  @media (hover: hover) { .karta-osy:not([aria-disabled]):hover { translate: 0 -2px; box-shadow: var(--lezi-zved); } }
  .karta-osy:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  /* Zvednutá karta: obrys v barvě pera (D5), leží výš. Tažená jde za prstem nad ostatními. */
  .karta-osy--zvednuta, .karta-osy--tazena { rotate: 0deg; translate: 0 -3px; box-shadow: var(--lezi-zved); outline: 2px solid var(--pero); outline-offset: 3px; }
  .karta-osy--zvednuta:focus-visible { outline: 2px solid var(--pero); box-shadow: var(--lezi-zved), 0 0 0 7px var(--list), 0 0 0 9px var(--ink); }
  .karta-osy--tazena { z-index: 6; cursor: grabbing; transition: none; }
  .karta-osy[aria-disabled] { cursor: default; }
  /* Napověda pod jménem (revize R): tiskem jako věta proc pod razítkem v Kdo to řekl? */
  .karta-osy__napoveda { font-family: var(--font-serif); font-size: calc(var(--meritko) * 14px); line-height: 1.35; color: var(--ink-2); text-wrap: pretty; }
  /* Roky jsou jen drobný údaj pod jménem (zásada Pointa není paměť). */
  .karta-osy__rok { font-family: var(--font-sans); font-size: calc(var(--meritko) * 12.5px); font-weight: 500; color: var(--ink-2); }
  /* Co spojuje sousedy: drobně tiskem v mezeře mezi kartami, na provázku. Tradovaný vztah „· vypráví se“. */
  .osa--vazby .snura { gap: 40px; }
  .vazba-osy {
    position: absolute;
    z-index: 3;
    left: 0;
    right: 0;
    top: 100%;
    display: flex;
    align-items: center;
    height: 40px;
    padding-left: var(--s-2);
    font-family: var(--font-sans);
    font-size: var(--fs-popisek);
    line-height: 1.2;
    color: var(--ink);
  }
  .vazba-osy--potkat, .vazba-osy--soucasne { color: var(--ink-2); font-style: italic; }
  /* Tradovaný vztah: „vypráví se“ na vlastním řádku kurzívou. */
  .vazba-osy__tradovany { display: block; color: var(--ink-2); font-style: italic; }
  .vazba-osy__sipka::before { content: '↑ '; }
  /* Značka dvojice na provázku mezi kartami: ✓ sedí, ⇄ visí obráceně. Jen tvar, žádná barva navíc. */
  .dvojice {
    position: absolute;
    z-index: 3;
    left: -30px;
    bottom: -16px;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--list);
    box-shadow: inset 0 0 0 1.5px var(--ink-2);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
  }
  .dvojice--obracene { box-shadow: inset 0 0 0 1.5px var(--ink); background: var(--plocha); }
  /* Otisk svisle dole vpravo u konce šňůry: nahoře by zakryl napovědu první karty. */
  .osa__otisk { position: absolute; right: 0; bottom: -18px; z-index: 4; }
  .osa__napoveda { margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }

  /* Vodorovná šňůra: karty vedle sebe, kolíčky nahoře, popisky konců pod ní. */
  @container (min-width: 860px) {
    .osa { grid-template-columns: 1fr 1fr; grid-template-areas: 'snura snura' 'zacatek konec'; }
    .osa__kraj--konec { justify-self: end; }
    .osa__kraj--zacatek::before { content: '← '; }
    .osa__kraj--konec::before { content: none; }
    .osa__kraj--konec::after { content: ' →'; }
    .snura { flex-direction: row; gap: 14px; padding: 30px 0 4px; }
    .misto { flex: 1 1 0; min-width: 0; }
    .snura__provaz { left: 0; top: 2px; width: 100%; height: 24px; }
    .snura__vodorovne { display: inline; }
    .snura__svisle { display: none; }
    .kolicek { left: 50%; top: -24px; width: 10px; height: 30px; translate: -50% 0; }
    .kolicek::after { left: 50%; right: auto; top: 6px; bottom: 6px; width: 1.5px; height: auto; translate: -50% 0; }
    .karta-osy { align-items: center; min-height: 92px; padding: var(--s-3) var(--s-2); text-align: center; hyphens: auto; }
    .dvojice { left: auto; right: -7px; bottom: auto; top: -10px; translate: 50% 0; }
    /* Vodorovně stojí vazba pod šňůrou, na středu mezi dvěma kartami. */
    .osa--vazby .snura { gap: 14px; padding-bottom: 58px; }
    .vazba-osy { left: calc(100% + 7px); right: auto; top: calc(100% + 6px); width: calc(100% + 14px); height: auto; padding: 0; translate: -50% 0; justify-content: center; text-align: center; text-wrap: balance; }
    .vazba-osy__sipka::before { content: '← '; }
    /* Otisk nad konec šňůry, ať nezakryje jméno poslední karty. */
    .osa__otisk { top: -58px; bottom: auto; }
  }

  .zkus { display: flex; align-items: center; gap: var(--s-2); margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: calc(var(--meritko) * 22px); line-height: 1.3; color: var(--ruka); }
  .zkus__sipka { flex: none; fill: none; stroke: var(--tuzka); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
