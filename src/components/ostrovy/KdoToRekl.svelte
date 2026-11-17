<script lang="ts">
  // Kdo to řekl? (herna-v1, K1; plátno D5 › Kdo to řekl?): série otočných kartiček s větou z pramene. Student tipne,
  // čí věta je, razítkem jednoho ze tří až čtyř lidí. Pod každým razítkem jedna věta z dat, čím se člověk zabýval
  // (K2, zásada Pointa není paměť): hledá se, komu myšlenka sedí, ne koho si student pamatuje. Sedí: kartička se
  // otočí a ukáže nahoře, o čem věta je (pointa z YAML), pod tím jméno, dílo a místo a odkaz na stránku osoby. Jinak „zkus to jinak“ s jednou větou, kam se podívat; zkusené razítko zůstane zakázané.
  // Další karta v patě rámu rozdá další kartičku. Nic se nepočítá; do deníku jen stav (běžící karta a tipy).
  // Použití v MDX (obsah v src/content/bloky/dilna-kdo-rekl.yaml, druh: kdo-rekl):
  // <KdoToRekl id="dilna-kdo-rekl" />
  import { onMount, tick } from 'svelte';
  import { stavBloku, ulozStavBloku, smazStavBloku } from '../../lib/denik';
  import { radek, odstavce } from '../../lib/bloky';
  import { platnyStavKdoRekl, vyresena, hotovaSerie, verdikt, SEDI } from '../../lib/herna';
  import { omezenyPohyb } from '../../lib/pohyb';
  import RamAktivity from './RamAktivity.svelte';
  import BlokDal from './BlokDal.svelte';
  import RazitkoCloveka from '../ui/RazitkoCloveka.svelte';
  import type { ClovekBloku, Dal } from './bloky-typy';

  interface KartaKdoRekl {
    /** id citátu ze zdroje.yaml */
    citat: string;
    veta: string;
    /** id osoby, která větu řekla */
    spravna: string;
    jmeno: string;
    /** „Rukojeť 5“, „Zapsal Platón: Obrana Sókratova 38a“ */
    puvod: string;
    /** stránka osoby, když ji má */
    adresa?: string;
    napoveda: string;
    /** o čem věta je, nahoře na rubu */
    pointa: string;
    /** možnosti v pořadí podle semínka; id, razítko a věta, čím se člověk zabýval, z dat */
    moznosti: { id: string; clovek: ClovekBloku; myslenka: string }[];
  }
  interface Props {
    id: string;
    blok: { obdobi: number; nadtitulek: string; nazev: string; scena?: string; otazka: string; pokyn: string; karty: KartaKdoRekl[] };
    odkaz: string;
    dal?: Dal;
  }
  let { id, blok, odkaz, dal }: Props = $props();

  const n = $derived(blok.karty.length);
  let karta = $state(0);
  let tipy = $state<string[][]>(blok.karty.map(() => []));
  let cerstve = $state(false);
  /** karta vznikla činem studenta (Další karta, Začít znovu): rozdá se */
  let rozdat = $state(false);
  let hlaseni = $state('');
  let oblast = $state<HTMLElement>();

  const k = $derived(blok.karty[karta]);
  const tipyKarty = $derived(tipy[karta] ?? []);
  const vyreseno = $derived(vyresena(tipyKarty, k.spravna));
  const posledniTip = $derived(tipyKarty.at(-1));
  const zkus = $derived(!vyreseno && posledniTip ? verdikt(false, k.napoveda) : null);
  const hotovo = $derived(hotovaSerie({ karta, tipy }, blok.karty.map((x) => x.spravna)));
  const zacato = $derived(tipy.some((t) => t.length > 0));

  onMount(() => {
    const s = platnyStavKdoRekl(stavBloku(id), blok.karty.map((x) => ({ moznosti: x.moznosti.map((m) => m.id) })));
    if (s) ({ karta, tipy } = s);
  });

  function ulozStav() {
    if (!tipy.some((t) => t.length)) return smazStavBloku(id);
    ulozStavBloku(id, { karta, tipy }, { odkaz, otazka: blok.otazka, druh: 'kdo-rekl', hotovo });
  }
  const prvek = (vyber: string) => document.getElementById(id)?.querySelector<HTMLElement>(vyber);

  async function tipni(osoba: string) {
    if (vyreseno || tipyKarty.includes(osoba)) return;
    tipy = tipy.map((t, i) => (i === karta ? [...t, osoba] : t));
    cerstve = true;
    rozdat = false;
    ulozStav();
    const jmeno = k.moznosti.find((m) => m.id === osoba)?.clovek.jmeno ?? '';
    if (osoba === k.spravna) {
      hlaseni = `${SEDI} Řekl to: ${k.jmeno}. ${k.pointa} ${k.puvod}.`;
      await tick();
      (prvek('.serie__dalsi') ?? prvek('.otocna__rub'))?.focus();
    } else {
      hlaseni = `${jmeno}: zkus to jinak.`;
      await tick();
      oblast?.focus();
    }
  }

  async function dalsi() {
    if (!vyreseno || karta >= n - 1) return;
    karta += 1;
    cerstve = false;
    rozdat = !omezenyPohyb();
    hlaseni = `Karta ${karta + 1} z ${n}.`;
    ulozStav();
    await tick();
    prvek('.razitko-odpoved:not(:disabled)')?.focus();
  }

  async function znovu() {
    karta = 0;
    tipy = blok.karty.map(() => []);
    cerstve = false;
    rozdat = !omezenyPohyb();
    hlaseni = `Karta 1 z ${n}.`;
    smazStavBloku(id);
    await tick();
    prvek('.razitko-odpoved')?.focus();
  }
</script>

{#snippet vazba()}
  {#if hotovo}
    <p class="blok__zpetna-titulek">Všechny karty jsou otočené.</p>
    <ul class="souhrn">
      {#each blok.karty as c (c.citat)}
        <li><span class="souhrn__veta">„{@html radek(c.veta)}“</span> <span class="souhrn__kdo">{c.jmeno}</span></li>
      {/each}
    </ul>
  {:else if zkus}
    <p class="zkus"><svg class="zkus__sipka" width="30" height="18" viewBox="0 0 30 18" aria-hidden="true" focusable="false"><path d="M2 12c6-7 15-9 24-4M20 3l6 5-7 3" /></svg>{zkus.slovo}</p>
    {#if zkus.veta}<p>{@html radek(zkus.veta)}</p>{/if}
  {/if}
{/snippet}

{#snippet akce()}
  {#if hotovo}
    <BlokDal {dal} />
  {:else}
    <button class="blok__tl blok__tl--hlavni serie__dalsi" type="button" onclick={dalsi}>Další karta</button>
  {/if}
{/snippet}

<RamAktivity
  {id}
  obdobi={blok.obdobi}
  trida="kdo-rekl"
  nadtitulek={blok.nadtitulek}
  nazev={blok.nazev}
  labelledby={`${id}-otazka`}
  vazba={hotovo || zkus ? vazba : undefined}
  vazbaPopisek={hotovo ? 'Otočené karty' : 'Zkus to jinak'}
  {cerstve}
  bind:vazbaPrvek={oblast}
  znovu={zacato ? znovu : undefined}
  hlavni={hotovo ? (dal ? akce : undefined) : vyreseno ? akce : undefined}
>
  {#if blok.scena}
    {#each odstavce(blok.scena) as o, i (i)}<p class="blok__scena" data-cast="scena">{@html o}</p>{/each}
  {/if}
  <h3 class="t-h3 blok__otazka blok__otazka--mala" id={`${id}-otazka`} data-cast="otazka">{@html radek(blok.otazka)}</h3>

  <div class="serie" data-cast="moznosti">
    <p class="serie__postup t-popisek">Karta {karta + 1} z {n}</p>
    {#key karta}
      <div
        class={['otocna', 'kartka', vyreseno && 'otocena', karta < n - 1 && 'kartka--balicek', rozdat && 'rozdat']}
        style={`--nat: ${[-1, .8, -.6, 1.2, -.9, .5, -1.1, .7][karta % 8]}deg`}
      >
        <div class="otocna__vnitrek">
          <figure class="otocna__lic kartka__strana" aria-hidden={vyreseno ? 'true' : undefined} inert={vyreseno}>
            <blockquote><p>„{@html radek(k.veta)}“</p></blockquote>
            <span class="kartka__otaznik" aria-hidden="true">?</span>
          </figure>
          <div class="otocna__rub kartka__strana" aria-hidden={vyreseno ? undefined : 'true'} inert={!vyreseno} tabindex="-1" role="group" aria-label="Rub karty">
            <p class="kartka__pointa">{@html radek(k.pointa)}</p>
            <p class="kartka__veta">„{@html radek(k.veta)}“</p>
            <p class="kartka__kdo"><span class="kartka__jmeno">{k.jmeno}</span> <span class="kartka__puvod">{k.puvod}</span></p>
            {#if k.adresa}
              <a class="kartka__odkaz" href={k.adresa} aria-label={`Otevřít stránku: ${k.jmeno}`}>Otevřít stránku</a>
            {/if}
          </div>
        </div>
        {#if vyreseno}<span class={['herni-otisk', 'kartka__otisk', cerstve && 'otisk']} aria-hidden="true">sedí</span>{/if}
      </div>
    {/key}

    {#if !vyreseno}<p class="odpovedi__pokyn" id={`${id}-pokyn`}>{@html radek(blok.pokyn)}</p>{/if}
    <ul class="odpovedi" aria-label="Kdo to řekl?" aria-describedby={vyreseno ? undefined : `${id}-pokyn`}>
      {#each k.moznosti as m (m.id)}
        {@const zkuseno = tipyKarty.includes(m.id)}
        <li>
          <button
            class={['razitko-odpoved', 'vystouple', vyreseno && m.id === k.spravna && 'razitko-odpoved--trefa']}
            type="button"
            disabled={vyreseno || zkuseno}
            onclick={() => tipni(m.id)}
          >
            <RazitkoCloveka razitko={m.clovek.razitko} obdobi={m.clovek.obdobi} velikost={52} />
            <span class="odpoved__text">
              <span class="odpoved__jmeno">{m.clovek.jmeno}</span>
              <span class="odpoved__myslenka">{@html radek(m.myslenka)}</span>
            </span>
            {#if zkuseno && m.id !== k.spravna}<span class="vizualne-skryte">(zkusil jsi)</span>{/if}
          </button>
        </li>
      {/each}
    </ul>
  </div>
  <p class="vizualne-skryte" aria-live="polite">{hlaseni}</p>
</RamAktivity>

<style>
  .serie { margin: var(--s-3) 0 0; }
  .serie__postup { margin: 0 0 var(--s-3); color: var(--ink-2); }
  /* Kartička: ležící list s větou; pod ní balíček zbylých karet (dva okraje papíru), když nějaké zbývají. */
  .kartka { position: relative; max-width: 540px; margin: 0 0 var(--s-6); rotate: calc(var(--nat, 0deg) * var(--natoceni)); }
  .kartka--balicek::before, .kartka--balicek::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--list);
    box-shadow: var(--lezi);
    translate: 6px 6px;
    rotate: calc(1.6deg * var(--natoceni));
  }
  .kartka--balicek::after { translate: 11px 11px; rotate: calc(-1.2deg * var(--natoceni)); opacity: .8; }
  .kartka__strana {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 200px;
    margin: 0;
    padding: 30px 30px 26px;
    background: var(--list);
    box-shadow: var(--lezi);
  }
  .kartka__strana blockquote { margin: 0; }
  .kartka__strana blockquote p { margin: 0; font-size: var(--fs-perex); line-height: 1.4; text-wrap: balance; }
  .kartka__otaznik { position: absolute; right: 16px; top: 8px; font-family: var(--font-ruka); font-size: 30px; line-height: 1; color: var(--ruka); }
  /* Rub: papír lístku; nahoře, o čem věta je (tiskem, velké), pod tím věta menší a jméno s dílem a místem. */
  .otocna__rub { background: var(--listek); }
  .otocna__rub:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .kartka__pointa { margin: 0 0 var(--s-3); font-family: var(--font-serif); font-size: var(--fs-perex); line-height: 1.35; color: var(--ink); text-wrap: pretty; }
  .kartka__veta { margin: 0 0 var(--s-2); font-style: italic; font-size: calc(var(--meritko) * 16px); line-height: 1.45; color: var(--ink-2); }
  .kartka__kdo { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: var(--s-2); margin: 0; }
  .kartka__jmeno { font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--ink); }
  .kartka__puvod { font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--ink-2); }
  .kartka__odkaz { align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; margin-top: var(--s-1); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--ink); text-decoration-color: var(--tuzka); text-decoration-thickness: 1.5px; text-underline-offset: 5px; }
  .kartka__odkaz:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .kartka__otisk { position: absolute; right: 6px; bottom: -26px; z-index: 2; }

  /* Odpovědi: razítka lidí na vystouplých lístcích, vedle razítka jméno a věta, čím se člověk zabýval. Na úzkém
     rámu pod sebou (věta by ve dvou sloupcích na 390 px měla šest řádků), od 520 px dva sloupce. Zkusené je zakázané
     (čárkovaný okraj tužkou, global.css). */
  .odpovedi__pokyn { margin: 0 0 var(--s-3); font-family: var(--font-ruka); font-size: var(--fs-ruka); line-height: var(--lh-ruka); color: var(--ruka); }
  .odpovedi { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-3); margin: 0; padding: 0; list-style: none; }
  @container (min-width: 520px) { .odpovedi { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .odpovedi li { display: flex; }
  .razitko-odpoved {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    width: 100%;
    min-height: 44px;
    padding: var(--s-3);
    border: 0;
    border-radius: var(--r-ovladani);
    color: var(--ink);
    font-family: var(--font-sans);
    text-align: left;
    cursor: pointer;
  }
  .razitko-odpoved :global(.razitko-cloveka) { flex: none; }
  .odpoved__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .odpoved__jmeno { font-size: var(--fs-ovladani); font-weight: 600; line-height: 1.2; }
  .odpoved__myslenka { font-family: var(--font-serif); font-size: calc(var(--meritko) * 15px); font-weight: 400; line-height: 1.35; color: var(--ink-2); }
  .razitko-odpoved:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  /* Trefa po otočení: vtlačená (zvolené je vtlačené) s tučným jménem; ostatní jen zakázané. */
  .razitko-odpoved.razitko-odpoved--trefa:disabled { outline: 0; box-shadow: var(--vtla); color: var(--ink); cursor: default; }
  .razitko-odpoved--trefa .odpoved__jmeno { text-decoration: underline; text-decoration-color: var(--pero); text-decoration-thickness: 2px; text-underline-offset: 4px; }
  .razitko-odpoved:disabled :global(.razitko-cloveka) { opacity: .55; }
  .razitko-odpoved--trefa:disabled :global(.razitko-cloveka) { opacity: 1; }

  .souhrn { display: grid; gap: var(--s-2); margin: 0; padding: 0; list-style: none; }
  .souhrn li { display: flex; flex-wrap: wrap; column-gap: var(--s-2); }
  .souhrn__veta { font-style: italic; }
  .souhrn__kdo { font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; color: var(--ink); }
  .souhrn__kdo::before { content: '· '; color: var(--ink-3); }

  .zkus { display: flex; align-items: center; gap: var(--s-2); margin: 0 0 var(--s-2); font-family: var(--font-ruka); font-size: calc(var(--meritko) * 22px); line-height: 1.3; color: var(--ruka); }
  .zkus__sipka { flex: none; fill: none; stroke: var(--tuzka); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
