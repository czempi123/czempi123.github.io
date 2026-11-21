// Lišta hodiny a režim Promítat na stránkách atlasu (větev hodiny-v1, H3). Běží na každé stránce
// (src/layouts/Zakladni.astro); bez aktivní hodiny v této kartě nedělá nic. Logika bez DOM (které zastavení
// je aktuální, kam vede Další, krok promítání) je v src/lib/pruchod-hodiny.ts.
//  · Lišta: „Hodina: Delfy · 3 ze 7“, Předchozí a Další na sousední zastavení (neznámá přeskočí), Přehled hodiny,
//    Zavřít (v této kartě se lišta už neukáže, dokud student hodinu znovu neotevře).
//  · Mimo hodinu (krok O): stránka bez zastavení hodiny, na kterou student odbočil (Kam dál, Další krok cesty),
//    má lištu „Hodina: Delfy · mimo hodinu“: Předchozí („Zpět na 2 z 8“) na poslední navštívené zastavení,
//    Další na zastavení za ním. Při promítání se mimo hodinu nechodí, lišta tam není.
//  · Příchod z lišty nebo ze stránky hodiny skočí na kotvu bez plynulého posunu (třída skok-na-zastaveni).
//  · Promítání: u zastavení s kotvou jen jeho úsek; šipky, PageDown/PageUp a mezerník posouvají o obrazovku
//    a na konci úseku přejdou na další zastavení (zpátky na konec předchozího); F celá obrazovka; Esc konec.
//    Klávesy nesahají do polí, posuvníků a přepínačů bloků (klavesaPatriPrvku).
//  · Podoba na plátně (krok H4): úsek bloku nebo kresby dostane data-podoba a styly v src/styles/promitani.css
//    skryjí části podle značek data-cast. U otevřené otázky Ukázat možnosti (a klávesa M) přepne úsek na
//    „jen otázka a možnosti“, dokud učitel nepřejde jinam; při návratu na zastavení jsou karty zase skryté.
//  · Ukončit promítání (i Esc) stránku načte znovu: bloky pak ukážou deník studenta, ne stav z promítání.
import {
  nactiAktivni, ulozAktivni, aktualniZastaveni, sousedniZastaveni, poradiZastaveni, cestaStranky, krokPromitani, polohaPrichodu,
  klavesaPatriPrvku, zastaveniMimoHodinu, type AktivniHodina, type Plocha, type PolozkaHodiny,
} from '../lib/pruchod-hodiny';
import { ztisStranku, zrusTicho } from '../lib/denik';

/** Mezera mezi lištou a začátkem úseku na plátně. */
const OKRAJ_USEKU = 16;

export function spustListuHodiny(): void {
  const html = document.documentElement;
  const lista = document.querySelector<HTMLElement>('[data-hodina-lista]');
  if (!lista) return;
  const nazev = lista.querySelector<HTMLElement>('[data-hl-nazev]')!;
  const pocet = lista.querySelector<HTMLElement>('[data-hl-pocet]')!;
  const predchozi = lista.querySelector<HTMLAnchorElement>('[data-hl-predchozi]')!;
  const textPredchozi = predchozi.querySelector<HTMLElement>('.hl-text')!;
  const dalsi = lista.querySelector<HTMLAnchorElement>('[data-hl-dalsi]')!;
  const prehled = lista.querySelector<HTMLAnchorElement>('[data-hl-prehled]')!;
  const obrazovka = lista.querySelector<HTMLButtonElement>('[data-hl-obrazovka]')!;
  const zavrit = lista.querySelector<HTMLButtonElement>('[data-hl-zavrit]')!;
  const ukoncit = lista.querySelector<HTMLButtonElement>('[data-hl-ukoncit]')!;
  const moznosti = lista.querySelector<HTMLButtonElement>('[data-hl-moznosti]')!;
  const main = document.querySelector<HTMLElement>('main')!;

  let hodina: AktivniHodina | null = null;
  let aktualni: number | null = null;
  /** stránka mimo hodinu: poslední navštívené zastavení, ke kterému lišta vede zpátky */
  let mimo: number | null = null;
  let odchazim = false;
  let styl: HTMLStyleElement | null = null;
  /** Ukázané možnosti otevřené otázky; platí jen pro právě promítané zastavení. */
  let ukazane = false;

  const promitani = () => !!hodina && hodina.promitani && aktualni !== null;
  /** Lišta drží těsně pod hlavičkou, která drží nahoře: v kroku cesty je to na telefonu lišta cesty (záhlaví webu
   *  je tam skryté), na notebooku záhlaví webu (lišta cesty pod ním nedrží; K5). */
  function zmerHlavicku() {
    const hlavicka = [...document.querySelectorAll<HTMLElement>('.hlavicka, .cesta-hlavicka')].find((e) => {
      const s = getComputedStyle(e);
      return s.display !== 'none' && s.position === 'sticky';
    });
    const h = hlavicka ? hlavicka.getBoundingClientRect().height : 0;
    html.style.setProperty('--hlavicka-skutecna', `${h}px`);
  }
  addEventListener('resize', zmerHlavicku);
  void document.fonts?.ready.then(zmerHlavicku);
  const polozka = (): PolozkaHodiny | null => (hodina && aktualni !== null ? hodina.polozky[aktualni] : null);

  /** Prvek úseku zastavení: kotva, u nadpisu oddílu jeho oddíl; celá stránka je celý obsah stránky. */
  function usek(p: PolozkaHodiny): HTMLElement | null {
    if (!p.kotva) return main;
    const el = document.getElementById(p.kotva);
    if (!el) return null;
    if (/^H[1-6]$/.test(el.tagName)) return el.closest<HTMLElement>('[data-oddil-kotva]') ?? el;
    return el;
  }

  function odznacUsek() {
    styl?.remove();
    styl = null;
    for (const el of document.querySelectorAll('[data-promitane-predek], [data-promitane], [data-podoba]')) {
      el.removeAttribute('data-promitane-predek');
      el.removeAttribute('data-promitane');
      el.removeAttribute('data-podoba');
    }
    delete lista!.dataset.otevrena;
  }

  /** Podoba úseku na plátně: otevřená otázka s ukázanými možnostmi se ukáže jako „jen otázka a možnosti“. */
  function nastavPodobu(el: HTMLElement, p: PolozkaHodiny) {
    if (!p.podoba) return;
    const otevrena = p.podoba === 'otevrena';
    el.setAttribute('data-podoba', otevrena && ukazane ? 'moznosti' : p.podoba);
    if (otevrena) lista!.dataset.otevrena = '';
    moznosti.setAttribute('aria-pressed', String(otevrena && ukazane));
  }

  /** Na plátně zůstane vidět jen úsek zastavení s kotvou; jeho předci zůstanou, všechno ostatní v obsahu se skryje. */
  function oznacUsek(p: PolozkaHodiny) {
    odznacUsek();
    // Hlas stojí na stránce otázky pod Tvým prvním názorem; učitel ho do hodiny vybral, na plátně se ukáže hned.
    if (p.druh === 'hlas') html.removeAttribute('data-otazka-zavreno');
    if (!p.kotva) return;
    const el = usek(p);
    if (!el || el === main) return;
    // Blok pod Tvým prvním názorem (osa hlasů, hra stránky otázky; herna-v1, R) se na plátně ukáže taky hned.
    if (el.closest('.po')) html.removeAttribute('data-otazka-zavreno');
    const kotva = el.getAttribute('data-oddil-kotva');
    const sel = el.id ? `#${CSS.escape(el.id)}` : kotva ? `[data-oddil-kotva="${CSS.escape(kotva)}"]` : '';
    if (!sel) return;
    el.setAttribute('data-promitane', '');
    nastavPodobu(el, p);
    for (let a = el.parentElement; a && a !== main; a = a.parentElement) a.setAttribute('data-promitane-predek', '');
    styl = document.createElement('style');
    styl.id = 'promitani-usek';
    styl.textContent = `html.promitani main :not(${sel}, ${sel} *, [data-promitane-predek]) { display: none !important; }`;
    document.head.append(styl);
  }

  /** Úsek a okno v souřadnicích stránky (pod lištou hodiny). */
  function plocha(): Plocha {
    const p = polozka()!;
    const el = usek(p) ?? main;
    const r = el.getBoundingClientRect();
    const h = lista!.getBoundingClientRect().height;
    return {
      poloha: scrollY + h,
      vyska: innerHeight - h,
      // Výš než na h (stránka úplně nahoře) se stránka neposune; úsek začínající těsně pod lištou (celá stránka)
      // by jinak couvání nepustil na předchozí zastavení.
      horni: Math.max(h, r.top + scrollY - OKRAJ_USEKU),
      dolni: r.bottom + scrollY + OKRAJ_USEKU,
      nejvys: document.documentElement.scrollHeight - innerHeight + h,
    };
  }
  const posunNa = (poloha: number) => scrollTo({ top: Math.max(0, poloha - lista!.getBoundingClientRect().height), behavior: 'instant' });

  function nastavOdkaz(a: HTMLAnchorElement, j: number | null) {
    const p = j !== null ? hodina!.polozky[j] : null;
    if (p?.adresa) {
      a.href = p.adresa;
      a.removeAttribute('aria-disabled');
      a.dataset.index = String(j);
    } else {
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
      delete a.dataset.index;
    }
  }

  function vyplnListu() {
    const h = hodina!;
    const mimoHodinu = aktualni === null;
    const i = mimoHodinu ? mimo! : aktualni!;
    nazev.textContent = h.nazev || 'Hodina';
    pocet.textContent = mimoHodinu ? 'mimo hodinu' : poradiZastaveni(i + 1, h.polozky.length);
    nastavOdkaz(predchozi, mimoHodinu ? i : sousedniZastaveni(h.polozky, i, -1));
    textPredchozi.textContent = mimoHodinu ? `Zpět na ${poradiZastaveni(i + 1, h.polozky.length)}` : 'Předchozí';
    nastavOdkaz(dalsi, sousedniZastaveni(h.polozky, i, 1));
    lista!.toggleAttribute('data-mimo', mimoHodinu);
    prehled.href = h.adresa;
    obrazovka.setAttribute('aria-pressed', String(!!document.fullscreenElement));
    lista!.dataset.pripraveno = '';
  }

  /** Přečte aktivní hodinu, najde aktuální zastavení a podle toho ukáže lištu, nebo plátno. */
  async function obnov(umistit: boolean) {
    hodina = nactiAktivni();
    ukazane = false;
    aktualni = hodina && !hodina.zavreno ? aktualniZastaveni(hodina.polozky, location.pathname, location.hash, hodina.posledni) : null;
    mimo = hodina && aktualni === null ? zastaveniMimoHodinu(hodina, location.pathname) : null;
    // Zastavení, na jehož stránce student stojí, je poslední navštívené, ať sem přišel jakkoli.
    if (hodina && aktualni !== null && hodina.posledni !== aktualni) {
      hodina = { ...hodina, posledni: aktualni };
      ulozAktivni(hodina);
    }
    if (hodina?.skok) {
      const { skok: _pryc, ...bez } = hodina;
      hodina = bez;
      ulozAktivni(hodina);
      pustSkok();
    }
    const s = aktualni !== null || mimo !== null;
    html.classList.toggle('s-hodinou', s);
    html.classList.toggle('promitani', promitani());
    zmerHlavicku();
    if (!s) {
      if (hodina?.poPromitani) {
        const { poPromitani: _pryc, ...bez } = hodina;
        ulozAktivni(bez);
        try { history.scrollRestoration = 'auto'; } catch { /* nepodporováno */ }
      }
      odznacUsek();
      html.classList.remove('promitani-pripraveno');
      delete lista!.dataset.pripraveno;
      return;
    }
    vyplnListu();
    if (aktualni === null) {
      // Mimo hodinu: jen lišta, stránka zůstane, jak je.
      odznacUsek();
      html.classList.remove('promitani-pripraveno');
      return;
    }
    if (!promitani()) {
      odznacUsek();
      html.classList.remove('promitani-pripraveno');
      if (hodina!.poPromitani) {
        // Stránka se po konci promítání načetla znovu: zastavení na svém místě, fokus na Přehled hodiny.
        const { poPromitani: _pryc, ...bez } = hodina!;
        hodina = bez;
        ulozAktivni(hodina);
        try { history.scrollRestoration = 'auto'; } catch { /* nepodporováno */ }
        const p = polozka();
        const el = p?.kotva ? document.getElementById(p.kotva) : null;
        if (el) el.scrollIntoView({ block: 'start' });
        else scrollTo({ top: 0 });
        prehled.focus({ preventScroll: true });
        addEventListener('pagehide', zrusTicho, { once: true });
      }
      return;
    }
    oznacUsek(polozka()!);
    if (!umistit) {
      html.classList.add('promitani-pripraveno');
      return;
    }
    // Obsah se ukáže a stránka se posune v témže úkolu, takže prohlížeč nevykreslí nic mezi tím.
    await document.fonts?.ready;
    if (!promitani()) return;
    html.classList.add('promitani-pripraveno');
    const kam = hodina!.prichod;
    posunNa(polohaPrichodu(plocha(), kam));
    if (kam !== 'zacatek') ulozAktivni({ ...hodina!, prichod: 'zacatek' });
  }

  /** Třída skok-na-zastaveni drží okamžitý skok na kotvu, dokud se stránka nenačte; pak platí plynulý posun atlasu. */
  function pustSkok() {
    const pust = () => requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('skok-na-zastaveni')));
    if (document.readyState === 'complete') pust();
    else addEventListener('load', pust, { once: true });
  }

  /** Přechod na zastavení j: na téže stránce bez nového načtení, jinak na jeho adresu (na kotvu bez plynulého posunu). */
  function jdiNa(j: number, prichod: 'zacatek' | 'konec') {
    const p = hodina?.polozky[j];
    if (!hodina || !p?.adresa || !p.stranka) return;
    if (cestaStranky(p.stranka) === cestaStranky(location.pathname)) {
      ulozAktivni({ ...hodina, posledni: j, prichod });
      history.pushState(null, '', p.adresa);
      void obnov(true).then(() => {
        if (promitani()) return;
        const el = p.kotva ? document.getElementById(p.kotva) : null;
        if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
        else scrollTo({ top: 0, behavior: 'instant' });
      });
    } else {
      ulozAktivni({ ...hodina, posledni: j, prichod, skok: true });
      odchazim = true;
      location.href = p.adresa;
    }
  }

  function krok(smer: 1 | -1) {
    if (!promitani()) return;
    const r = krokPromitani(plocha(), smer);
    if ('poloha' in r) {
      posunNa(r.poloha);
      return;
    }
    const j = sousedniZastaveni(hodina!.polozky, aktualni!, smer);
    if (j !== null) jdiNa(j, smer === 1 ? 'zacatek' : 'konec');
  }

  function celaObrazovka(zapnout: boolean) {
    if (zapnout && !document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else if (!zapnout && document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }

  /**
   * Konec promítání: deník promítání se smaže (ulozAktivni bez promítání) a stránka se načte znovu, aby bloky
   * ukázaly deník studenta, ne volby třídy. Po načtení se stránka otevře na zastavení a fokus dostane Přehled hodiny.
   */
  function ukoncitPromitani() {
    if (!hodina) return;
    ulozAktivni({ ...hodina, promitani: false, celaObrazovka: false, poPromitani: true });
    ztisStranku(location.pathname);
    odchazim = true;
    celaObrazovka(false);
    try { history.scrollRestoration = 'manual'; } catch { /* nepodporováno */ }
    location.reload();
  }

  /** Ukázat možnosti u otevřené otázky (tlačítko i klávesa M); znovu je skryje. */
  function prepniMoznosti() {
    const p = polozka();
    if (!promitani() || p?.podoba !== 'otevrena') return;
    const el = usek(p);
    if (!el || el === main) return;
    ukazane = !ukazane;
    nastavPodobu(el, p);
    posunNa(polohaPrichodu(plocha(), 'zacatek'));
  }

  /** Patří klávesa prvku s fokusem (pole, posuvník, přepínač bloku, tlačítko u mezerníku)? */
  function patriPrvku(klavesa: string): boolean {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body || el === html) return false;
    const role: string[] = [];
    for (let a: HTMLElement | null = el; a && a !== document.body; a = a.parentElement) {
      const r = a.getAttribute('role');
      if (r) role.push(r);
    }
    return klavesaPatriPrvku(
      { znacka: el.tagName.toLowerCase(), typ: (el as HTMLInputElement).type, editovatelny: el.isContentEditable, role },
      klavesa,
    );
  }

  // ─── Události ───
  for (const a of [predchozi, dalsi]) {
    a.addEventListener('click', (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const j = a.dataset.index;
      if (j !== undefined) jdiNa(Number(j), 'zacatek');
    });
  }
  zavrit.addEventListener('click', () => {
    if (!hodina) return;
    ulozAktivni({ ...hodina, zavreno: true });
    void obnov(false);
    main.focus({ preventScroll: true });
  });
  ukoncit.addEventListener('click', ukoncitPromitani);
  moznosti.addEventListener('click', prepniMoznosti);
  obrazovka.addEventListener('click', () => celaObrazovka(!document.fullscreenElement));
  document.addEventListener('fullscreenchange', () => {
    obrazovka.setAttribute('aria-pressed', String(!!document.fullscreenElement));
    // Při přechodu na jinou stránku prohlížeč celou obrazovku zavře sám; přání učitele zůstává.
    if (odchazim || !hodina) return;
    hodina = { ...hodina, celaObrazovka: !!document.fullscreenElement };
    ulozAktivni(hodina);
  });
  addEventListener('pagehide', () => { odchazim = true; });
  addEventListener('pageshow', () => { odchazim = false; });
  addEventListener('popstate', () => void obnov(true));
  addEventListener('hashchange', () => {
    // Odkaz na kotvu uvnitř stránky (Kam dál z bloku): platí zastavení, na které vede.
    if (!hodina) return;
    const k = location.hash.slice(1);
    const j = hodina.polozky.findIndex((p) => p.kotva === k && p.stranka === cestaStranky(location.pathname));
    if (j >= 0) ulozAktivni({ ...hodina, posledni: j });
    void obnov(promitani());
  });

  // Celá obrazovka se po přechodu na další stránku zapne znovu při první klávese nebo klepnutí (prohlížeč to bez nich nedovolí).
  const obnovObrazovku = () => {
    if (promitani() && hodina!.celaObrazovka && !document.fullscreenElement) celaObrazovka(true);
  };
  addEventListener('pointerdown', obnovObrazovku, true);

  addEventListener('keydown', (e) => {
    if (!promitani() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (k === 'Escape') {
      if (document.fullscreenElement) return; // první Esc zavře celou obrazovku (prohlížeč)
      e.preventDefault();
      ukoncitPromitani();
      return;
    }
    if (k === 'f' || k === 'F') {
      if (patriPrvku('f') || e.shiftKey) return;
      e.preventDefault();
      celaObrazovka(!document.fullscreenElement);
      return;
    }
    obnovObrazovku();
    if ((k === 'm' || k === 'M') && !e.shiftKey) {
      if (polozka()?.podoba !== 'otevrena' || patriPrvku('m')) return;
      e.preventDefault();
      prepniMoznosti();
      return;
    }
    const vpred = k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.shiftKey);
    const vzad = k === 'ArrowLeft' || k === 'PageUp' || (k === ' ' && e.shiftKey);
    if (!vpred && !vzad) return;
    if (patriPrvku(k)) return;
    e.preventDefault();
    krok(vpred ? 1 : -1);
  });

  void obnov(true);
}
