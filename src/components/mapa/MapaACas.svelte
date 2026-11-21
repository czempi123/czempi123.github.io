<script lang="ts">
  // Mapa a čas: mapa, posuvník roku, řeka životů a karta člověka jako jeden nástroj.
  // Stav (rok, období, vybraný člověk, srovnání, stín odkazu) nese adresa, takže jde sdílet a funguje Zpět.
  // Přehrát život (karta člověka, oddíl Život na mapě): rok projede život vybraného člověka a na každé zastávce
  // vteřinu postojí. Adresa se během přehrávání přepisuje; do historie přibude jediný záznam (první posun roku),
  // který na konci nese rok, kde přehrávání skončilo. Zastaví ho jakýkoli zásah do času, jiný člověk i zavření karty.
  // První návštěva (design-v2, K7a): jen mapa, rok a jedna výprava; řeka životů, navazující a přehled všech žijících
  // jsou pod „Víc“ (zapamatuje si localStorage). Kdo přijde odkazem s člověkem nebo se srovnáním, dostane mapu celou.
  // U lidí, které student už potkal (deník: stránky a prošlé cesty), je razítko.
  // Výpravy (herna-v1, K4): lístek s otázkou pro období na pásu, ověření na mapě (vybraný člověk v roce výpravy),
  // razítko „sedí“ a odpověď z dat; rozpracovaná a splněné výpravy si pamatuje localStorage (src/lib/herna/vypravy.ts).
  // Přehrát období (K4): rok projede okno období asi za minutu, Zastavit a Pokračovat; při omezeném pohybu
  // a v Klidném režimu se nic samo nehýbe a student skáče po desetiletích; po Zastavit ukáže totéž a k tomu Pokračovat.
  import { onMount, onDestroy, untrack, tick } from 'svelte';
  import type { PodkladObdobi } from '../../lib/mapa';
  import type { VstupMapy, OsobaV } from '../../lib/mapa-vstup';
  import {
    zijeVRoce, zivotOsoby, obdobiProRok, oknoReky, zpravaOSmrti, stinOdkazu, naAstro, omezRok, kdeVRoce, vekVRoce, let_,
  } from '../../lib/cas-mapy';
  import { rok as rokText } from '../../lib/casy';
  import { prectiAdresu, zapisAdresu } from '../../lib/adresa-mapy';
  import {
    zastavkyZivota, maZastavky, planPrehravani, rokVCase, rokyMeziSnimky, casProRok, PREHRAVANI, type NastaveniPrehravani,
    planObdobi, desetiletiDal, desetiletiZpet, zacatekObdobi, PREHRAT_OBDOBI, PREHRAT_OBDOBI_TEXTY as TO,
  } from '../../lib/zivot-na-mape';
  import { vypravyObdobi, dalsiVyprava, splnenaVyprava, platnyStavVyprav, KLIC_VYPRAVY, type VypravaV, type StavVyprav } from '../../lib/herna/vypravy';
  import Mapa from './Mapa.svelte';
  import Posuvnik from './Posuvnik.svelte';
  import Reka from './Reka.svelte';
  import PasObdobi from './PasObdobi.svelte';
  import KartaCloveka from './KartaCloveka.svelte';
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import { razitkoOsoby, KLIC_MAPA_VIC } from '../../lib/mapa-listky';
  import { potkaniFilozofove, type MapaPotkanych } from '../../lib/zapisnik';
  import { nacti } from '../../lib/denik';
  import { obarviLogo } from '../../lib/logo';

  interface Props {
    vstup: VstupMapy;
    vychoziRok?: number;
    /** adresy stránek osob a filozofové cest: z deníku se pozná, koho student potkal */
    potkaniMapa?: MapaPotkanych;
    /** výpravy pro období na pásu (src/data/vypravy.yaml, texty hotové) */
    vypravy?: VypravaV[];
  }
  let { vstup, vychoziRok = -360, potkaniMapa, vypravy = [] }: Props = $props();

  const podleId = new Map(vstup.lide.map((o) => [o.id, o]));
  const mista = new Map(vstup.mista.map((m) => [m.id, m]));
  const kotvy = vstup.udalosti.filter((u) => u.druh === 'kotva');

  // ── Stav ───────────────────────────────────────────────────────────────────
  let rok = $state(untrack(() => vychoziRok));
  let obdobi = $state(obdobiProRok(untrack(() => vstup.obdobi), untrack(() => vychoziRok)));
  // Velké A v logu hlavičky nese papír zvoleného období (src/lib/logo.ts).
  $effect(() => obarviLogo(obdobi));
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
  // Úplná mapa (řeka, navazující, všichni žijící) až po „Víc“; při sestavení úplná, aby nic neproblikávalo
  // u toho, kdo ji už zná (první návštěvu pozná až prohlížeč).
  let vic = $state(true);
  let potkani = $state(new Set<string>());
  function ukazVic() {
    vic = true;
    try { localStorage.setItem(KLIC_MAPA_VIC, '1'); } catch { /* bez úložiště jen pro tuto návštěvu */ }
  }

  let osoba = $derived(osobaId ? podleId.get(osobaId) : undefined);
  let zastavky = $derived(osoba && maZastavky(osoba) ? zastavkyZivota(osoba) : []);
  // Výpravy: lístek pro období na pásu; splněná, když je vybraný její člověk v jejím roce (pak zůstane splněná).
  let stavVyprav = $state<StavVyprav>({ aktualni: {}, splnene: [] });
  let cerstvaVyprava = $state<string | null>(null);
  let seznamVyprav = $derived(vypravyObdobi(vypravy, obdobi));
  let vyprava = $derived(seznamVyprav.find((v) => v.id === stavVyprav.aktualni[String(obdobi)]) ?? seznamVyprav[0]);
  let poradiVypravy = $derived(vyprava ? seznamVyprav.indexOf(vyprava) + 1 : 0);
  let vypravaSplnena = $derived(!!vyprava && stavVyprav.splnene.includes(vyprava.id));
  // Při první návštěvě vždy; jinak, dokud není vybraný nikdo jiný než člověk výpravy (karta pod ní má přednost).
  let ukazVypravu = $derived(!!vyprava && (!vic || !osobaId || osobaId === vyprava.osoba));
  function ulozVypravy() {
    try { localStorage.setItem(KLIC_VYPRAVY, JSON.stringify(stavVyprav)); } catch { /* bez úložiště jen pro tuto návštěvu */ }
  }
  $effect(() => {
    const v = vyprava;
    if (!v || !splnenaVyprava(v, osobaId, rok) || untrack(() => stavVyprav.splnene.includes(v.id))) return;
    stavVyprav = { ...untrack(() => stavVyprav), splnene: [...untrack(() => stavVyprav.splnene), v.id] };
    cerstvaVyprava = v.id;
    ulozVypravy();
  });
  async function dalsiVypravu() {
    if (!vyprava) return;
    const d = dalsiVyprava(seznamVyprav, vyprava.id);
    if (!d) return;
    stavVyprav = { ...stavVyprav, aktualni: { ...stavVyprav.aktualni, [String(obdobi)]: d.id } };
    cerstvaVyprava = null;
    ulozVypravy();
    await tick();
    document.getElementById('vyprava-otazka')?.focus();
  }
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
    if (id !== osobaId) zastavZivot();
    if (!zijeVRoce(o, rok)) zastavObdobi();
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
    zastavZivot();
    osobaId = undefined;
    zapisAdresy('push');
  }
  function vyberObdobi(id: number) {
    const ob = vstup.obdobi.find((o) => o.id === id);
    if (!ob || !ob.otevrene || id === obdobi) return;
    zastavPrehravani();
    obdobiPozastaveno = false;
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
  /** Zastaví přehrávání života; adresa pak nese rok, kde skončilo. Při Zpět (`zapsat = false`) se adresa nepřepisuje. */
  function zastavZivot(zapsat = true) {
    if (!prehrava) return;
    prehrava = false;
    cancelAnimationFrame(snimek);
    if (zapsat && !prvniPosun) zapisAdresy('replace');
    else clearTimeout(odlozenyZapis);
  }
  /** Zastaví jakékoli přehrávání (život i období): každý zásah do času. */
  function zastavPrehravani(zapsat = true) {
    zastavZivot(zapsat);
    zastavObdobi(zapsat);
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
    zastavObdobi();
    // Testy si přehrávání zkrátí: window.atlasPrehravani = { delka: 1000, zastaveni: 100 }.
    const nastaveni: NastaveniPrehravani = { ...PREHRAVANI, ...((globalThis as { atlasPrehravani?: Partial<NastaveniPrehravani> }).atlasPrehravani ?? {}) };
    const plan = planPrehravani(o, zastavky, nastaveni);
    if (!plan) return;
    const zacatek = performance.now() - casProRok(plan, rok);
    prehrava = true;
    prvniPosun = true;
    if (casProRok(plan, rok) === 0 && rok !== plan.od) posunPrehravani(plan.od, o);
    // Historie přehrávání: roky, kterými prošlo, i zastávky, které snímek při zátěži přeskočil (rokyMeziSnimky).
    // Testy ji čtou z háčku window.atlasPrehravani.historie, když háček existuje (jinak se nikam neukládá).
    const hacek = (globalThis as { atlasPrehravani?: { historie?: number[] } }).atlasPrehravani;
    const historie: number[] = [rok];
    if (hacek) hacek.historie = historie;
    let predtim = casProRok(plan, rok) - 1;
    const krok = (ted: number) => {
      if (!prehrava) return;
      const t = ted - zacatek;
      for (const h of rokyMeziSnimky(plan, predtim, t)) if (historie[historie.length - 1] !== h) historie.push(h);
      predtim = t;
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
  // Omezený pohyb zapnutý během přehrávání ho zastaví; Klidný režim zastaví přehrávání období.
  $effect(() => {
    if (omezitPohyb) untrack(() => zastavPrehravani());
  });
  $effect(() => {
    if (klidny) untrack(() => zastavObdobi());
  });

  // ── Přehrát období ─────────────────────────────────────────────────────────
  let prehravaObdobi = $state(false);
  /** student přehrávání zastavil: ovládání ukáže skoky po desetiletích a Pokračovat */
  let obdobiPozastaveno = $state(false);
  let klidny = $state(false);
  let bezPohybu = $derived(omezitPohyb || klidny);
  let oknoObdobi = $derived.by((): [number, number] => {
    const ob = vstup.obdobi.find((o) => o.id === obdobi)!;
    return [Math.max(ob.okno.od, vstup.rozsah[0]), Math.min(ob.okno.do, vstup.rozsah[1])];
  });
  function zastavObdobi(zapsat = true) {
    if (!prehravaObdobi) return;
    prehravaObdobi = false;
    obdobiPozastaveno = true;
    cancelAnimationFrame(snimek);
    if (zapsat && !prvniPosun) zapisAdresy('replace');
    else clearTimeout(odlozenyZapis);
  }
  function posunObdobi(r: number, cil: number) {
    rok = r;
    // Kamera drží přehrávané období, dokud rok leží v jeho okně (okna se na okrajích překrývají).
    obdobi = obdobiProRok(vstup.obdobi, r, cil);
    drzOkno(r);
    if (osoba && !zijeVRoce(osoba, r)) osobaId = undefined;
    if (prvniPosun) {
      prvniPosun = false;
      zapisAdresy('push');
    } else zapisAdresy('prehravani');
  }
  async function prehratObdobi() {
    if (bezPohybu || prehravaObdobi) return;
    zastavZivot();
    // Testy si přehrávání zkrátí: window.atlasPrehravaniObdobi = { delka: 2000 }; historii roků čtou z háčku.
    const hacek = (globalThis as { atlasPrehravaniObdobi?: { delka?: number; historie?: number[] } }).atlasPrehravaniObdobi;
    const [od, doRoku] = oknoObdobi;
    const plan = planObdobi(od, doRoku, hacek?.delka ?? PREHRAT_OBDOBI.delka);
    const start = zacatekObdobi(rok, od, doRoku);
    const cil = obdobi;
    const zacatek = performance.now() - casProRok(plan, start);
    prehravaObdobi = true;
    obdobiPozastaveno = false;
    prvniPosun = true;
    if (start !== rok) posunObdobi(start, cil);
    const historie: number[] = [rok];
    if (hacek) hacek.historie = historie;
    await tick();
    document.getElementById('obdobi-prehrat')?.focus();
    const krok = (ted: number) => {
      if (!prehravaObdobi) return;
      const t = ted - zacatek;
      const r = rokVCase(plan, t);
      if (r !== rok) {
        posunObdobi(r, cil);
        historie.push(r);
      }
      if (t >= plan.celkem) {
        prehravaObdobi = false;
        obdobiPozastaveno = false;
        clearTimeout(odlozenyZapis);
        zapisAdresy('replace');
        tick().then(() => document.getElementById('obdobi-prehrat')?.focus());
        return;
      }
      snimek = requestAnimationFrame(krok);
    };
    snimek = requestAnimationFrame(krok);
  }
  /** Skok o desetiletí (bez animace i bez přehrávání): kulatý rok v okně období. */
  function skokDesetileti(smer: 1 | -1) {
    zastavPrehravani();
    const [od, doRoku] = oknoObdobi;
    const r = smer > 0 ? desetiletiDal(rok, doRoku) : desetiletiZpet(rok, od);
    if (r === rok) return;
    const cil = obdobi;
    rok = r;
    obdobi = obdobiProRok(vstup.obdobi, r, cil);
    drzOkno(r);
    if (osoba && !zijeVRoce(osoba, r)) osobaId = undefined;
    zapisAdresy('push');
  }
  let naZacatku = $derived(naAstro(rok) <= naAstro(oknoObdobi[0]));
  let naKonci = $derived(naAstro(rok) >= naAstro(oknoObdobi[1]));

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
    // Klidný režim (atribut na <html>, přepínač v záhlaví) vypne přehrávání období stejně jako omezený pohyb.
    const html = document.documentElement;
    const zmenaKlidu = () => (klidny = html.hasAttribute('data-klidny'));
    zmenaKlidu();
    const pozorovatel = new MutationObserver(zmenaKlidu);
    pozorovatel.observe(html, { attributes: true, attributeFilter: ['data-klidny'] });
    try {
      stavVyprav = platnyStavVyprav(JSON.parse(localStorage.getItem(KLIC_VYPRAVY) ?? 'null'), new Set(vypravy.map((v) => v.id)));
    } catch { /* bez úložiště nebo s poškozeným záznamem: výpravy od začátku */ }
    const stav = prectiAdresy();
    try {
      const d = nacti();
      if (potkaniMapa) potkani = new Set(potkaniFilozofove(d, potkaniMapa));
    } catch { /* bez deníku bez razítek */ }
    let videl = false;
    try { videl = localStorage.getItem(KLIC_MAPA_VIC) === '1'; } catch {}
    vic = videl || !!stav.osoba || !!stav.srovnat || stav.stin || !!stav.zivot;
    document.documentElement.removeAttribute('data-mapa-prvni');
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
      pozorovatel.disconnect();
      removeEventListener('popstate', zpet);
      cancelAnimationFrame(snimek);
    };
  });

  const vekKratce = (o: OsobaV) => {
    const v = vekVRoce(o, rok);
    return v === null ? '' : `${o.zena ? 'je jí' : 'je mu'} ${o.narozen?.priblizne ? 'asi ' : ''}${let_(v)}`;
  };
</script>

<div class="mac obdobi-{obdobi}" class:mac--prvni={!vic} data-zalozka={zalozka}>
  <div class="mac__pas">
    <div class="mac__pasek">
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
    <!-- Přehrát období: při omezeném pohybu a v Klidném režimu jen skoky po desetiletích; po Zastavit totéž a Pokračovat. -->
    <div class="prehrat-obdobi" role="group" aria-label="Přehrát období">
      {#if !prehravaObdobi && (bezPohybu || obdobiPozastaveno)}
        <button type="button" class="po" id="obdobi-zpet" onclick={() => skokDesetileti(-1)} disabled={naZacatku}>
          <span class="po__pilulka"><span aria-hidden="true">‹</span><span class="po__text">{TO.zpet}</span></span>
        </button>
      {/if}
      {#if prehravaObdobi}
        <button type="button" class="po po--hlavni" id="obdobi-prehrat" onclick={() => zastavObdobi()}>
          <span class="po__pilulka"><svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="2" width="10" height="10" rx="1.5" /></svg><span class="po__text">{TO.zastavit}</span></span>
        </button>
      {:else if !bezPohybu}
        <button type="button" class="po po--hlavni" id="obdobi-prehrat" onclick={prehratObdobi}>
          <span class="po__pilulka"><svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9.5-5.5z" /></svg><span class="po__text">{obdobiPozastaveno ? TO.pokracovat : TO.prehrat}</span></span>
        </button>
      {/if}
      {#if !prehravaObdobi && (bezPohybu || obdobiPozastaveno)}
        <button type="button" class="po" id="obdobi-dal" onclick={() => skokDesetileti(1)} disabled={naKonci}>
          <span class="po__pilulka"><span class="po__text">{TO.dal}</span><span aria-hidden="true">›</span></span>
        </button>
      {/if}
    </div>
  </div>

  <div class="mac__mapa">
    <Mapa
      {podklad}
      lide={naMape}
      vsichni={vstup.lide}
      udalosti={vstup.udalosti}
      {stinLide}
      {mista}
      {rok}
      vybrany={osobaId}
      {stin}
      {vic}
      {potkani}
      {telefon}
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
                {#if potkani.has(o.id)}<RazitkoCloveka razitko={razitkoOsoby(o, mista)} obdobi={o.obdobi} velikost={28} />{/if}
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
      zije={zijici.length}
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

  {#if vic}
  <div class="mac__zalozky" role="tablist" aria-label="Panel">
    <button type="button" role="tab" id="tab-clovek" aria-controls="panel-karta" aria-selected={zalozka === 'clovek'} onclick={() => (zalozka = 'clovek')}>Člověk{osoba ? `: ${osoba.jmeno}` : ''}</button>
    <button type="button" role="tab" id="tab-reka" aria-controls="panel-reka" aria-selected={zalozka === 'reka'} onclick={() => (zalozka = 'reka')}>Řeka životů</button>
  </div>

  <div class="mac__reka" id="panel-reka" role={telefon ? 'tabpanel' : undefined} aria-labelledby={telefon ? 'tab-reka' : undefined}>
    <Reka lide={vstup.lide} vztahy={vstup.vztahy} {mista} {rok} {okno} vybrany={osobaId} {telefon} obdobi={vstup.obdobi} onvyber={(id) => vyber(id, 'reka')} />
  </div>
  {/if}

  <aside class="mac__karta" id="panel-karta" role={telefon && vic ? 'tabpanel' : undefined} aria-labelledby={telefon && vic ? 'tab-clovek' : undefined} aria-label={telefon && vic ? undefined : 'Karta člověka'}>
    {#if ukazVypravu && vyprava}
      <div class="vyprava listek-paska" class:vyprava--splnena={vypravaSplnena} class:vyprava--cerstva={cerstvaVyprava === vyprava.id} aria-labelledby="vyprava-otazka">
        <p class="vyprava__nad">Výprava{#if seznamVyprav.length > 1}<span class="vyprava__pocet">{`${poradiVypravy} z ${seznamVyprav.length}`}</span>{/if}</p>
        <h2 class="vyprava__otazka" id="vyprava-otazka" tabindex="-1">{vyprava.otazka}</h2>
        {#if vypravaSplnena}
          <p class="vyprava__sedi" role="status"><span class="vyprava__razitko">Sedí</span> <span class="vyprava__odpoved">{vyprava.odpoved}</span></p>
        {:else}
          <p class="vyprava__pokyn">{vyprava.pokyn}</p>
        {/if}
        <div class="vyprava__akce">
          {#if seznamVyprav.length > 1}
            <button type="button" class="blok__tl blok__tl--vedlejsi vyprava__dalsi" onclick={dalsiVypravu}>Další výprava</button>
          {/if}
          {#if !vic}
            <button type="button" class="blok__tl blok__tl--vedlejsi vyprava__vic" onclick={ukazVic}>Víc: řeka životů a kdo všechno žije</button>
          {/if}
        </div>
      </div>
    {/if}
    {#if vic || osoba}
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
      {potkani}
    />
    {/if}
  </aside>
</div>

<style>
  /* Notebook: pás období, výstřižek mapy, posuvník a řeka vlevo, vpravo karta člověka (nebo výprava) na tečkách. */
  .mac {
    --zlab: 208px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 420px;
    grid-template-rows: 48px minmax(240px, 1fr) 76px clamp(196px, calc(100dvh - var(--hlavicka) - 48px - 76px - 400px), 296px);
    grid-template-areas:
      'pas karta'
      'mapa karta'
      'posuvnik karta'
      'reka karta';
    height: calc(100dvh - var(--hlavicka) - 1px);
    min-height: 560px;
  }
  /* První návštěva: bez řeky, mapa je vyšší. Před hydratací to pozná skript na stránce (data-mapa-prvni). */
  .mac--prvni, :global(html[data-mapa-prvni]) .mac {
    grid-template-rows: 48px minmax(240px, 1fr) 76px;
    grid-template-areas: 'pas karta' 'mapa karta' 'posuvnik karta';
  }
  :global(html[data-mapa-prvni]) .mac :is(.mac__reka, .mac__zalozky) { display: none; }
  .mac__pas { grid-area: pas; display: flex; align-items: flex-start; gap: var(--s-2); min-width: 0; padding: 10px var(--s-5) 0 var(--s-5); }
  .mac__pasek { flex: 1; min-width: 0; height: 100%; }
  /* Přehrát období: tlačítko jako Přehled v pásu (pilulka 32 px), cíl dotyku 44 px kolem ní. */
  .prehrat-obdobi { display: flex; flex: none; margin-top: -6px; }
  .po { position: relative; display: grid; place-items: center; min-width: 44px; height: 44px; padding: 0; border: 0; background: none; color: var(--ink); font-family: var(--font-sans); font-size: 13px; font-weight: 600; cursor: pointer; }
  .po__pilulka { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 var(--s-3); border-radius: var(--r-plne); background: var(--plocha); box-shadow: var(--vyst-m); white-space: nowrap; }
  .po--hlavni .po__pilulka svg { fill: var(--p); }
  .po:disabled { cursor: default; }
  .po:disabled .po__pilulka { background: none; box-shadow: none; color: var(--ink-3); outline: 1.5px dashed var(--tuzka); outline-offset: -1.5px; }
  .po:focus-visible { outline: none; }
  .po:focus-visible .po__pilulka { outline: 2px solid var(--ink); outline-offset: 2px; }
  @media (hover: hover) { .po:not(:disabled):hover .po__pilulka { box-shadow: var(--vyst-m), 0 0 0 1px var(--tuzka); } }
  .mac__mapa { grid-area: mapa; position: relative; min-height: 0; padding: 18px var(--s-5) 8px var(--s-6); }
  /* Posuvník má vpravo stejný okraj jako řeka pod ním: jezdec musí sedět na čáru roku v řece. */
  .mac__posuvnik { grid-area: posuvnik; padding-right: var(--s-4); }
  .mac__reka { grid-area: reka; min-height: 0; margin: 0 var(--s-4) 0 0; background: var(--list); box-shadow: var(--lezi); }
  .mac__karta { grid-area: karta; min-height: 0; overflow-y: auto; scrollbar-width: thin; padding-bottom: var(--s-4); }
  .mac__zalozky { display: none; }

  .mezitim {
    position: absolute;
    right: calc(var(--s-5) + 22px);
    bottom: 32px;
    z-index: 8;
    max-width: 260px;
    padding: var(--s-2) var(--s-3);
    background: var(--listek);
    box-shadow: var(--lezi);
    font-family: var(--font-sans);
    rotate: calc(.8deg * var(--natoceni));
  }
  .mezitim__nadpis { margin: 0 0 4px; font-size: var(--fs-nadtitulek); font-weight: 600; letter-spacing: var(--ls-nadtitulek); text-transform: uppercase; color: var(--ink-3); }
  .mezitim ul { margin: 0; padding: 0; list-style: none; }
  .mezitim button { display: flex; align-items: center; gap: 8px; min-height: 36px; padding: 2px 0; border: 0; background: none; color: var(--ink); text-align: left; font-size: 14px; line-height: 1.25; cursor: pointer; }
  .mezitim button[aria-pressed='true'] strong { text-decoration: underline; text-decoration-color: var(--p); text-decoration-thickness: 2px; }
  .mezitim small { display: block; font-size: 12px; color: var(--ink-3); }
  @media (hover: hover) { .mezitim button:hover strong { text-decoration: underline; } }

  /* Výprava při první návštěvě: lístek s páskou, otázka, pokyn, po splnění razítko „Sedí“ (bez červené a zelené). */
  .vyprava { margin: var(--s-6) var(--s-4) var(--s-2); font-family: var(--font-sans); }
  .vyprava__nad { margin: 0 0 var(--s-1); font-size: var(--fs-nadtitulek); font-weight: 600; letter-spacing: var(--ls-nadtitulek); text-transform: uppercase; color: var(--ink-3); }
  .vyprava__otazka { margin: 0; font-family: var(--font-serif); font-size: 26px; font-weight: 400; line-height: 1.15; color: var(--ink); }
  .vyprava__pocet { margin-left: .9em; letter-spacing: .02em; word-spacing: .12em; text-transform: none; font-weight: 500; }
  .vyprava__otazka:focus { outline: none; }
  .vyprava__otazka:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
  .vyprava__pokyn { margin: var(--s-2) 0 0; font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  /* Odpověď je vysvětlení z dat: tiskem, ne Kalamem (Kalamem jen pokyn a co píše student). */
  .vyprava__sedi { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 6px 12px; margin: var(--s-3) 0 0; color: var(--ink); }
  .vyprava__odpoved { flex: 1 1 220px; font-size: 15px; line-height: 1.45; }
  .vyprava__akce { display: flex; flex-wrap: wrap; gap: var(--s-3); margin-top: var(--s-4); }
  .vyprava__razitko {
    display: inline-block;
    padding: 2px 10px 3px;
    border: 2px solid var(--p);
    outline: 1px solid var(--p);
    outline-offset: 2px;
    border-radius: var(--r-razitko);
    color: var(--p);
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    rotate: -6deg;
  }
  /* Razítko dopadne jen ve chvíli splnění (ne po obnovení stránky); při omezeném pohybu a v Klidném režimu stojí. */
  .vyprava--cerstva .vyprava__razitko { animation-name: razitko-dopad; animation-duration: var(--d-listek); animation-timing-function: var(--k-dopad); animation-fill-mode: both; }
  @media (prefers-reduced-motion: reduce) { .vyprava--cerstva .vyprava__razitko { animation: none; } }
  :global(:root[data-klidny]) .vyprava--cerstva .vyprava__razitko { animation: none; }

  @media (max-width: 1100px) and (min-width: 900px) {
    .mac { --zlab: 176px; grid-template-columns: minmax(0, 1fr) 372px; }
  }
  @media (max-width: 899px) {
    .mac {
      --zlab: 16px;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: 46px 300px 80px 44px minmax(0, 1fr);
      grid-template-areas: 'pas' 'mapa' 'posuvnik' 'zalozky' 'list';
      height: calc(100dvh - var(--hlavicka) - var(--spodni-lista) - env(safe-area-inset-bottom));
      min-height: 520px;
    }
    .mac[data-zalozka='reka'] { grid-template-rows: 46px 200px 80px 44px minmax(0, 1fr); }
    .mac--prvni, :global(html[data-mapa-prvni]) .mac { grid-template-rows: 46px 320px 80px minmax(0, 1fr); grid-template-areas: 'pas' 'mapa' 'posuvnik' 'list'; }
    .mac__pas { padding: 8px var(--s-2) 0 var(--s-3); gap: 2px; }
    /* Na telefonu jen značky; název tlačítka zůstává pro čtečku. */
    .po__text { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    .po__pilulka { padding: 0 11px; }
    .mac__mapa { padding: 14px var(--s-4) 6px; }
    .mac__zalozky {
      grid-area: zalozky;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 0 var(--s-3);
      z-index: 2;
    }
    .mac__zalozky button {
      min-height: 44px;
      padding: 0 var(--s-3);
      border: 0;
      border-radius: var(--r-ovladani) var(--r-ovladani) 0 0;
      background: var(--plocha);
      box-shadow: var(--vyst-m);
      color: var(--ink-2);
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .mac__zalozky button[aria-selected='true'] { background: var(--list); box-shadow: var(--lista-stin); color: var(--ink); }
    .mac__reka, .mac__karta { grid-area: list; }
    .mac__reka { margin: 0; }
    .mac__karta { background: none; }
    .mac[data-zalozka='clovek'] .mac__reka { display: none; }
    .mac[data-zalozka='reka'] .mac__karta { display: none; }
    .mac--prvni .mac__karta { display: block !important; }
    .mac__posuvnik { --posuvnik-rok: 22px; padding-right: 0; }
    .mezitim { right: calc(var(--s-4) + 14px); bottom: 22px; max-width: 200px; padding: 6px 10px; }
    .vyprava { margin: var(--s-5) var(--s-3) var(--s-2); }
    .vyprava__otazka { font-size: 22px; }
  }
</style>
