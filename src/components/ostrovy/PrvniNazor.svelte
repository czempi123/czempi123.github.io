<script lang="ts">
  // Tvůj první názor: student odpoví na velkou otázku dřív, než uvidí filozofy. Odpověď jde do deníku;
  // po uložení nebo přeskočení se odkryje zbytek stránky (hlasy, cesty, Změnil se?).
  // Použití na stránce otázky (src/pages/otazka/[otazka].astro):
  // <PrvniNazor client:load slug="jak-poznam-pravdu" otazka="Jak poznám, co je pravda?" odkaz="/otazka/jak-poznam-pravdu/#prvni-nazor" />
  // Zbytek stránky je v prvku #<slug>-po; do odkrytí ho skrývá atribut data-otazka-zavreno na <html>.
  import { onMount, tick } from 'svelte';
  import { najdiZapis, ulozZapis, stavBloku, ulozStavBloku } from '../../lib/denik';
  import { klicOtazky } from '../../lib/otazky';
  import BlokHlava from './BlokHlava.svelte';

  interface Props { slug: string; otazka: string; odkaz: string }
  let { slug, otazka, odkaz }: Props = $props();
  const klic = klicOtazky(slug);

  let odpoved = $state('');
  let ulozeno = $state(false);
  let upravuji = $state(false);
  let otevreno = $state(false);

  onMount(() => {
    const z = najdiZapis(klic.prvni);
    if (z) {
      odpoved = z.odpoved;
      ulozeno = true;
    }
    const s = stavBloku<{ preskoceno?: boolean }>(klic.stav);
    if (z || s?.preskoceno) odkryj(false);
  });

  async function odkryj(fokus: boolean) {
    otevreno = true;
    document.documentElement.removeAttribute('data-otazka-zavreno');
    if (!fokus) return;
    await tick();
    document.getElementById(`${slug}-hlasy-nadpis`)?.focus();
  }

  function uloz() {
    if (!odpoved.trim()) return;
    ulozZapis({ id: klic.prvni, otazka: `${otazka} Můj první názor`, odpoved: odpoved.trim(), odkaz, druh: 'stanovisko' });
    ulozeno = true;
    window.dispatchEvent(new CustomEvent('atlas:prvni-nazor', { detail: { slug } }));
    const prvne = !otevreno;
    upravuji = false;
    if (prvne) odkryj(true);
  }

  function preskoc() {
    ulozStavBloku(klic.stav, { preskoceno: true });
    odkryj(true);
  }
</script>

<section class="blok prvni-nazor" id="prvni-nazor" aria-labelledby={`${slug}-prvni-otazka`}>
  <BlokHlava nadtitulek="Tvůj první názor" />
  <h2 class="t-h3 blok__otazka" id={`${slug}-prvni-otazka`}>Co si o tom myslíš ty?</h2>
  <label class="blok__popis" for={`${slug}-prvni-pole`}>Odpověz dřív, než uvidíš filozofy. Na konci se k&nbsp;odpovědi vrátíš.</label>
  <textarea
    class="blok__pole"
    id={`${slug}-prvni-pole`}
    rows="3"
    bind:value={odpoved}
    placeholder="Napiš pár slov…"
    disabled={ulozeno && !upravuji}
  ></textarea>
  <!-- Hlavní čin první (z pole tabulátorem rovnou na Uložit), Přeskočit tiše za ním. -->
  <div class="blok__akce">
    {#if !ulozeno || upravuji}
      <button class="blok__tl blok__tl--hlavni" type="button" onclick={uloz} disabled={!odpoved.trim()}>
        {otevreno ? 'Uložit do deníku' : 'Uložit a ukázat filozofy'}
      </button>
      {#if !otevreno}
        <button class="blok__tl blok__tl--tiche" type="button" onclick={preskoc}>Přeskočit</button>
      {/if}
    {:else}
      <p class="blok__ulozeno">Tvůj první názor je uložený v deníku.</p>
      <button class="blok__tl blok__tl--tiche" type="button" onclick={() => (upravuji = true)}>Upravit</button>
    {/if}
  </div>
</section>

<style>
  .prvni-nazor { margin: 0; }
</style>
