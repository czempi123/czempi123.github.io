<script lang="ts">
  // Stránka hodiny pro studenta (/hodina/?v=1&n=…&z=…, větev hodiny-v1, H3): název, zastavení v pořadí
  // (u bloku nadtitulek jako na stránce, jinak štítek druhu; kde stojí; název jako odkaz na místo v atlasu), Začít hodinu, Promítat hodinu a „Doma projdi“.
  // Hodinu čte z adresy (hodinaZAdresy), katalog z /hodina/katalog.json. Otevřená hodina se stane aktivní pro tuto
  // kartu (lišta hodiny na stránkách atlasu, src/lib/pruchod-hodiny.ts) a zapíše se do deníku (oddíl Hodiny).
  // Poznámky učitele tu nikdy nejsou: odkaz je nenese a úložiště hodin učitele se tu nečte.
  // Použití: <HodinaStudent client:load />
  import { onMount } from 'svelte';
  import { hodinaZAdresy, najdiZastaveni, domaProjdi, type NalezeneZastaveni, type SkupinaDoma, type Zastaveni } from '../../lib/hodiny';
  import { aktivniHodina, nactiAktivni, ulozAktivni, vstupDoHodiny, prvniZastaveni, type AktivniHodina } from '../../lib/pruchod-hodiny';
  import { nacti, prectene, zaznamenejHodinu } from '../../lib/denik';
  import { druhStranky, kdeStoji, pocetZastaveni, stitekStudenta } from '../../lib/skladatel';
  import { nezlomitelne } from '../../lib/sazba.js';

  let stav = $state<'nacitam' | 'neplatna' | 'chyba' | 'hotovo'>('nacitam');
  let nazev = $state('');
  let zastaveni = $state<NalezeneZastaveni[]>([]);
  let doma = $state<SkupinaDoma[]>([]);
  let aktivni = $state<AktivniHodina | null>(null);
  let prvni = $derived(aktivni ? prvniZastaveni(aktivni.polozky) : null);
  let nadpis = $derived(nazev || 'Hodina');

  onMount(() => {
    const h = hodinaZAdresy(location.search);
    if (!h || !h.zastaveni.length) {
      stav = 'neplatna';
      return;
    }
    nazev = h.nazev;
    fetch('/hodina/katalog.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((k: { zastaveni: Zastaveni[] }) => {
        const adresa = location.pathname + location.search;
        zastaveni = najdiZastaveni(k.zastaveni, h.zastaveni);
        aktivni = aktivniHodina(h, k.zastaveni, adresa, false);
        // Návrat na přehled téže hodiny (z lišty): poslední navštívené zastavení zůstane, lišta mimo hodinu k němu vede dál.
        const drive = nactiAktivni();
        if (drive && drive.adresa === adresa && drive.polozky.length === aktivni.polozky.length) aktivni.posledni = drive.posledni;
        ulozAktivni(aktivni);
        zaznamenejHodinu(adresa, h.nazev);
        const d = nacti();
        const kroky = Object.fromEntries(Object.entries(d.cesty).map(([slug, c]) => [slug, Array.isArray(c.navstivene) ? c.navstivene : []]));
        doma = domaProjdi(h.zastaveni, k.zastaveni, { kroky, kapitoly: prectene(d) });
        stav = 'hotovo';
      })
      .catch(() => (stav = 'chyba'));
  });

  /** Student jde na zastavení i: lišta hodiny na té stránce bude vědět, na které přišel. */
  function jdu(i: number) {
    if (aktivni) vstupDoHodiny(aktivni, i, false);
  }

  function promitat() {
    if (!aktivni) return;
    const adresa = vstupDoHodiny(aktivni, prvni, true);
    if (adresa) location.href = adresa;
  }
</script>

{#if stav === 'nacitam'}
  <p class="t-ovladani nacitam">Načítám hodinu…</p>
{:else if stav === 'neplatna'}
  <div class="neplatna">
    <h1 class="t-h1">Hodina</h1>
    <p class="t-perex">Tenhle odkaz žádnou hodinu nenese. Zkus ho otevřít ještě jednou celý.</p>
    <p class="t-ovladani"><a class="domu" href="/">Domů</a></p>
  </div>
{:else if stav === 'chyba'}
  <div class="neplatna">
    <h1 class="t-h1">{nadpis}</h1>
    <p class="t-perex">Hodinu se nepodařilo načíst. Zkus stránku obnovit.</p>
    <p class="t-ovladani"><a class="domu" href="/">Domů</a></p>
  </div>
{:else}
  <header class="hlava">
    <p class="t-nadtitulek nadtitulek">Hodina · {pocetZastaveni(zastaveni.length)}</p>
    <h1 class="t-h1">{nezlomitelne(nadpis)}</h1>
    {#if prvni !== null && aktivni}
      <div class="blok__akce akce">
        <a class="blok__tl blok__tl--hlavni" href={aktivni.polozky[prvni].adresa} onclick={() => jdu(prvni!)}>
          Začít hodinu<span class="sipka" aria-hidden="true">→</span>
        </a>
        <button type="button" class="blok__tl blok__tl--vedlejsi" onclick={promitat}>Promítat hodinu</button>
      </div>
    {/if}
  </header>

  <ol class="zastaveni">
    {#each zastaveni as n, i (n.id)}
      <li class="zastaveni__polozka {n.nalezeno && n.zastaveni.obdobi ? `obdobi-${n.zastaveni.obdobi}` : ''}" class:zastaveni__polozka--chybi={!n.nalezeno}>
        <span class="cislo" aria-hidden="true">{i + 1}</span>
        <div class="obsah">
          {#if n.nalezeno}
            <p class="kde">{stitekStudenta(n.zastaveni)} · {nezlomitelne(kdeStoji(n.zastaveni))}</p>
            <a class="nazev" href={n.zastaveni.adresa} onclick={() => jdu(i)}><span class="vizualne-skryte">{i + 1}.</span>{nezlomitelne(n.zastaveni.nazev)}</a>
          {:else}
            <p class="nazev nazev--chybi"><span class="vizualne-skryte">{i + 1}.</span>{n.text}</p>
          {/if}
        </div>
      </li>
    {/each}
  </ol>

  {#if doma.length}
    <section class="doma" aria-labelledby="doma-nadpis">
      <h2 class="t-h2 doma__nadpis" id="doma-nadpis">Doma projdi</h2>
      <p class="doma__uvod">Tohle v hodině nebylo. Projdi si to, až budeš mít chvíli.</p>
      {#each doma as g (g.zastaveni.id)}
        <div class="skupina {g.zastaveni.obdobi ? `obdobi-${g.zastaveni.obdobi}` : ''}">
          <h3 class="skupina__nadpis">
            <span class="t-nadtitulek skupina__druh">{druhStranky(g.zastaveni)}</span>
            <a href={g.zastaveni.adresa}>{nezlomitelne(g.zastaveni.nazev)}</a>
          </h3>
          <ul class="skupina__polozky">
            {#each g.polozky as p (p.zastaveni.id)}
              <li class:hotovo={p.proslo}>
                <a href={p.zastaveni.adresa}><span class="polozka__stitek">{stitekStudenta(p.zastaveni)}</span> {nezlomitelne(p.zastaveni.nazev)}</a>
                {#if p.proslo}
                  <span class="znacka"><span aria-hidden="true">✓ </span>{p.zastaveni.druh === 'kapitola' ? 'dočteno' : 'prošel jsi'}</span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>
  {/if}
{/if}

<style>
  .nacitam { padding: var(--s-6) 0; color: var(--ink-2); }
  .neplatna { padding: var(--s-6) 0 var(--s-4); }
  .neplatna h1 { margin-bottom: var(--s-4); }
  .domu { display: inline-flex; align-items: center; min-height: 44px; color: var(--ink); font-weight: 600; }

  .hlava { padding: var(--s-6) 0 var(--s-5); }
  .nadtitulek { margin: 0 0 var(--s-3); color: var(--ink-2); }
  h1 { margin: 0; overflow-wrap: anywhere; }
  .akce { margin-top: var(--s-5); }
  .sipka { margin-left: var(--s-1); }

  .zastaveni { margin: 0; padding: 0; list-style: none; counter-reset: none; }
  .zastaveni__polozka { display: grid; grid-template-columns: 36px minmax(0, 1fr); gap: var(--s-3); padding: var(--s-4) 0; border-top: 1px solid var(--linka); }
  .zastaveni__polozka:last-child { border-bottom: 1px solid var(--linka); }
  .cislo {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: var(--r-plne);
    /* Číslo zastavení v kroužku inkoustem období jako razítko (K6: bez tinty). */
    background: var(--list);
    box-shadow: inset 0 0 0 1.5px var(--p, var(--ink));
    color: var(--p, var(--ink));
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    font-variant-numeric: tabular-nums lining-nums;
  }
  .obsah { min-width: 0; }
  .kde { margin: 0 0 var(--s-1); font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-3); overflow-wrap: anywhere; }
  .nazev { display: inline-block; margin: 0; color: var(--ink); font-size: var(--fs-perex); line-height: 1.3; overflow-wrap: anywhere; }
  .nazev--chybi { color: var(--ink-2); font-style: italic; }

  .doma { margin-top: var(--s-8); }
  .doma__nadpis { margin: 0 0 var(--s-3); }
  .doma__uvod { color: var(--ink-2); }
  .skupina { margin-top: var(--s-6); padding-left: var(--s-4); border-left: 3px solid var(--p, var(--linka)); }
  .skupina__nadpis { display: grid; gap: var(--s-1); margin: 0 0 var(--s-2); font-size: var(--fs-perex); line-height: 1.3; }
  .skupina__druh { color: var(--p, var(--ink-2)); }
  .skupina__nadpis a { color: var(--ink); }
  .skupina__polozky { margin: 0; padding: 0; list-style: none; }
  .skupina__polozky li { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: var(--s-3); padding: var(--s-2) 0; border-top: 1px solid var(--linka); }
  .skupina__polozky a { display: inline-block; min-height: 24px; color: var(--ink); font-family: var(--font-sans); font-size: var(--fs-ovladani-l); font-weight: 500; line-height: 1.4; }
  .polozka__stitek { color: var(--ink-3); font-weight: 400; }
  .hotovo a { color: var(--ink-2); }
  .znacka { font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--ink); white-space: nowrap; }
</style>
