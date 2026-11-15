<script lang="ts">
  // Mapa Mapy a času jako výstřižek staré mapy přilepený páskou (design-v2, K7a; plátno MapaCas):
  // moře šrafované tužkou, vodní linky podél pobřeží, pevnina na lístkovém papíře, dvojitý rámeček se stupnicí,
  // názvy moří kurzívou a krajů prostrkaně, větrná růžice a měřítko. Ve tmě týž výstřižek v noci (jen tokeny).
  // Lidé, kteří ve zvoleném roce žijí, jsou na přišpendlených lístečcích: jeden lísteček na místo, na něm rukou
  // název a počet lidí. Klepnutí lísteček rozvine (jména, u potkaných razítko) a ukáže, co tu bylo dřív.
  // Lístečky se při posunu roku objeví a zmizí; rozmístění bez překryvů je v src/lib/mapa-listky.ts.
  // Kdo je mimo výřez, má lísteček se šipkou u okraje. Při změně období se kamera plynule přesune.
  // Přepínač „Ukázat i ty, na které někdo navazuje“ (dřív Stín odkazu) má vedle sebe „?“ s vysvětlením.
  import { onMount, onDestroy, untrack } from 'svelte';
  import type { PodkladObdobi } from '../../lib/mapa';
  import type { OsobaV, MistoV, UdalostV } from '../../lib/mapa-vstup';
  import { kdeVRoce, odkudPrisla, vekVRoce, zivotOsoby, poznamkaVRoce, let_ } from '../../lib/cas-mapy';
  import { rok as rokText } from '../../lib/casy';
  import { rozmistiListky, sirkaListku, coTuBylo, razitkoOsoby, SPENDLIK, type Roh, type Umisteni } from '../../lib/mapa-listky';
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';

  interface Props {
    podklad: PodkladObdobi | null;
    lide: OsobaV[];
    /** všichni lidé z atlasu (pro „Tady dřív“) */
    vsichni: OsobaV[];
    udalosti: UdalostV[];
    stinLide: OsobaV[];
    mista: Map<string, MistoV>;
    rok: number;
    vybrany?: string;
    stin: boolean;
    /** přepínač navazujících jen v úplné mapě (po „Víc“) */
    vic: boolean;
    potkani: Set<string>;
    telefon: boolean;
    zprava: string | null;
    omezitPohyb: boolean;
    onvyber: (id: string) => void;
    onstin: (zapnout: boolean) => void;
  }
  let { podklad, lide, vsichni, udalosti, stinLide, mista, rok, vybrany, stin, vic, potkani, telefon, zprava, omezitPohyb, onvyber, onstin }: Props = $props();

  type Obdelnik = { x: number; y: number; w: number; h: number };

  let sirka = $state(0);
  let vyska = $state(0);

  // ── Kamera ─────────────────────────────────────────────────────────────────
  let zobrazeny: PodkladObdobi | null = $state(null);
  let odchazejici: PodkladObdobi | null = $state(null);
  let vbZobrazeny: Obdelnik | null = $state(null);
  let vbOdchazejici: Obdelnik | null = $state(null);
  let prechod = $state(0); // 0 = klid, (0,1) = kamera jede
  let animace = 0;

  function viditelny(p: PodkladObdobi): Obdelnik {
    if (!sirka || !vyska) return { x: 0, y: 0, w: p.sirka, h: p.vyska };
    const a = sirka / vyska;
    if (a > p.sirka / p.vyska) {
      const h = p.sirka / a;
      return { x: 0, y: (p.vyska - h) / 2, w: p.sirka, h };
    }
    const w = p.vyska * a;
    return { x: (p.sirka - w) / 2, y: 0, w, h: p.vyska };
  }
  const doStarych = (r: Obdelnik, t: [number, number, number]): Obdelnik => ({ x: (r.x - t[1]) / t[0], y: (r.y - t[2]) / t[0], w: r.w / t[0], h: r.h / t[0] });
  const doNovych = (r: Obdelnik, t: [number, number, number]): Obdelnik => ({ x: r.x * t[0] + t[1], y: r.y * t[0] + t[2], w: r.w * t[0], h: r.h * t[0] });
  const mezi = (a: Obdelnik, b: Obdelnik, k: number): Obdelnik => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k });
  const plynule = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

  $effect(() => {
    const novy = podklad;
    if (!novy) return;
    untrack(() => zmenaPodkladu(novy));
  });
  function zmenaPodkladu(novy: PodkladObdobi) {
    const cil = viditelny(novy);
    const stary = zobrazeny;
    if (!stary || stary === novy || stary.druh !== novy.druh || stary.obdobi === novy.obdobi || omezitPohyb || !stary.prevody[novy.obdobi]) {
      cancelAnimationFrame(animace);
      zobrazeny = novy;
      odchazejici = null;
      vbZobrazeny = cil;
      prechod = 0;
      return;
    }
    // Plynulý přesun (--d-kamera): starý podklad jede ke svému obrazu nového výřezu, nový ze svého obrazu starého.
    const t = stary.prevody[novy.obdobi];
    const odStary = vbZobrazeny ?? viditelny(stary);
    const doStary = doStarych(cil, t);
    const odNovy = doNovych(odStary, t);
    odchazejici = stary;
    zobrazeny = novy;
    const zacatek = performance.now();
    const delka = 700;
    cancelAnimationFrame(animace);
    const krok = (ted: number) => {
      const k = Math.min(1, (ted - zacatek) / delka);
      const e = plynule(k);
      vbOdchazejici = mezi(odStary, doStary, e);
      vbZobrazeny = mezi(odNovy, cil, e);
      prechod = k === 1 ? 0 : Math.max(0.001, k);
      if (k < 1) animace = requestAnimationFrame(krok);
      else odchazejici = null;
    };
    prechod = 0.001;
    animace = requestAnimationFrame(krok);
  }
  // Změna velikosti bez přechodu.
  $effect(() => {
    void sirka;
    void vyska;
    untrack(() => {
      if (zobrazeny && !prechod) vbZobrazeny = viditelny(zobrazeny);
    });
  });
  onDestroy(() => {
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(animace);
  });

  let vb = $derived(vbZobrazeny ?? (zobrazeny ? viditelny(zobrazeny) : { x: 0, y: 0, w: 1032, h: 456 }));
  let meritkoObrazovky = $derived(sirka ? vb.w / sirka : 1);
  const vbText = (r: Obdelnik) => `${r.x.toFixed(1)} ${r.y.toFixed(1)} ${r.w.toFixed(1)} ${r.h.toFixed(1)}`;

  // ── Lidé na mapě: jeden lísteček na místo ─────────────────────────────────
  const priorita = (o: OsobaV) => ({ portret: 0, profil: 1, medailonek: 2 })[o.hloubka];
  type Misto = { misto: string; x: number; y: number; lide: OsobaV[]; uvnitr: boolean };

  let klid = $derived(!prechod && zobrazeny);
  let znacky = $derived.by((): Misto[] => {
    if (!zobrazeny) return [];
    const p = zobrazeny;
    const podleMista = new Map<string, OsobaV[]>();
    for (const o of lide) {
      const kde = kdeVRoce(o, rok);
      if (!kde || !p.mista[kde.misto]) continue;
      const s = podleMista.get(kde.misto) ?? [];
      s.push(o);
      podleMista.set(kde.misto, s);
    }
    return [...podleMista].map(([misto, l]) => {
      const [x, y] = p.mista[misto];
      l.sort((a, b) => priorita(a) - priorita(b) || a.jmeno.localeCompare(b.jmeno, 'cs'));
      const fx = (x - vb.x) / vb.w;
      const fy = (y - vb.y) / vb.h;
      return { misto, x: fx, y: fy, lide: l, uvnitr: fx > 0.02 && fx < 0.98 && fy > 0.03 && fy < 0.97 };
    });
  });
  let uvnitr = $derived(znacky.filter((z) => z.uvnitr));

  // Šířka zavřeného lístečku změřená písmem Kalam (název a počet); do načtení písma odhad.
  let mereni: CanvasRenderingContext2D | null = null;
  let pismoPripraveno = $state(0);
  onMount(() => {
    mereni = document.createElement('canvas').getContext('2d');
    pismoPripraveno += 1;
    document.fonts?.ready.then(() => (pismoPripraveno += 1));
  });
  function sirkaZavreneho(nazev: string, pocet: number) {
    void pismoPripraveno;
    if (!mereni) return sirkaListku(nazev, pocet, telefon);
    mereni.font = `700 ${telefon ? 14 : 17}px Kalam, cursive`;
    const nazevW = mereni.measureText(nazev).width;
    mereni.font = `600 12px 'Instrument Sans', sans-serif`;
    const pocetW = mereni.measureText(String(pocet)).width;
    // okraje: špendlík (24–26 px), mezera 10 px, kraj 10–12 px a kousek rezervy na natočení
    return Math.max(telefon ? 84 : 104, Math.ceil(nazevW + pocetW + (telefon ? 48 : 52)));
  }
  const vyskaZavreneho = $derived(telefon ? 44 : 36);

  // Překážky pro lístečky: lístečky lidí mimo výřez, přepínač navazujících nahoře a růžice s měřítkem dole.
  let sirkaOvladani = $state(0);
  let prekazky = $derived.by((): [number, number, number, number][] => {
    const out: [number, number, number, number][] = okraj.map((z) => {
      const x = z.ex * sirka;
      const y = z.ey * vyska;
      const text = `${z.lide[0].jmeno}${z.lide.length > 1 ? ` +${z.lide.length - 1}` : ''}`;
      // šipka 14 px, mezery a okraje 26 px, text Kalamem 15 px (do načtení písma odhad)
      void pismoPripraveno;
      let tw = text.length * 8;
      if (mereni) { mereni.font = '700 15px Kalam, cursive'; tw = mereni.measureText(text).width; }
      const w = tw + 42;
      return [x - w / 2, y - 18, x + w / 2, y + 18];
    });
    // Vybledlá razítka navazujících leží vlevo nad místem smrti (22 px).
    for (const s of stiny) {
      const x = s.x * sirka - 30 - s.dx * 16;
      const y = s.y * vyska - 30;
      out.push([x - 2, y - 2, x + 24, y + 24]);
    }
    if (vic && sirkaOvladani) out.push([0, 0, (telefon ? 14 : 18) + sirkaOvladani + 4, (telefon ? 14 : 18) + 36]);
    out.push([0, vyska - (telefon ? 56 : 84), telefon ? 150 : 240, vyska]);
    return out;
  });

  let umisteni = $derived.by((): Map<string, Umisteni> => {
    if (!sirka || !vyska) return new Map();
    // Přednost: na notebooku místo vybraného člověka, na telefonu (malá mapa, vybraného ukazuje karta) místa s nejvíc lidmi.
    const sVybranym = (z: Misto) => Number(!telefon && z.lide.some((o) => o.id === vybrany));
    const serazene = [...uvnitr].sort((a, b) =>
      sVybranym(b) - sVybranym(a) || b.lide.length - a.lide.length || priorita(a.lide[0]) - priorita(b.lide[0]));
    return rozmistiListky(
      serazene.map((z) => ({ id: z.misto, x: z.x * sirka, y: z.y * vyska, w: sirkaZavreneho(mista.get(z.misto)?.nazev ?? '', z.lide.length), h: vyskaZavreneho })),
      sirka, vyska, 16, 4, prekazky, telefon ? 2 : 3,
    );
  });
  // Názvy krajin, které by lísteček zakryl, se ztlumí.
  let zakryteKrajiny = $derived.by(() => {
    const out = new Set<string>();
    if (!zobrazeny || !sirka) return out;
    const boxy = [...umisteni.values()].map((u) => u.box);
    for (const k of zobrazeny.krajiny) {
      const x = ((k.xy[0] - vb.x) / vb.w) * sirka;
      const y = ((k.xy[1] - vb.y) / vb.h) * vyska;
      const w = (k.nazev.length * (k.druh === 'more' ? 7.5 : 9.5)) / 2;
      const box = [x - w, y - 12, x + w, y + (k.dnes ? 14 : 3)];
      if (boxy.some((o) => box[0] < o[2] && box[2] > o[0] && box[1] < o[3] && box[3] > o[1])) out.add(k.id);
    }
    return out;
  });

  // Lístečky lidí mimo výřez: u okraje se šipkou ke svému místu.
  let okraj = $derived.by(() => {
    return znacky
      .filter((z) => !z.uvnitr)
      .map((z) => {
        const dx = z.x - 0.5;
        const dy = z.y - 0.5;
        const ax = sirka ? dx * sirka : dx;
        const ay = vyska ? dy * vyska : dy;
        const mx = 0.5 - 80 / Math.max(1, sirka);
        const my = 0.5 - 30 / Math.max(1, vyska);
        const t = Math.min(Math.abs(dx) > 1e-6 ? mx / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-6 ? my / Math.abs(dy) : Infinity);
        return { ...z, ex: 0.5 + dx * t, ey: 0.5 + dy * t, uhel: (Math.atan2(ay, ax) * 180) / Math.PI };
      });
  });

  // Cesty: tečkovaná čára tužkou období z místa, odkud člověk v tomto roce přišel.
  let cesty = $derived.by(() => {
    if (!zobrazeny) return [];
    const p = zobrazeny;
    const out: { id: string; obdobi: number; d: string }[] = [];
    for (const o of lide) {
      const odkud = odkudPrisla(o, rok);
      const kam = kdeVRoce(o, rok)?.misto;
      if (!odkud || !kam || !p.mista[odkud] || !p.mista[kam]) continue;
      const [x1, y1] = p.mista[odkud];
      const [x2, y2] = p.mista[kam];
      const mx = (x1 + x2) / 2 - (y2 - y1) * 0.18;
      const my = (y1 + y2) / 2 + (x2 - x1) * 0.18;
      out.push({ id: o.id, obdobi: o.obdobi, d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}` });
    }
    return out;
  });

  // Navazující: zesnulí vybledle (razítko bez obvodu) v místě, kde zemřeli.
  let stiny = $derived.by(() => {
    if (!zobrazeny || !stin) return [];
    const p = zobrazeny;
    return stinLide
      .map((o) => {
        const z = zivotOsoby(o)!;
        const kde = kdeVRoce(o, z.do)?.misto;
        if (!kde || !p.mista[kde]) return null;
        const [x, y] = p.mista[kde];
        const fx = (x - vb.x) / vb.w;
        const fy = (y - vb.y) / vb.h;
        if (fx < 0.02 || fx > 0.98 || fy < 0.03 || fy > 0.97) return null;
        return { o, x: fx, y: fy, dx: 0 };
      })
      .filter((s): s is NonNullable<typeof s> => !!s)
      .map((s, i, vse) => ({ ...s, dx: vse.slice(0, i).filter((t) => Math.abs(t.x - s.x) < 0.01 && Math.abs(t.y - s.y) < 0.02).length }));
  });

  // ── Otevřený lísteček ──────────────────────────────────────────────────────
  // Na notebooku je lísteček vybraného člověka otevřený, na telefonu jsou všechny zavřené (cíle 44 px).
  let otevreny: string | null = $state(null);
  // Lísteček vybraného člověka se na notebooku otevře při výběru a při posunu roku jde s ním na nové místo.
  let mistoVybraneho = $derived.by(() => {
    const m = vybrany ? lide.find((o) => o.id === vybrany) : undefined;
    return m ? kdeVRoce(m, rok)?.misto : undefined;
  });
  $effect(() => {
    const kde = mistoVybraneho;
    untrack(() => {
      if (!telefon && kde) otevreny = kde;
    });
  });
  $effect(() => {
    const u = uvnitr;
    untrack(() => {
      if (zobrazeny && otevreny && !u.some((z) => z.misto === otevreny)) otevreny = null;
    });
  });
  function prepni(misto: string) {
    otevreny = otevreny === misto ? null : misto;
  }
  function vyberZListku(id: string) {
    onvyber(id);
    if (telefon) otevreny = null;
  }
  const dalsiZMista = (misto: string) => coTuBylo(misto, rok, vsichni, udalosti);

  // Vysvětlení přepínače navazujících: říká, co dělá stinOdkazu v src/lib/cas-mapy.ts.
  let vysvetleni = $state(false);
  let tlVysvetleni: HTMLButtonElement | undefined = $state();
  function klepnuti(e: PointerEvent) {
    const t = e.target as Element | null;
    if (vysvetleni && !t?.closest?.('.stin-ovladani')) vysvetleni = false;
    if (telefon && otevreny && !t?.closest?.('.listek')) otevreny = null;
  }
  function klavesa(e: KeyboardEvent) {
    if (e.key === 'Escape' && vysvetleni) {
      vysvetleni = false;
      tlVysvetleni?.focus();
      return;
    }
    if (e.key === 'Escape' && otevreny) {
      const m = otevreny;
      otevreny = null;
      (document.querySelector(`[data-listek="${m}"] .listek__hlava`) as HTMLElement | null)?.focus();
    }
  }
  const vekKratce = (o: OsobaV) => {
    const v = vekVRoce(o, rok);
    return v === null ? '' : `${o.narozen?.priblizne ? 'asi ' : ''}${let_(v)}`;
  };
  const lidi = (n: number) => (n === 1 ? 'člověk' : n < 5 ? 'lidé' : 'lidí');

  // Lísteček se objeví a zmizí s posunem roku (--d-listek, --k-papir); při omezeném pohybu je tam hned.
  function listekPrichod(_uzel: Element) {
    const d = omezitPohyb ? 0 : 240;
    return {
      duration: d,
      css: (t: number) => `opacity:${t};transform:translateY(${(1 - t) * -6}px) rotate(var(--r)) scale(${0.92 + 0.08 * t})`,
    };
  }
  function listekOdchod(_uzel: Element) {
    return { duration: omezitPohyb ? 0 : 160, css: (t: number) => `opacity:${t}` };
  }
  // Natočení lístečku podle místa (−3° až +3°), stejné při každém vykreslení.
  const natoceni = (id: string) => {
    let h = 0;
    for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
    return ((Math.abs(h) % 61) - 30) / 10;
  };
  const vpravo = (r: Roh) => r === 'pd' || r === 'pn';
  const dolu = (r: Roh) => r === 'pd' || r === 'ld';
</script>

<svelte:window onkeydown={klavesa} onpointerdown={klepnuti} />

<div class="vystrizek" class:vystrizek--kamera={!!prechod}>
  <span class="paska paska--vlevo" aria-hidden="true"></span>
  <span class="paska paska--vpravo" aria-hidden="true"></span>
  <div class="mapa" bind:clientWidth={sirka} bind:clientHeight={vyska} style:--k={meritkoObrazovky}>
    {#if odchazejici && vbOdchazejici}
      {@render podkladSvg(odchazejici, vbOdchazejici, 1 - Math.min(1, Math.max(0, (prechod - 0.35) / 0.4)), [])}
    {/if}
    {#if zobrazeny}
      {@render podkladSvg(zobrazeny, vb, odchazejici ? Math.min(1, Math.max(0, (prechod - 0.35) / 0.4)) : 1, klid ? cesty : [])}
    {/if}

    <svg class="ram" aria-hidden="true">
      <rect class="ram__vnejsi" x="5" y="5" />
      <rect class="ram__stupnice" x="8" y="8" />
      <rect class="ram__vnitrni" x="10.5" y="10.5" />
    </svg>

    {#if zobrazeny}
      <span class="ruzice" aria-hidden="true">
        <svg viewBox="0 0 56 56"><circle cx="28" cy="30" r="17" fill="none" stroke="currentColor" stroke-width="1" /><path d="M28 9 32 30 28 51 24 30Z" fill="none" stroke="currentColor" stroke-width="1.2" /><path d="M28 9 32 30H24Z" fill="currentColor" /><path d="M7 30 28 26 49 30 28 34Z" fill="none" stroke="currentColor" stroke-width="1" /><text x="28" y="7" text-anchor="middle" font-size="9" font-weight="600" fill="currentColor">S</text></svg>
      </span>
      <div class="meritko" aria-hidden="true">
        <span class="meritko__cara" style:width="{zobrazeny.meritko.px / meritkoObrazovky}px"></span>
        <span>{zobrazeny.meritko.km} km · Natural Earth</span>
      </div>
    {/if}

    {#if klid}
      <div class="vrstva" role="group" aria-label="Lidé na mapě v roce {rokText(rok)}">
        <svg class="nite" aria-hidden="true">
          {#each uvnitr as z (z.misto)}
            {@const u = umisteni.get(z.misto)}
            {#if u && u.posun && otevreny !== z.misto}
              {@const px = vpravo(u.roh) ? u.box[0] + SPENDLIK[0] : u.box[2] - SPENDLIK[0]}
              {@const py = dolu(u.roh) ? u.box[1] + SPENDLIK[1] : u.box[3] - SPENDLIK[1]}
              <line x1={z.x * sirka} y1={z.y * vyska} x2={px} y2={py} />
              <circle cx={z.x * sirka} cy={z.y * vyska} r="2.5" />
            {/if}
          {/each}
        </svg>

        {#each stiny as s (s.o.id)}
          <button
            type="button"
            class="stin"
            style:left="{s.x * 100}%"
            style:top="{s.y * 100}%"
            style:translate="{-30 - s.dx * 16}px -30px"
            aria-label="{s.o.jmeno}, {poznamkaVRoce(s.o, rok)}"
            title="{s.o.jmeno} · {poznamkaVRoce(s.o, rok)}"
            onclick={() => onvyber(s.o.id)}
          >
            <RazitkoCloveka razitko={razitkoOsoby(s.o, mista)} obdobi={s.o.obdobi} velikost={22} />
          </button>
        {/each}

        {#each uvnitr as z (z.misto)}
          {@const u = umisteni.get(z.misto)}
          {#if u}
            {@const sel = z.lide.some((o) => o.id === vybrany)}
            {@const otevren = otevreny === z.misto}
            {@const nazev = mista.get(z.misto)?.nazev ?? ''}
            {@const drive = otevren ? dalsiZMista(z.misto) : null}
            {#if u.jenSpendlik && !otevren}
              <!-- Lísteček se k místu nevešel: jen špendlík, po klepnutí se lísteček rozvine nad ostatní. -->
              <button
                type="button"
                class="jen-spendlik obdobi-{z.lide[0].obdobi}"
                class:jen-spendlik--vybrany={sel}
                data-listek={z.misto}
                style:left="{z.x * sirka}px"
                style:top="{z.y * vyska}px"
                aria-expanded="false"
                aria-label="{nazev}: {z.lide.length} {lidi(z.lide.length)}{sel ? ', je tu vybraný člověk' : ''}"
                onclick={() => prepni(z.misto)}
                in:listekPrichod
                out:listekOdchod
              ><span class="spendlik" aria-hidden="true"></span></button>
            {:else}
            {@const px = z.x * sirka}
            {@const py = z.y * vyska}
            {@const nahoru = otevren ? z.y > 0.5 : !dolu(u.roh)}
            {@const doleva = otevren ? !vpravo(u.roh) || px > sirka - 150 : !vpravo(u.roh)}
            <!-- Otevřený lísteček visí přímo na špendlíku a roste tam, kde je víc místa; co se nevejde, posune se v něm. -->
            <div
              class="listek obdobi-{z.lide[0].obdobi}"
              class:listek--vybrany={sel}
              class:listek--otevren={otevren}
              class:listek--vlevo={doleva}
              class:listek--nahoru={nahoru}
              data-listek={z.misto}
              style:left={otevren ? (doleva ? undefined : `${px - SPENDLIK[0]}px`) : vpravo(u.roh) ? `${u.box[0]}px` : undefined}
              style:right={otevren ? (doleva ? `${sirka - px - SPENDLIK[0]}px` : undefined) : vpravo(u.roh) ? undefined : `${sirka - u.box[2]}px`}
              style:top={otevren ? (nahoru ? undefined : `${py - SPENDLIK[1]}px`) : dolu(u.roh) ? `${u.box[1]}px` : undefined}
              style:bottom={otevren ? (nahoru ? `${vyska - py - SPENDLIK[1]}px` : undefined) : dolu(u.roh) ? undefined : `${vyska - u.box[3]}px`}
              style:--max-v={otevren ? `${Math.max(120, (nahoru ? py + SPENDLIK[1] : vyska - py + SPENDLIK[1]) - 18)}px` : undefined}
              style:--max-s={otevren ? `${Math.max(150, (doleva ? px + SPENDLIK[0] : sirka - px + SPENDLIK[0]) - 18)}px` : undefined}
              style:--r="{natoceni(z.misto)}deg"
              style:--w="{u.box[2] - u.box[0]}px"
              in:listekPrichod
              out:listekOdchod
            >
              <span class="spendlik" aria-hidden="true"></span>
              <button
                type="button"
                class="listek__hlava"
                aria-expanded={otevren}
                aria-controls="listek-{z.misto}"
                aria-label="{nazev}: {z.lide.length} {lidi(z.lide.length)}{sel ? ', je tu vybraný člověk' : ''}"
                onclick={() => prepni(z.misto)}
              >
                <span class="listek__nazev">{nazev}</span>
                <span class="listek__pocet">{z.lide.length}</span>
              </button>
              {#if otevren}
                <div class="listek__telo" class:rozlozit={!omezitPohyb} id="listek-{z.misto}">
                  <ul class="listek__lide" aria-label="Lidé v místě {nazev}">
                    {#each z.lide as o (o.id)}
                      {@const potkal = potkani.has(o.id)}
                      <li>
                        <button
                          type="button"
                          class="listek__clovek"
                          aria-pressed={o.id === vybrany}
                          aria-label="{o.jmeno}{vekKratce(o) ? `, ${vekKratce(o)}` : ''}{potkal ? ', razítko ve sbírce' : ''}"
                          onclick={() => vyberZListku(o.id)}
                        >
                          {#if potkal}<RazitkoCloveka razitko={razitkoOsoby(o, mista)} obdobi={o.obdobi} velikost={22} />{/if}
                          <span>{o.jmeno}</span>
                        </button>
                      </li>
                    {/each}
                  </ul>
                  {#if drive && (drive.drive.length || drive.udalosti.length)}
                    <div class="listek__drive">
                      <p class="listek__nadpis">Tady dřív</p>
                      {#if drive.udalosti.length}
                        <ul class="listek__udalosti">
                          {#each drive.udalosti.slice(0, 2) as d (d.id)}
                            <li>{d.nazev}, {rokText(d.od)}</li>
                          {/each}
                        </ul>
                      {/if}
                      {#if drive.drive.length}
                        <p class="listek__dalsi">
                          {#each drive.drive.slice(0, 4) as o, i (o.id)}{#if i > 0}{', '}{/if}<button type="button" class="listek__odkaz" onclick={() => vyberZListku(o.id)}>{o.jmeno}</button>{/each}{#if drive.drive.length > 4}{` a další ${drive.drive.length - 4}`}{/if}
                        </p>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
            {/if}
          {/if}
        {/each}

        {#each okraj as z (z.misto)}
          <button
            type="button"
            class="okraj obdobi-{z.lide[0].obdobi}"
            class:okraj--vybrany={z.lide.some((o) => o.id === vybrany)}
            style:left="{z.ex * 100}%"
            style:top="{z.ey * 100}%"
            aria-label="Mimo výřez: {z.lide.map((o) => o.jmeno).join(', ')} ({mista.get(z.misto)?.nazev})"
            onclick={() => onvyber(z.lide.find((o) => o.id === vybrany)?.id ?? z.lide[0].id)}
          >
            <svg class="okraj__sipka" width="14" height="14" viewBox="0 0 14 14" style:rotate="{z.uhel}deg" aria-hidden="true"><path d="M2 7h9M7 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span>{z.lide[0].jmeno}{z.lide.length > 1 ? ` +${z.lide.length - 1}` : ''}</span>
          </button>
        {/each}
      </div>
    {/if}

    {#if vic}
      <div class="stin-ovladani" bind:offsetWidth={sirkaOvladani}>
        <label class="prepinac-stinu">
          <input type="checkbox" checked={stin} onchange={(e) => onstin((e.currentTarget as HTMLInputElement).checked)} />
          <span>Ukázat i ty, na které někdo navazuje</span>
        </label>
        <button
          type="button"
          class="stin-otazka"
          bind:this={tlVysvetleni}
          aria-expanded={vysvetleni}
          aria-controls="stin-vysvetleni"
          aria-label="Koho to ukáže?"
          onclick={() => (vysvetleni = !vysvetleni)}
        >?</button>
        <div class="stin-vysvetleni" id="stin-vysvetleni" role="status">
          {#if vysvetleni}
            <p>Kdo zemřel, z mapy zmizí. Takhle tam vybledle zůstane, dokud žije někdo, kdo ho znal, četl, učil se u něj nebo se s ním přel.</p>
          {/if}
        </div>
      </div>
    {/if}

    <div class="zprava" role="status" aria-live="polite">
      {#if zprava}<p>{zprava}</p>{/if}
    </div>
  </div>
</div>

{#snippet podkladSvg(p: PodkladObdobi, r: Obdelnik, pruhlednost: number, cesty: { id: string; obdobi: number; d: string }[])}
  <svg class="podklad" viewBox={vbText(r)} preserveAspectRatio="xMidYMid slice" style:opacity={pruhlednost} role="img" aria-label="Mapa: {p.popis}">
    <defs><path id="pevnina-{p.obdobi}-{p.druh}" d={p.pevnina} /></defs>
    <!-- Vodní linky: tři tahy tužkou podél pobřeží, mezi nimi papír moře (plátno MapaCas › .k-vl, .k-mz). -->
    <use href="#pevnina-{p.obdobi}-{p.druh}" class="linka linka--1" />
    <use href="#pevnina-{p.obdobi}-{p.druh}" class="mezera mezera--1" />
    <use href="#pevnina-{p.obdobi}-{p.druh}" class="linka linka--2" />
    <use href="#pevnina-{p.obdobi}-{p.druh}" class="mezera mezera--2" />
    <use href="#pevnina-{p.obdobi}-{p.druh}" class="linka linka--3" />
    <use href="#pevnina-{p.obdobi}-{p.druh}" class="mezera mezera--3" />
    <use href="#pevnina-{p.obdobi}-{p.druh}" class="pevnina" />
    {#each p.krajiny as k (k.id)}
      <text x={k.xy[0]} y={k.xy[1]} class="krajina krajina--{k.druh}" class:krajina--zakryta={zakryteKrajiny.has(k.id)} text-anchor="middle">
        {k.druh === 'more' ? k.nazev : k.nazev.toLocaleUpperCase('cs')}
        {#if k.dnes}<tspan x={k.xy[0]} dy="1.25em" class="krajina__dnes">({k.dnes})</tspan>{/if}
      </text>
    {/each}
    {#each cesty as c (c.id)}
      <path d={c.d} class="cesta obdobi-{c.obdobi}" />
    {/each}
  </svg>
{/snippet}

<style>
  /* Výstřižek: list papíru s okrajem, přilepený dvěma páskami; uvnitř mapa v rámečku. Neotáčí se, aby ručně
     kreslené popisky zůstaly ostré a dotykové cíle seděly. */
  .vystrizek { position: relative; width: 100%; height: 100%; padding: 10px; background: var(--list); box-shadow: var(--lezi); }
  .vystrizek > .paska { z-index: 25; width: 110px; height: 28px; }
  .vystrizek > .paska--vlevo { top: -9px; left: -22px; }
  .vystrizek > .paska--vpravo { top: -8px; right: -24px; }
  .mapa {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* Moře šrafované tužkou: vodorovné tahy po 7 px na papíře listu. */
    background:
      repeating-linear-gradient(0deg, color-mix(in srgb, var(--tuzka) 38%, transparent) 0 0.7px, transparent 0.7px 7px),
      var(--list);
    font-family: var(--font-sans);
    contain: strict;
  }
  .podklad { position: absolute; inset: 0; width: 100%; height: 100%; }
  .linka { fill: none; stroke: var(--tuzka); stroke-linejoin: round; }
  .mezera { fill: none; stroke: var(--list); stroke-linejoin: round; }
  .linka--1 { stroke-width: calc(30px * var(--k)); opacity: 0.16; }
  .mezera--1 { stroke-width: calc(25px * var(--k)); }
  .linka--2 { stroke-width: calc(19px * var(--k)); opacity: 0.24; }
  .mezera--2 { stroke-width: calc(14.5px * var(--k)); }
  .linka--3 { stroke-width: calc(9px * var(--k)); opacity: 0.34; }
  .mezera--3 { stroke-width: calc(5.5px * var(--k)); }
  .pevnina { fill: var(--listek); stroke: var(--ink-2); stroke-width: calc(1.2px * var(--k)); stroke-linejoin: round; }
  .krajina { font-family: var(--font-sans); font-size: calc(11px * var(--k)); font-weight: 500; letter-spacing: 0.18em; fill: var(--ink-3); }
  .krajina--more { font-family: var(--font-serif); font-style: italic; font-size: calc(16px * var(--k)); font-weight: 400; letter-spacing: 0.08em; fill: var(--ink-2); }
  .krajina--zakryta { opacity: 0.3; }
  .krajina__dnes { font-family: var(--font-sans); font-style: normal; font-size: calc(11px * var(--k)); font-weight: 500; letter-spacing: 0.02em; text-transform: none; }
  .cesta { fill: none; stroke: var(--p); stroke-width: calc(2px * var(--k)); stroke-dasharray: calc(1px * var(--k)) calc(5px * var(--k)); stroke-linecap: round; }

  /* Dvojitý rámeček se stupnicí (plátno: .k-ram, .k-stup). */
  .ram { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 4; pointer-events: none; fill: none; stroke: var(--ink-2); }
  .ram rect { width: calc(100% - 2 * var(--x, 5px)); height: calc(100% - 2 * var(--x, 5px)); }
  .ram__vnejsi { --x: 5px; stroke-width: 1.4; }
  .ram__stupnice { --x: 8px; stroke-width: 3; stroke-dasharray: 26 26; }
  .ram__vnitrni { --x: 10.5px; stroke-width: 0.7; }

  .ruzice { position: absolute; left: 22px; bottom: 22px; z-index: 3; width: 56px; height: 56px; color: var(--ink-2); pointer-events: none; }
  .ruzice svg { width: 100%; height: 100%; font-family: var(--font-sans); }
  .meritko {
    position: absolute;
    left: 92px;
    bottom: 26px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: var(--fs-popisek);
    color: var(--ink-2);
    pointer-events: none;
  }
  .meritko__cara { height: 6px; border: 1.2px solid var(--ink-2); background: linear-gradient(90deg, var(--ink-2) 0 50%, var(--list) 50% 100%); }

  .vrstva { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
  .vrstva > :not(.nite) { pointer-events: auto; }
  .nite { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .nite line { stroke: var(--tuzka); stroke-width: 1.2; stroke-dasharray: 2 3; }
  .nite circle { fill: var(--ink-2); }

  /* Lísteček (post-it) přišpendlený na místo: horní lepicí proužek, špendlík v papíru období. */
  .listek {
    position: absolute;
    z-index: 2;
    /* Zavřený lísteček má šířku z rozmístění (src/lib/mapa-listky.ts), otevřený roste podle jmen. */
    width: var(--w);
    background: linear-gradient(180deg, color-mix(in srgb, var(--ink) 5%, var(--listek)) 0 9px, var(--listek) 9px);
    box-shadow: var(--lezi);
    border-radius: 1px 1px 6px 1px;
    transform: rotate(var(--r));
    transform-origin: 13px 11px;
    transition: box-shadow var(--d-stisk) var(--k-stisk);
  }
  .listek--vlevo { transform-origin: calc(100% - 13px) 11px; }
  .listek--nahoru { transform-origin: 13px calc(100% - 11px); }
  .listek--vlevo.listek--nahoru { transform-origin: calc(100% - 13px) calc(100% - 11px); }
  .listek--vybrany { z-index: 3; }
  .listek--otevren { z-index: 6; display: flex; flex-direction: column; width: max-content; min-width: min(var(--w), var(--max-s)); max-width: var(--max-s); max-height: var(--max-v); }
  /* Co se do otevřeného lístečku nevejde, posune se v něm; okraj vyblední jen v odsazení, takže při plném
     obsahu naznačí, že jména pokračují, a krátký seznam nezasáhne. */
  .listek--otevren .listek__telo { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 8px, #000 calc(100% - 10px), transparent); mask-image: linear-gradient(180deg, transparent 0, #000 8px, #000 calc(100% - 10px), transparent); }
  .listek--otevren.listek--nahoru .listek__hlava { order: 2; }
  .listek--otevren.listek--nahoru .listek__telo { order: 1; padding-top: 12px; }
  @media (hover: hover) { .listek:hover { box-shadow: var(--lezi-zved); } }
  .spendlik {
    position: absolute;
    left: 6px;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 36% 34%, var(--na-papiru) 0 1.6px, var(--pp) 3.2px);
    box-shadow: 2px 3px 3px color-mix(in srgb, var(--ink) 38%, transparent);
    pointer-events: none;
  }
  .listek--vlevo .spendlik { left: auto; right: 6px; }
  .listek--nahoru .spendlik { top: auto; bottom: 4px; }
  .listek__hlava {
    display: flex;
    align-items: baseline;
    gap: 10px;
    width: 100%;
    min-height: 36px;
    padding: 10px 12px 6px 26px;
    border: 0;
    background: none;
    color: var(--ink);
    text-align: left;
    cursor: pointer;
  }
  .listek--vlevo .listek__hlava { padding: 10px 26px 6px 12px; }
  .listek__nazev { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-ruka); font-weight: 700; font-size: 17px; line-height: 1.1; white-space: nowrap; }
  .listek--vybrany .listek__nazev { text-decoration: underline; text-decoration-color: var(--p); text-decoration-thickness: 2px; text-underline-offset: 3px; }
  .listek__pocet { margin-left: auto; font-size: 12px; font-weight: 600; line-height: 1; color: var(--p); }
  .listek__hlava:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .listek__telo { padding: 0 10px 10px 22px; }
  .listek--vlevo .listek__telo { padding: 0 22px 10px 10px; }
  .listek__lide { margin: 0; padding: 0; list-style: none; }
  .listek__clovek {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    min-height: 30px;
    padding: 2px 4px;
    border: 0;
    background: none;
    font-family: var(--font-ruka);
    font-size: 16px;
    line-height: 1.2;
    color: var(--ink-2);
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
  }
  @media (hover: hover) { .listek__clovek:hover { color: var(--ink); text-decoration: underline; text-decoration-color: var(--tuzka); text-underline-offset: 3px; } }
  .listek__clovek[aria-pressed='true'] { color: var(--ink); font-weight: 700; text-decoration: underline; text-decoration-color: var(--p); text-decoration-thickness: 2px; text-underline-offset: 3px; }
  .listek__clovek:focus-visible, .listek__odkaz:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }
  .listek__drive { max-width: 220px; margin-top: 6px; padding-top: 6px; border-top: 1px dashed var(--tuzka); font-size: 13px; line-height: 1.35; color: var(--ink-2); }
  .listek__nadpis { margin: 0 0 2px; font-size: var(--fs-nadtitulek); font-weight: 600; letter-spacing: var(--ls-nadtitulek); text-transform: uppercase; color: var(--ink-3); }
  .listek__udalosti { margin: 0 0 2px; padding: 0; list-style: none; }
  .listek__dalsi { margin: 0; }
  .listek__odkaz { padding: 0; border: 0; background: none; color: var(--ink); font: inherit; text-decoration: underline; text-decoration-color: var(--tuzka); text-underline-offset: 3px; cursor: pointer; }

  /* Jen špendlík: dotykový cíl 44 px kolem špendlíku přímo na místě. */
  .jen-spendlik { position: absolute; z-index: 1; width: 44px; height: 44px; margin: -22px 0 0 -22px; padding: 0; border: 0; border-radius: 50%; background: none; cursor: pointer; --r: 0deg; }
  .jen-spendlik .spendlik { left: 15px; top: 15px; }
  .jen-spendlik--vybrany .spendlik { outline: 2px solid var(--p); outline-offset: 2px; }
  /* Prvek s fokusem z klávesnice se vytáhne nad otevřený lísteček, aby fokus byl vidět. */
  .jen-spendlik:focus-visible { z-index: 8; outline: 2px solid var(--ink); outline-offset: -4px; }
  .okraj:focus-visible { z-index: 8; }
  .listek:focus-within { z-index: 7; }
  .stin { position: absolute; z-index: 1; padding: 0; border: 0; background: none; opacity: 0.5; cursor: pointer; }
  @media (hover: hover) { .stin:hover { opacity: 0.9; } }
  .stin:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; opacity: 1; }
  .okraj {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 4px;
    translate: -50% -50%;
    min-height: 32px;
    padding: 4px 10px 4px 8px;
    border: 1.5px dashed var(--tuzka);
    border-radius: 1px;
    background: var(--listek);
    box-shadow: var(--lezi-tlak);
    color: var(--ink);
    font-family: var(--font-ruka);
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
  }
  .okraj__sipka { color: var(--p); flex: none; }
  .okraj--vybrany { border-style: solid; border-color: var(--p); }

  .stin-ovladani {
    position: absolute;
    left: 18px;
    top: 18px;
    z-index: 15;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    max-width: calc(100% - 36px);
    pointer-events: none;
  }
  .stin-ovladani > * { pointer-events: auto; }
  .prepinac-stinu {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    padding: 4px 12px 4px 10px;
    border-radius: var(--r-plne);
    background: var(--papir);
    box-shadow: var(--vtla-mele);
    font-size: 13px;
    font-weight: 500;
    color: var(--ink);
    cursor: pointer;
  }
  .prepinac-stinu input { width: 16px; height: 16px; margin: 0; accent-color: var(--ink); }
  .stin-otazka {
    position: relative;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: var(--r-plne);
    background: var(--plocha);
    box-shadow: var(--vyst-m);
    color: var(--ink);
    font-size: 15px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
  }
  /* Dotykový cíl 44 px kolem tlačítka o průměru 32 px. */
  .stin-otazka::after { content: ''; position: absolute; inset: -6px; }
  .stin-otazka[aria-expanded='true'] { background: var(--papir); box-shadow: var(--vtla); }
  /* Vysvětlení stojí pod přepínačem, nikdy přes něj. */
  .stin-vysvetleni { flex-basis: 100%; }
  .stin-vysvetleni p {
    max-width: 300px;
    margin: 0;
    padding: var(--s-3) var(--s-4);
    background: var(--listek);
    box-shadow: var(--lezi);
    color: var(--ink);
    font-size: var(--fs-ovladani);
    line-height: 1.4;
  }
  .zprava { position: absolute; left: 50%; top: 18px; translate: -50% 0; z-index: 20; pointer-events: none; }
  .zprava p {
    margin: 0;
    padding: 8px 16px;
    border-radius: var(--r-plne);
    background: var(--ink);
    color: var(--na-inkoustu);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: var(--lezi);
  }
  .vystrizek--kamera .prepinac-stinu, .vystrizek--kamera .stin-otazka { opacity: 0.6; }
  @media (max-width: 899px) {
    .vystrizek { padding: 7px; }
    .vystrizek > .paska { width: 80px; height: 22px; top: -8px; }
    .vystrizek > .paska--vlevo { left: -12px; }
    .vystrizek > .paska--vpravo { right: -12px; }
    .ruzice { left: 16px; bottom: 16px; width: 36px; height: 36px; }
    .meritko { left: 60px; bottom: 18px; font-size: var(--fs-popisek); }
    .listek__hlava { min-height: 44px; padding: 12px 10px 6px 24px; }
    .listek--vlevo .listek__hlava { padding: 12px 24px 6px 10px; }
    .listek__nazev { font-size: 14px; }
    .listek__clovek { min-height: 44px; font-size: 15px; }
    .listek__odkaz { min-height: 32px; }
    .stin-ovladani { left: 14px; top: 14px; }
    .prepinac-stinu { font-size: 12px; }
    .zprava { top: auto; bottom: var(--s-6); }
    .zprava p { white-space: normal; text-align: center; max-width: 86vw; }
  }
</style>
