// Logo Agora v hlavičce (src/components/rozvrzeni/Hlavicka.astro): velké A nese papír období stránky.
// Stránky s pevným obdobím ho dostanou při sestavení; Mapa a čas ho mění podle zvoleného roku.

/** Třídy, které loga období nastavují: obdobi-1 až obdobi-8 a bez-obdobi. */
export function tridyObdobiLoga(obdobi: number | undefined): string {
  return obdobi && obdobi >= 1 && obdobi <= 8 ? `obdobi-${obdobi}` : 'bez-obdobi';
}

/** Přebarví všechna loga na stránce (atribut data-logo) na dané období. */
export function obarviLogo(obdobi: number | undefined, koren: ParentNode = document): void {
  const nova = tridyObdobiLoga(obdobi);
  for (const logo of koren.querySelectorAll<HTMLElement>('[data-logo]')) {
    for (const t of [...logo.classList]) if (/^obdobi-\d$/.test(t) || t === 'bez-obdobi') logo.classList.remove(t);
    logo.classList.add(nova);
  }
}
