<script lang="ts">
  // Mapa a čas: mapa, posuvník roku, řeka životů a karta člověka jako jeden nástroj.
  // Stav (rok, období, vybraný člověk, srovnání, stín odkazu) nese adresa, takže jde sdílet a funguje Zpět.
  // Přehrát život (karta člověka, oddíl Život na mapě): rok projede život vybraného člověka a na každé zastávce
  // vteřinu postojí. Adresa se během přehrávání přepisuje; do historie přibude jediný záznam (první posun roku),
  // který na konci nese rok, kde přehrávání skončilo. Zastaví ho jakýkoli zásah do času, jiný člověk i zavření karty.
  import { onMount, onDestroy, untrack, tick } from 'svelte';
  import type { PodkladObdobi } from '../../lib/mapa';
  import type { VstupMapy, OsobaV } from '../../lib/mapa-vstup';
  import {
    zijeVRoce, zivotOsoby, obdobiProRok, oknoReky, zpravaOSmrti, stinOdkazu, naAstro, omezRok, kdeVRoce, vekVRoce, let_,
  } from '../../lib/cas-mapy';
  import { rok as rokText } from '../../lib/casy';
  import { prectiAdresu, zapisAdresu } from '../../lib/adresa-mapy';
  import { zastavkyZivota, maZastavky, planPrehravani, rokVCase, casProRok, PREHRAVANI, type NastaveniPrehravani } from '../../lib/zivot-na-mape';
  import Mapa from './Mapa.svelte';
  import Posuvnik from './Posuvnik.svelte';
  import Reka from './Reka.svelte';
  import PasObdobi from './PasObdobi.svelte';
  import KartaCloveka from './KartaCloveka.svelte';
  import Mince from './Mince.svelte';

  interface Props {
    vstup: VstupMapy;
    vychoziRok?: number;
  }
  let { vstup, vychoziRok = -360 }: Props = $props();

  const podleId = new Map(vstup.lide.map((o) => [o.id, o]));
  const mista = new Map(vstup.mista.map((m) => [m.id, m]));
  const kotvy = vstup.udalosti.filter((u) => u.druh === 'kotva');

  // ── Stav ───────────────────────────────────────────────────────────────────
  let rok = $state(untrack(() => vychoziRok));
  let obdobi = $state(obdobiProRok(untrack(() => vstup.obdobi), untrack(() => vychoziRok)));
  let osobaId: string | undefined = $state();
  let srovnatId: string | undefined = $state();
  let stin = $state(false);
  let zalozka: 'clovek' | 'reka' = $state('clovek');
  let zprava: string | null = $state(null);
  let telefon = $state(false);
  let omezitPohyb = $state(false);
  let sirkaOkna = $derived(telefon ? 160 : 240);
  let okno: [number, number] = $state(oknoReky(untrack(() => vychoziRok), 240, untrack(() => vstup.rozsah)));
  let podklad: PodkladObdobi | null = $state(null);

  let osoba = $derived(osobaId ? podleId.get(osobaId) : undefined);
  let zastavky = $derived(osoba && maZastavky(osoba) ? zastavkyZivota(osoba) : []);
  let zijici = $derived(vstup.lide.filter((o) => zijeVRoce(o, rok)));
  let stinLide = $derived(stin ? stinOdkazu(vstup.lide, vstup.vztahy, rok) : []);

  // Na mapě jsou lidé, jejichž místo leží na podkladu období; kdo žije daleko mimo (Čína), je v kartě Mezitím jinde.
  const naPodkladu = (p: PodkladObdobi, o: OsobaV) => {
    const kde = kdeVRoce(o, rok);
    const xy = kde ? p.mista[kde.misto] : undefined;
    return !!xy && xy[0] > -p.sirka * 0.4 && xy[0] < p.sirka * 1.4 && xy[1] > -p.vyska * 0.6 && xy[1] < p.vyska * 1.6;
  };
  let naMape = $derived(podklad ? zijici.filter((o) => o.tradice === 'zapadni' || naPodkladu(podklad!, o)) : zijici.filter((o) => o.tradice === 'zapadni'));
  let mezitim = $derived(zijici.filter((o) => o.tradice !== 'zapadni' && !naMape.includes(o)));
  const KDE_JINDE: Record<string, string> = { cinska: 'v Číně', indicka: 'v Indii', islamska: 'v islámském světě', africka: 'v Africe' };

  // ── Podklad mapy ───────────────────────────────────────────────────────────
  const podklady = new Map<string, Promise<PodkladObdobi>>();
  function nactiPodklad(id: number, druh: 'notebook' | 'telefon') {
    const klic = `${id}-${druh}`;
    if (!podklady.has(klic)) {
      podklady.set(klic, fetch(`/mapa/podklad/${klic}.json`).then((r) => {
        if (!r.ok) throw new Error(`Podklad ${klic} chybí`);
        return r.json();
      }));
    }
    return podklady.get(klic)!;
  }
  $effect(() => {
    const id = obdobi;
    const druh = telefon ? 'telefon' : 'notebook';
    nactiPodklad(id, druh)
      .then((p) => {
        if (id === obdobi && (telefon ? 'telefon' : 'notebook') === druh) podklad = p;
      })
      .catch(() => {});
  });

  // ── Adresa ─────────────────────────────────────────────────────────────────
  // První změna po načtení vždy založí nový záznam historie (i když přijde do 800 ms od načtení).
  let posledniZapis = -Infinity;
  let odlozenyZapis: ReturnType<typeof setTimeout> | undefined;
  function zapisAdresy(rezim: 'push' | 'replace' | 'auto' | 'tah' | 'prehravani') {
    clearTimeout(odlozenyZapis);
    // Při tažení i přehrávání se adresa přepisuje nejvýš pětkrát za vteřinu; první změna po klidu tažení
    // založí nový záznam historie, přehrávání jen přepisuje.
    if ((rezim === 'tah' || rezim === 'prehravani') && performance.now() - posledniZapis < 200) {
      odlozenyZapis = setTimeout(() => zapisAdresy('replace'), 200);
      return;
    }
    if (rezim === 'tah') rezim = 'auto';
    if (rezim === 'prehravani') rezim = 'replace';
    const hledani = zapisAdresu({ rok, obdobi, osoba: osobaId, srovnat: srovnatId, stin }, obdobiProRok(vstup.obdobi, rok));
    if (hledani === location.search) return;
    const ted = performance.now();
    const push = rezim === 'push' || (rezim === 'auto' && ted - posledniZapis > 800);
    posledniZapis = ted;
    const url = `${location.pathname}${hledani}`;
    if (push) history.pushState(null, '', url);
    else history.replaceState(null, '', url);
  }
  function prectiAdresy() {
    zastavPrehravani(false);
    const s = prectiAdresu(location.search, {
      rok: vychoziRok,
      rozsah: vstup.rozsah,
      osoby: new Set(podleId.keys()),
      obdobi: new Set(vstup.obdobi.filter((o) => o.otevrene).map((o) => o.id)),
    });
    rok = s.rok;
    obdobi = s.obdobi && vstup.obdobi.some((o) => o.id === s.obdobi && s.rok >= o.okno.od && s.rok <= o.okno.do) ? s.obdobi : obdobiProRok(vstup.obdobi, s.rok, obdobi);
    osobaId = s.osoba && zijeVRoce(podleId.get(s.osoba)!, s.rok) ? s.osoba : undefined;
    srovnatId = s.srovnat;
    stin = s.stin;
    okno = oknoReky(rok, sirkaOkna, vstup.rozsah);
    zprava = null;
    return s;
  }

  // ── Změny ──────────────────────────────────────────────────────────────────
  let casovac: ReturnType<typeof setTimeout> | undefined;
  function ukazZpravu(text: string) {
    zprava = text;
    clearTimeout(casovac);
    casovac = setTimeout(() => (zprava = null), 4500);
  }
  onDestroy(() => clearTimeout(casovac));

  function drzOkno(r: number) {
    const a = naAstro(r);
    const [od, do_] = [naAstro(okno[0]), naAstro(okno[1])];
    const okraj = (do_ - od) * 0.12;
    if (a < od + okraj || a > do_ - okraj || do_ - od !== sirkaOkna) okno = oknoReky(r, sirkaOkna, vstup.rozsah);
  }

  function zmenaRoku(novy: number, zdroj: 'tah' | 'klavesa' | 'tlacitko' | 'konec-tahu' | 'skok') {
    let r = omezRok(novy, vstup.rozsah[0], vstup.rozsah[1]);
    if (r === 0) r = rok < 0 ? 1 : -1;
    const predtim = rok;
    rok = r;
    obdobi = obdobiProRok(vstup.obdobi, r, obdobi);
    if (zdroj !== 'tah' && zdroj !== 'konec-tahu') drzOkno(r);
    const o = osoba;
    if (o && zijeVRoce(o, predtim) && !zijeVRoce(o, r)) {
      const z = zivotOsoby(o)!;
      ukazZpravu(r > z.do ? zpravaOSmrti(o) : `${o.jmeno} se ${o.zena ? 'narodí' : 'narodí'} až roku ${rokText(z.od)}.`);
      osobaId = undefined;
    }
    zapisAdresy(zdroj === 'tlacitko' || zdroj === 'skok' ? 'push' : zdroj === 'konec-tahu' ? 'replace' : zdroj === 'tah' ? 'tah' : 'auto');
  }

  function vyber(id: string, odkud: 'mapa' | 'reka' | 'karta' = 'mapa') {
    const o = podleId.get(id);
    if (!o) return;
    if (id !== osobaId) zastavPrehravani();
    osobaId = id;
    if (srovnatId === id) srovnatId = undefined;
    if (!zijeVRoce(o, rok)) {
      // Člověk z řeky nebo ze vztahů, který v tomto roce nežije: posuň čas do jeho života.
      const z = zivotOsoby(o)!;
      const cil = rok < z.od ? z.od : z.do;
      rok = cil;
      obdobi = obdobiProRok(vstup.obdobi, cil, obdobi);
      drzOkno(cil);
    }
    if (telefon && odkud === 'mapa') zalozka = 'clovek';
    zapisAdresy('push');
  }
  function zavrit() {
    zastavPrehravani();
    osobaId = undefined;
    zapisAdresy('push');
  }
  function vyberObdobi(id: number) {
    const ob = vstup.obdobi.find((o) => o.id === id);
    if (!ob || !ob.otevrene || id === obdobi) return;
    zastavPrehravani();
    obdobi = id;
    if (rok < ob.okno.od || rok > ob.okno.do) {
      // Rok, ve kterém v období žije nejvíc lidí z atlasu.
      let nej = ob.okno.od;
      let pocet = -1;
      for (let r = ob.okno.od; r <= Math.min(ob.okno.do, vstup.rozsah[1]); r += 10) {
        const n = vstup.lide.filter((o) => o.obdobi === id && zijeVRoce(o, r === 0 ? 1 : r)).length;
        if (n > pocet) [nej, pocet] = [r === 0 ? 1 : r, n];
      }
      rok = nej;
      if (osoba && !zijeVRoce(osoba, rok)) osobaId = undefined;
    }
    okno = oknoReky(rok, sirkaOkna, vstup.rozsah);
    zapisAdresy('push');
  }

  // ── Přehrát život ──────────────────────────────────────────────────────────
  let prehrava = $state(false);
  let snimek = 0;
  let prvniPosun = false;
  /** Zastaví přehrávání; adresa pak nese rok, kde skončilo. Při Zpět (`zapsat = false`) se adresa nepřepisuje. */
  function zastavPrehravani(zapsat = true) {
    if (!prehrava) return;
    prehrava = false;
    cancelAnimationFrame(snimek);
    if (zapsat && !prvniPosun) zapisAdresy('replace');
    else clearTimeout(odlozenyZapis);
  }
  function posunPrehravani(r: number, o: OsobaV) {
    rok = r;
    // Kamera drží období člověka, dokud rok leží v jeho okně (Aristotelés zůstane v Řecku i po roce 350).
    obdobi = obdobiProRok(vstup.obdobi, r, o.obdobi);
    drzOkno(r);
    if (prvniPosun) {
      prvniPosun = false;
      zapisAdresy('push');
    } else zapisAdresy('prehravani');
  }
  function prehrat() {
    const o = osoba;
    if (!o || omezitPohyb || !zastavky.length || prehrava) return;
    // Testy si přehrávání zkrátí: window.atlasPrehravani = { delka: 1000, zastaveni: 100 }.
    const nastaveni: NastaveniPrehravani = { ...PREHRAVANI, ...((globalThis as { atlasPrehravani?: Partial<NastaveniPrehravani> }).atlasPrehravani ?? {}) };
    const plan = planPrehravani(o, zastavky, nastaveni);
    if (!plan) return;
    const zacatek = performance.now() - casProRok(plan, rok);
    prehrava = true;
    prvniPosun = true;
    if (casProRok(plan, rok) === 0 && rok !== plan.od) posunPrehravani(plan.od, o);
    const krok = (ted: number) => {
      if (!prehrava) return;
      const t = ted - zacatek;
      const r = rokVCase(plan, t);
      if (r !== rok) posunPrehravani(r, o);
      if (t >= plan.celkem) {
        prehrava = false;
        clearTimeout(odlozenyZapis);
        zapisAdresy('replace');
        return;
      }
      snimek = requestAnimationFrame(krok);
    };
    snimek = requestAnimationFrame(krok);
  }
  function naZastavku(r: number) {
    zastavPrehravani();
    zmenaRoku(r, 'tlacitko');
  }
  // Omezený pohyb zapnutý během přehrávání ho zastaví.
  $effect(() => {
    if (omezitPohyb) untrack(() => zastavPrehravani());
  });

  onMount(() => {
    const mqTelefon = matchMedia('(max-width: 899px)');
    const mqPohyb = matchMedia('(prefers-reduced-motion: reduce)');
    const zmenaMedii = () => {
      telefon = mqTelefon.matches;
      omezitPohyb = mqPohyb.matches;
      okno = oknoReky(rok, sirkaOkna, vstup.rozsah);
    };
    zmenaMedii();
    mqTelefon.addEventListener('change', zmenaMedii);
    mqPohyb.addEventListener('change', zmenaMedii);
    const stav = prectiAdresy();
    // Z odkazu „Přehrát život na mapě“: karta otevřená, fokus na Přehrát (při omezeném pohybu na Další zastávka).
    if (stav.zivot && osobaId) {
      zalozka = 'clovek';
      tick().then(() => document.getElementById(omezitPohyb ? 'zivot-dalsi' : 'zivot-prehrat')?.focus());
    }
    history.replaceState(null, '', `${location.pathname}${zapisAdresu({ rok, obdobi, osoba: osobaId, srovnat: srovnatId, stin }, obdobiProRok(vstup.obdobi, rok))}`);
    const zpet = () => void prectiAdresy();
    addEventListener('popstate', zpet);
    return () => {
      mqTelefon.removeEventListener('change', zmenaMedii);
      mqPohyb.removeEventListener('change', zmenaMedii);
      removeEventListener('popstate', zpet);
      cancelAnimationFrame(snimek);
    };
  });

  const vekKratce = (o: OsobaV) => {
    const v = vekVRoce(o, rok);
    return v === null ? '' : `${o.zena ? 'je jí' : 'je mu'} ${o.narozen?.priblizne ? 'asi ' : ''}${let_(v)}`;
  };
</script>

<div class="mac obdobi-{obdobi}" data-zalozka={zalozka}>
  <div class="mac__pas">
    <PasObdobi
      obdobi={vstup.obdobi}
      aktivni={obdobi}
      {rok}
      {okno}
      hustota={vstup.hustota}
      dejiny={vstup.dejiny}
      rozsah={vstup.rozsah}
      onvyber={vyberObdobi}
      onskok={(r) => {
        zastavPrehravani();
        zmenaRoku(r, 'skok');
      }}
      onpripravuje={(o) => ukazZpravu(`${o.nazev}: připravujeme.`)}
    />
  </div>

  <div class="mac__mapa">
    <Mapa
      {podklad}
      lide={naMape}
      {stinLide}
      {mista}
      {rok}
      vybrany={osobaId}
      {stin}
      {zprava}
      {omezitPohyb}
      onvyber={(id) => vyber(id, 'mapa')}
      onstin={(z) => {
        stin = z;
        zapisAdresy('push');
      }}
    />
    {#if mezitim.length}
      <aside class="mezitim" aria-label="Mezitím jinde">
        <p class="mezitim__nadpis">Mezitím {KDE_JINDE[mezitim[0].tradice] ?? 'jinde'}</p>
        <ul>
          {#each mezitim as o (o.id)}
            <li class="obdobi-{o.obdobi}">
              <button type="button" onclick={() => vyber(o.id, 'mapa')} aria-pressed={o.id === osobaId}>
                <Mince ikona={o.atribut?.ikona} obdobi={o.obdobi} varianta={o.id === osobaId ? 'sel' : 'ring'} velikost={24} />
                <span><strong>{o.jmeno}</strong> <small>{[vekKratce(o), mista.get(kdeVRoce(o, rok)?.misto ?? '')?.nazev].filter(Boolean).join(' · ')}</small></span>
              </button>
            </li>
          {/each}
        </ul>
      </aside>
    {/if}
  </div>

  <div class="mac__posuvnik">
    <Posuvnik
      {rok}
      {okno}
      rozsah={vstup.rozsah}
      {kotvy}
      onzmena={(r, zdroj) => {
        zastavPrehravani();
        zmenaRoku(r, zdroj);
      }}
      onokno={(o) => {
        zastavPrehravani();
        okno = o;
      }}
    />
  </div>

  <div class="mac__zalozky" role="tablist" aria-label="Panel">
    <button type="button" role="tab" id="tab-clovek" aria-controls="panel-karta" aria-selected={zalozka === 'clovek'} onclick={() => (zalozka = 'clovek')}>Člověk{osoba ? `: ${osoba.jmeno}` : ''}</button>
    <button type="button" role="tab" id="tab-reka" aria-controls="panel-reka" aria-selected={zalozka === 'reka'} onclick={() => (zalozka = 'reka')}>Řeka životů</button>
  </div>

  <div class="mac__reka" id="panel-reka" role={telefon ? 'tabpanel' : undefined} aria-labelledby={telefon ? 'tab-reka' : undefined}>
    <Reka lide={vstup.lide} vztahy={vstup.vztahy} {mista} {rok} {okno} vybrany={osobaId} {telefon} onvyber={(id) => vyber(id, 'reka')} />
  </div>

  <aside class="mac__karta" id="panel-karta" role={telefon ? 'tabpanel' : undefined} aria-labelledby={telefon ? 'tab-clovek' : undefined} aria-label={telefon ? undefined : 'Karta člověka'}>
    <KartaCloveka
      {osoba}
      {rok}
      lide={vstup.lide}
      {podleId}
      vztahy={vstup.vztahy}
      {mista}
      udalosti={vstup.udalosti}
      obdobi={vstup.obdobi}
      {zijici}
      srovnat={srovnatId}
      onvyber={(id) => vyber(id, 'karta')}
      onsrovnat={(id) => {
        srovnatId = id;
        zapisAdresy('push');
      }}
      onzavrit={zavrit}
      {zastavky}
      {prehrava}
      mohuPrehrat={!omezitPohyb}
      onprehrat={prehrat}
      onzastavit={() => zastavPrehravani()}
      onzastavka={naZastavku}
    />
  </aside>
</div>

<style>
  .mac {
    --zlab: 208px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 408px;
    grid-template-rows: 44px minmax(240px, 1fr) 72px clamp(196px, calc(100dvh - var(--hlavicka) - 44px - 72px - 400px), 296px);
    grid-template-areas:
      'pas karta'
      'mapa karta'
      'posuvnik karta'
      'reka karta';
    height: calc(100dvh - var(--hlavicka) - 1px);
    min-height: 560px;
    background: var(--paper);
  }
  .mac__pas { grid-area: pas; padding: 8px var(--s-4) 0 var(--s-4); }
  .mac__mapa { grid-area: mapa; position: relative; min-height: 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .mac__posuvnik { grid-area: posuvnik; background: var(--surface); }
  .mac__reka { grid-area: reka; min-height: 0; background: var(--surface); border-top: 1px solid var(--rule); }
  .mac__karta { grid-area: karta; min-height: 0; overflow-y: auto; background: var(--surface); border-left: 1px solid var(--rule); scrollbar-width: thin; }
  .mac__zalozky { display: none; }

  .mezitim {
    position: absolute;
    right: var(--s-3);
    bottom: var(--s-3);
    max-width: 260px;
    padding: var(--s-2) var(--s-3);
    border-radius: var(--r-sm);
    background: color-mix(in srgb, var(--surface) 95%, transparent);
    box-shadow: var(--stin-mapa), 0 0 0 1px var(--rule);
    font-family: var(--font-sans);
  }
  .mezitim__nadpis { margin: 0 0 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .mezitim ul { margin: 0; padding: 0; list-style: none; }
  .mezitim button { display: flex; align-items: center; gap: 8px; padding: 2px 0; border: 0; background: none; text-align: left; font-size: 14px; line-height: 1.25; cursor: pointer; }
  .mezitim small { display: block; font-size: 12px; color: var(--muted); }
  .mezitim button:hover strong { text-decoration: underline; }

  @media (max-width: 1100px) and (min-width: 900px) {
    .mac { --zlab: 176px; grid-template-columns: minmax(0, 1fr) 360px; }
  }
  @media (max-width: 899px) {
    .mac {
      --zlab: 16px;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: 40px 300px 76px 44px minmax(0, 1fr);
      grid-template-areas: 'pas' 'mapa' 'posuvnik' 'zalozky' 'list';
      height: calc(100dvh - var(--hlavicka) - var(--spodni-lista) - env(safe-area-inset-bottom));
      min-height: 520px;
    }
    .mac[data-zalozka='reka'] { grid-template-rows: 40px 200px 76px 44px minmax(0, 1fr); }
    .mac__pas { padding: 6px var(--s-3) 0; }
    .mac__zalozky {
      grid-area: zalozky;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--surface);
      border-top: 1px solid var(--rule);
      box-shadow: var(--stin-list);
      border-radius: var(--r-md) var(--r-md) 0 0;
      z-index: 2;
    }
    .mac__zalozky button {
      min-height: 44px;
      padding: 0 var(--s-3);
      border: 0;
      border-bottom: 2px solid transparent;
      background: none;
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 600;
      color: var(--muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .mac__zalozky button[aria-selected='true'] { color: var(--ink); border-bottom-color: var(--pc); }
    .mac__reka, .mac__karta { grid-area: list; border: 0; }
    .mac[data-zalozka='clovek'] .mac__reka { display: none; }
    .mac[data-zalozka='reka'] .mac__karta { display: none; }
    .mac__posuvnik { --posuvnik-rok: 22px; border-top: 1px solid var(--rule); }
    .mezitim { right: var(--s-2); bottom: var(--s-2); max-width: 200px; padding: 6px 10px; }
  }
</style>
