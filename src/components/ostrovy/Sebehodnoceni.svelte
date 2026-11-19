<script lang="ts">
  // Sebehodnocení na konci cesty (herna-v1, K5): dvě krátké nepovinné poznámky pod Závěrem cesty, co už student
  // umí a co mu ještě není jasné. Nic se nehodnotí, nepočítá ani neukazuje jako správné: obě pole se ukládají
  // sama do deníku jako zápis k poslednímu kroku (druh `sebehodnoceni`). Deník je ukáže u cesty a v Moje filozofie.
  // Žádný pohyb. Logika a texty: src/lib/sebehodnoceni.ts. Vkládá ho obal Závěru cesty, v MDX se nepíše:
  // <Sebehodnoceni client:idle slug="kdy-mam-dobry-duvod-verit" cesta="Kdy mám dobrý důvod věřit?" odkaz="/cesta/…/7/" obdobi={1} />
  import MojeStanovisko from './MojeStanovisko.svelte';
  import { NADPIS_SEBEHODNOCENI, OTAZKY_SEBEHODNOCENI, UVOD_SEBEHODNOCENI, idSebehodnoceni, kotvaSebehodnoceni, otazkaZapisu, type CastSebehodnoceni } from '../../lib/sebehodnoceni';
  import { nezlomitelne } from '../../lib/sazba.js';

  interface Props { slug: string; cesta: string; odkaz: string; obdobi: number }
  let { slug, cesta, odkaz, obdobi }: Props = $props();
  const kotva = kotvaSebehodnoceni(slug);
  const CASTI: CastSebehodnoceni[] = ['umim', 'nejsem'];
</script>

<section class="sebehodnoceni ctenarsky obdobi-{obdobi}" id={kotva} aria-labelledby={`${kotva}-nadpis`}>
  <p class="t-nadtitulek nad">Pro sebe</p>
  <h2 class="t-h3 nadpis" id={`${kotva}-nadpis`}>{NADPIS_SEBEHODNOCENI}</h2>
  <p class="uvod">{nezlomitelne(UVOD_SEBEHODNOCENI)}</p>
  <div class="pole">
    {#each CASTI as c (c)}
      <MojeStanovisko rozbalene nepovinne druh="sebehodnoceni" id={idSebehodnoceni(slug, c)} otazka={otazkaZapisu(cesta, c)} popisek={OTAZKY_SEBEHODNOCENI[c]} {odkaz} />
    {/each}
  </div>
</section>

<style>
  /* List zápisníku, který leží pod závěrem: bez pásky a bez natočení (Pravidlo střídmosti). */
  .sebehodnoceni { margin: var(--s-7) auto 0; padding: 26px 28px 22px; background: var(--list); box-shadow: var(--lezi); }
  @media (max-width: 699px) { .sebehodnoceni { padding: 22px 18px 18px; } }
  .nad { margin: 0 0 var(--s-1); color: var(--p, var(--ink-2)); }
  /* Dvojitá třída: v kroku cesty dává každému h2 okraje nadpisu kroku ([krok].astro). */
  .sebehodnoceni .nadpis { margin: 0; }
  .uvod { margin: var(--s-2) 0 0; color: var(--ink-2); }
  /* Na telefonu pod sebou, od 640 px sloupce vedle sebe (stejně jako Na začátku × Teď). */
  .pole { display: grid; gap: var(--s-2) var(--s-6); }
  @container (min-width: 640px) {
    .pole { grid-template-columns: 1fr 1fr; align-items: start; }
  }
</style>
