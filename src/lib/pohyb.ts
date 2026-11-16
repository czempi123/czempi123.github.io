// Jemné odkrytí zpětné vazby: krátké vyjetí a zesílení. Při omezeném pohybu bez animace.
import { fly } from 'svelte/transition';

export function omezenyPohyb(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Hodnota tokenu pohybu z tokens.css (--d-presun, --k-papir); při sestavení prázdná. */
export function tokenPohybu(nazev: string): string {
  if (typeof getComputedStyle === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(nazev).trim();
}

/** Délka z tokenu v milisekundách („320ms“, „.32s“); bez tokenu náhradní. */
export function delkaTokenu(nazev: string, nahradni = 0): number {
  const h = tokenPohybu(nazev);
  const n = parseFloat(h);
  if (!Number.isFinite(n)) return nahradni;
  return h.endsWith('ms') ? n : h.endsWith('s') ? n * 1000 : n;
}

/**
 * Přichycení (D5: karta do kapsy, mince po provázku): prvek, který už stojí na novém místě, přejede z místa,
 * kde byl předtím (odkud, změřené před změnou). Jen transform; při omezeném pohybu je na místě hned.
 */
export function prelet(
  prvek: Element | null | undefined,
  odkud: DOMRect | null | undefined,
  { delka = '--d-presun', krivka = '--k-papir' }: { delka?: string; krivka?: string } = {},
) {
  if (!(prvek instanceof HTMLElement) || !odkud || omezenyPohyb() || typeof prvek.animate !== 'function') return;
  const kam = prvek.getBoundingClientRect();
  const dx = odkud.left - kam.left;
  const dy = odkud.top - kam.top;
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
  const sx = kam.width ? odkud.width / kam.width : 1;
  const sy = kam.height ? odkud.height / kam.height : 1;
  prvek.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: '0 0' },
      { transform: 'none', transformOrigin: '0 0' },
    ],
    { duration: delkaTokenu(delka, 320), easing: tokenPohybu(krivka) || 'ease-out' },
  );
}

export function odkryti(node: Element, { y = 10, duration = 260 }: { y?: number; duration?: number } = {}) {
  return fly(node, { y, duration: omezenyPohyb() ? 0 : duration, opacity: 0 });
}
