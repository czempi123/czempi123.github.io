// Ze src/layouts/Zakladni.astro (herna-v1, K4): sdílený modul místo skriptu vloženého do každé stránky.
// Pevná spodní lišta nesmí zakrýt prvek, na který přijde fokus z klávesnice. Prohlížeč stránku sám
// neposune, když prvek leží ve viditelné části, byť pod lištou (scroll-padding na to nestačí).
(() => {
  let klavesnice = false;
  addEventListener('keydown', () => { klavesnice = true; }, true);
  addEventListener('pointerdown', () => { klavesnice = false; }, true);
  addEventListener('focusin', (e) => {
    const prvek = e.target;
    if (!klavesnice || !(prvek instanceof Element)) return;
    // Lišta hodiny drží pod hlavičkou: prvek, na který přijde fokus při couvání (Shift+Tab), pod ní nezůstane.
    const horni = document.querySelector<HTMLElement>('[data-hodina-lista]');
    if (horni && horni.offsetHeight > 0 && !horni.contains(prvek) && !prvek.closest('.hlavicka, .cesta-hlavicka, .obsah-lista')) {
      requestAnimationFrame(() => {
        const r = prvek.getBoundingClientRect();
        const hrana = horni.getBoundingClientRect().bottom;
        if (r.top < hrana + 8 && r.bottom > 0) scrollBy({ top: r.top - hrana - 16, behavior: 'instant' });
      });
    }
    const lista = [...document.querySelectorAll<HTMLElement>('.cesta-lista, nav.lista')].find(
      (l) => getComputedStyle(l).position === 'fixed' && l.getBoundingClientRect().height > 0,
    );
    // Pata rámu aktivity drží na telefonu u spodní hrany (position: sticky, global.css › Rám aktivity):
    // prvek v rámu nad ní musí zůstat nad patou, ne jen nad lištou.
    const pata = prvek.closest('.blok')?.querySelector<HTMLElement>(':scope > .blok__pata');
    const drziPata = pata && !pata.contains(prvek) && getComputedStyle(pata).position === 'sticky';
    if (lista && lista.contains(prvek)) return;
    // Bez lišty i bez paty hlídá spodní hranu okna: pole na psaní (textarea) Chromium po tabulátoru
    // posune jen tak, aby byl vidět kurzor, a spodek pole zůstane pod oknem (K4a, Odkryj u Sókrata).
    requestAnimationFrame(() => {
      const r = prvek.getBoundingClientRect();
      let hrana = lista && !lista.contains(prvek) ? lista.getBoundingClientRect().top : innerHeight;
      if (drziPata) hrana = Math.min(hrana, pata.getBoundingClientRect().top);
      const presah = r.bottom + 16 - hrana;
      // Prvek vyšší než volné místo neposouvej nad horní okraj. Prvek celý pod patou prohlížeč za skrytý
      // nepovažuje (pata nemá scroll-padding), proto se posune i tehdy.
      if (presah > 0 && (r.top < hrana || drziPata)) scrollBy({ top: Math.min(presah, Math.max(0, r.top - 96)), behavior: 'instant' });
    });
  });
})();
