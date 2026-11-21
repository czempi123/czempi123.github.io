<script lang="ts">
  // Moje filozofie (design-v2, K6; plán větve › Mapa a deník: funkce): hlavní pohled deníku po velkých otázkách.
  // U každé otázky studentova odpověď na začátku a teď (perem, jen ke čtení; přepsat jde v Tvoje antika), pravidla
  // z cest, pod nimi sebehodnocení z konce cest (herna-v1, K5), kdo stál s ním a kdo by mu nejvíc odporoval. Jen z toho, co student udělal (prehledObdobi
  // v src/lib/tvoje-obdobi.ts); nic se nehodnotí. Tlačítko Vytisknout dá na papír jen tenhle oddíl (global.css › Tisk).
  // <MojeFilozofie prehled={…} razitka={…} upravit="/denik/antika/" prvniCesta={…} />
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import type { OtazkaPrehledu, OsobaKatalogu } from '../../lib/tvoje-obdobi';
  import type { UdajeRazitka } from '../ostrovy/bloky-typy';
  import { NEJBLIZ } from '../../lib/tvoje-obdobi';
  import { OTAZKY_SEBEHODNOCENI, type CastSebehodnoceni } from '../../lib/sebehodnoceni';
  import type { SebehodnoceniCesty } from '../../lib/tvoje-obdobi';

  interface Props {
    prehled: OtazkaPrehledu[];
    razitka: Record<string, UdajeRazitka>;
    /** kde se odpověď Teď dá přepsat (Tvoje antika) */
    upravit?: string;
    prvniCesta?: { nazev: string; adresa: string };
  }
  let { prehled, razitka, upravit, prvniCesta }: Props = $props();

  /** Kdo stál se studentem: volba na ose hlasů první, pak myslitelé z cest; každý jednou, nejvýš tři. */
  const sNim = (o: OtazkaPrehledu): OsobaKatalogu[] => {
    const lide = [...(o.nejbliz ? [o.nejbliz.osoba] : []), ...o.blizci.map((b) => b.osoba)];
    return lide.filter((x, i) => lide.findIndex((y) => y.id === x.id) === i).slice(0, NEJBLIZ);
  };

  /** Obě poznámky sebehodnocení v pevném pořadí; nenapsaná zůstane prázdná. */
  const castiSebe = (s: SebehodnoceniCesty): [CastSebehodnoceni, string | undefined][] => [['umim', s.umim], ['nejsem', s.nejsem]];

  function vytisknout() {
    const html = document.documentElement;
    html.dataset.tisk = 'filozofie';
    const konec = () => {
      delete html.dataset.tisk;
      window.removeEventListener('afterprint', konec);
    };
    window.addEventListener('afterprint', konec);
    window.print();
  }
</script>

<section class="moje-filozofie" aria-labelledby="moje-filozofie">
  <div class="mf-hlava">
    <h2 class="t-h2 mf-nadpis" id="moje-filozofie">Moje filozofie</h2>
    {#if prehled.length}<button class="blok__tl blok__tl--tiche netisk" type="button" onclick={vytisknout}>Vytisknout na jednu stránku</button>{/if}
  </div>
  {#if prehled.length === 0}
    <p class="mf-prazdna">Tady se poskládá, co si myslíš o velkých otázkách: tvoje první odpověď, ta dnešní a kdo z filozofů stál s tebou. Zatím tu nic není.</p>
    {#if prvniCesta}<p class="t-ovladani netisk"><a href={prvniCesta.adresa}>Začít cestou {prvniCesta.nazev}</a></p>{/if}
  {:else}
    <ol class="mf-otazky">
      {#each prehled as o (o.slug)}
        <li class="mf-otazka" aria-labelledby={`mf-${o.slug}`}>
          <p class="mf-cislo">velká otázka {o.cislo}</p>
          <h3 class="t-h3 mf-zneni" id={`mf-${o.slug}`}><a href={o.adresa}>{o.otazka}</a></h3>
          <div class="mf-odpovedi">
            <div class="mf-sloupec">
              <p class="mf-popis">Na začátku</p>
              {#if o.zacatek}<p class="mf-pero">{o.zacatek}</p>{:else}<p class="mf-pero mf-nic">Bez první odpovědi.</p>{/if}
            </div>
            <div class="mf-sloupec">
              <p class="mf-popis">Teď{#if !o.ted && o.pravidla.length}<span class="mf-zdroj"> · pravidlo z cesty <a href={o.pravidla[0].adresa}>{o.pravidla[0].cesta}</a></span>{/if}</p>
              {#if o.ted}<p class="mf-pero">{o.ted}</p>{:else if o.pravidla.length}<p class="mf-pero">{o.pravidla[0].text}</p>{:else}<p class="mf-pero mf-nic">Ještě nenapsáno.</p>{/if}
            </div>
          </div>
          {#if o.sebehodnoceni?.length}
            <ul class="mf-sebe">
              {#each o.sebehodnoceni as s (s.adresa)}
                <li>
                  <p class="mf-kde">na konci cesty <a href={s.adresa}>{s.cesta}</a></p>
                  <div class="mf-odpovedi">
                    {#each castiSebe(s) as [cast, text] (cast)}
                      <div class="mf-sloupec">
                        <p class="mf-popis">{OTAZKY_SEBEHODNOCENI[cast]}</p>
                        {#if text}<p class="mf-pero">{text}</p>{:else}<p class="mf-pero mf-nic">Nenapsáno.</p>{/if}
                      </div>
                    {/each}
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
          {#if o.pravidla.length > (o.ted ? 0 : 1)}
            <ul class="mf-pravidla">
              {#each o.pravidla.slice(o.ted ? 0 : 1) as p (p.adresa)}
                <li><p class="mf-kde">pravidlo z cesty <a href={p.adresa}>{p.cesta}</a></p><p class="mf-pero">{p.text}</p></li>
              {/each}
            </ul>
          {/if}
          {#if sNim(o).length || o.odpurce}
            <div class="mf-lide">
              {#if sNim(o).length}
                <div class="mf-skupina">
                  <p class="mf-popis">Kdo stál se mnou</p>
                  <ul class="mf-razitka">
                    {#each sNim(o) as l (l.id)}
                      <li>
                        <RazitkoCloveka razitko={razitka[l.id]} obdobi={l.obdobi} velikost={56} />
                        {#if l.adresa}<a href={l.adresa}>{l.jmeno}</a>{:else}<span>{l.jmeno}</span>{/if}
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}
              {#if o.odpurce}
                {@const p = o.odpurce}
                <div class="mf-skupina mf-proti">
                  <p class="mf-popis">Kdo by mi nejvíc odporoval</p>
                  <div class="mf-odpurce">
                    <RazitkoCloveka razitko={razitka[p.osoba.id]} obdobi={p.osoba.obdobi} velikost={56} />
                    <div>
                      <p class="mf-jmeno">{#if p.osoba.adresa}<a href={p.osoba.adresa}>{p.osoba.jmeno}</a>{:else}{p.osoba.jmeno}{/if}</p>
                      <p class="mf-kde"><a href={p.adresa}>{p.cesta}</a> · <span class="vizualne-skryte">{'zastával '}</span>{p.odpoved}</p>
                      {#if p.duvod}<p class="mf-duvod">{p.duvod}</p>{/if}
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
    </ol>
    {#if upravit}<p class="t-ovladani mf-upravit netisk"><a href={upravit}>Přepsat svoje odpovědi a vidět všechny filozofy</a></p>{/if}
  {/if}
</section>

<style>
  .moje-filozofie { margin-top: var(--s-7); }
  .mf-hlava { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: var(--s-2) var(--s-5); }
  .mf-nadpis { margin: 0; }
  .mf-prazdna { margin: var(--s-4) 0 var(--s-3); padding: 26px 24px 20px; background: var(--list); box-shadow: var(--lezi); }
  .mf-otazky { margin: var(--s-5) 0 0; padding: 0; list-style: none; display: grid; gap: var(--s-6); }
  /* Každá otázka je jeden list zápisníku; text se nenatáčí (Pravidlo střídmosti). */
  .mf-otazka { padding: 30px 32px 32px; background: var(--list); box-shadow: var(--lezi); }
  .mf-cislo { margin: 0; font-family: var(--font-ruka); font-size: var(--fs-ruka); color: var(--ink-2); }
  .mf-zneni { margin: 2px 0 var(--s-4); }
  .mf-zneni a { color: inherit; text-decoration-color: var(--tuzka); text-underline-offset: .18em; }
  .mf-odpovedi { display: grid; gap: var(--s-4); }
  /* Oba sloupce mají linky až do stejné výšky: spodní okraj odpovědí je jedna čára, ať je text kratší nebo delší. */
  .mf-sloupec { display: flex; flex-direction: column; }
  .mf-sloupec .mf-pero { flex: 1; }
  @media (min-width: 700px) { .mf-sloupec .mf-pero { min-height: 60px; } }
  @media (min-width: 700px) { .mf-odpovedi { grid-template-columns: 1fr 1fr; gap: var(--s-6); } }
  .mf-popis { margin: 0 0 var(--s-1); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--ink-2); }
  /* Studentova slova jeho perem na linkách (bod 3). */
  .mf-pero {
    margin: 0;
    font-family: var(--font-ruka);
    font-size: var(--fs-ruka);
    line-height: 30px;
    color: var(--pero);
    background: repeating-linear-gradient(transparent 0 29px, var(--linka) 29px 30px);
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .mf-pero.mf-nic { font-family: var(--font-sans); font-size: var(--fs-ovladani); color: var(--ink-3); }
  .mf-zdroj { font-weight: 400; color: var(--ink-2); }
  .mf-zdroj a { color: inherit; }
  .mf-sebe { margin: var(--s-4) 0 0; padding: 0; list-style: none; }
  .mf-sebe li { padding-top: var(--s-3); border-top: 1px dashed var(--tuzka); }
  .mf-sebe .mf-kde { margin: 0 0 var(--s-2); }
  .mf-sebe a { color: inherit; }
  .mf-pravidla { margin: var(--s-4) 0 0; padding: 0; list-style: none; }
  .mf-pravidla li { padding-top: var(--s-3); border-top: 1px dashed var(--tuzka); }
  .mf-pravidla a { color: inherit; }
  .mf-lide { display: grid; gap: var(--s-5); margin-top: var(--s-5); padding-top: var(--s-4); border-top: 1px dashed var(--tuzka); }
  /* Razítka v pravidelné mřížce: každé se jménem pod sebou, sloupce stejně široké. */
  /* Razítko vlevo a jméno vedle, jako u odpůrce níž: razítka stojí v jednom sloupci pod nadpisem, ne odsazená. */
  .mf-razitka { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--s-3) var(--s-4); margin: var(--s-2) 0 0; padding: 0; list-style: none; }
  .mf-razitka li { display: grid; grid-template-columns: 56px 1fr; align-items: center; gap: var(--s-2); font-family: var(--font-sans); font-weight: 600; font-size: var(--fs-ovladani); line-height: 1.25; }
  .mf-razitka :is(a, span) { display: inline-flex; align-items: center; min-height: var(--dotyk); color: var(--ink); }
  .mf-jmeno a, .mf-kde a { display: inline-flex; align-items: center; min-height: 24px; color: var(--ink); }
  .mf-odpurce { display: grid; grid-template-columns: 56px 1fr; gap: var(--s-3); align-items: start; margin-top: var(--s-2); }
  .mf-jmeno { margin: 6px 0 0; font-family: var(--font-sans); font-weight: 600; font-size: var(--fs-ovladani-l); }
  .mf-kde { margin: var(--s-1) 0 0; font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .mf-duvod { margin: var(--s-2) 0 0; font-size: 17px; line-height: 1.5; color: var(--ink-2); }
  .mf-upravit { margin: var(--s-4) 0 0; }
  .mf-upravit a { display: inline-flex; align-items: center; min-height: var(--dotyk); }
  @media (max-width: 699px) {
    .mf-otazka { padding: 22px 18px 24px; }
  }
</style>
