<script lang="ts">
  // Dva životy (Doba a lidé, interaktivita-v1, K2): dva pruhy životů na jedné ose, společná léta zvýrazněná,
  // pod nimi věta z časové logiky mapy („Žili současně 37 let“, „Dělí je 519 let. To je asi sedm lidských životů.“).
  // Student vybere ze seznamu jiného člověka; osa se přepočítá, pruhy se posunou a věta se přepíše (aria-live).
  // Při omezeném pohybu pruhy skočí. Nic se neukládá. Bez JavaScriptu stojí výchozí dvojice s větou, bez nabídky.
  // Vkládá ho DobaALide.astro přes src/components/osobnost/DvaZivoty.astro; pravidla výběru v src/lib/dvojice.ts.
  import { onMount } from 'svelte';
  import { naAstro, vzdalenost, zAstro, zivotOsoby, type OsobaMapy } from '../../lib/cas-mapy';
  import { naProcenta, osaDvou, znackyOsy } from '../../lib/bloky';
  import { rok as rokText } from '../../lib/casy';

  type Clovek = OsobaMapy & { obdobi: number; zivotText: string };
  interface Props {
    id: string;
    /** osoba stránky (u společného profilu hlavní osoba) */
    a: Clovek;
    /** id výchozího druhého člověka (vychoziDvojice) */
    vychozi: string;
    /** nabídka: nejdřív Doba a lidé, pak období */
    skupiny: { nazev: string; lide: Clovek[] }[];
  }
  let { id, a, vychozi, skupiny }: Props = $props();

  const podleId = new Map(skupiny.flatMap((s) => s.lide).map((o) => [o.id, o]));
  let vybrany = $state(vychozi);
  let pripraveno = $state(false);
  onMount(() => {
    pripraveno = true;
  });

  let b = $derived(podleId.get(vybrany) ?? podleId.get(vychozi)!);
  let osa = $derived(osaDvou(a, b)!);
  let veta = $derived(vzdalenost(a, b)!.text);
  const pct = (r: number) => naProcenta(osa, r);

  /** Pruh života v procentech osy (astronomické roky). */
  const pruh = (o: Clovek) => {
    const z = zivotOsoby(o)!;
    return { od: naAstro(z.od), do: naAstro(z.do) };
  };
  let pa = $derived(pruh(a));
  let pb = $derived(pruh(b));
  /** Společná léta, nebo mezera mezi životy. */
  let spolecne = $derived(Math.max(pa.od, pb.od) <= Math.min(pa.do, pb.do));
  let usek = $derived(
    spolecne
      ? { od: Math.max(pa.od, pb.od), do: Math.min(pa.do, pb.do) }
      : pa.do < pb.od ? { od: pa.do, do: pb.od } : { od: pb.do, do: pa.od },
  );

  // Popisek nad pruhem: v levé polovině osy od začátku pruhu, v pravé zarovnaný na jeho konec.
  const zarovnani = (p: { od: number; do: number }) => {
    const l = pct(p.od);
    const r = pct(p.do);
    return (l + r) / 2 > 50 ? `text-align:right;padding-right:${Math.max(0, 100 - r)}%` : `padding-left:${Math.max(0, l)}%`;
  };

  let znacky = $derived(znackyOsy(osa));
  let krajniEra = $derived(zAstro(osa.do) < 0 ? 'př. n. l.' : zAstro(osa.od) > 0 ? 'n. l.' : '');
  const popisZnacky = (r: number) => (krajniEra ? String(Math.abs(zAstro(r))) : rokText(zAstro(r)));
</script>

<!-- Obraz s větou je figure (věta je její poslední potomek, figcaption); nabídka stojí za ním ve společném obalu
     s id, aby ji čtečka nečetla jako pokračování popisku obrázku (revize R, nález 9). -->
<div class="dva" id={id}>
<figure class="dva__obraz">
  <!-- Popisek prvního života nad pruhy, druhého pod nimi: společná léta (nebo mezera) leží jen mezi pruhy a žádný text nepřetne. -->
  <p class="dva__popis dva__popis--a t-popisek obdobi-{a.obdobi}" data-kdo="a" style={zarovnani(pa)}>
    <strong>{a.jmeno}</strong> <span class="t-letopocet">{a.zivotText}</span>
  </p>
  <div class="dva__pasy" aria-hidden="true">
    {#each znacky as z (z)}<span class="dva__mrizka" style={`left:${pct(z)}%`}></span>{/each}
    <span
      class={['dva__usek', spolecne ? 'dva__usek--spolecne' : 'dva__usek--mezera']}
      style={`left:${pct(usek.od)}%;width:${Math.max(pct(usek.do) - pct(usek.od), 0)}%`}
    ></span>
    {#each [{ o: a, p: pa, kdo: 'a' }, { o: b, p: pb, kdo: 'b' }] as r (r.kdo)}
      <span class="dva__draha obdobi-{r.o.obdobi}" data-kdo={r.kdo}>
        <span class="dva__pruh" style={`left:${pct(r.p.od)}%;width:${Math.max(pct(r.p.do) - pct(r.p.od), 0.8)}%`}></span>
      </span>
    {/each}
  </div>
  <p class="dva__popis dva__popis--b t-popisek obdobi-{b.obdobi}" data-kdo="b" style={zarovnani(pb)}>
    <strong>{b.jmeno}</strong> <span class="t-letopocet">{b.zivotText}</span>
  </p>
  <div class={['dva__osa', 't-popisek', 't-letopocet', znacky.length > 4 && 'dva__osa--husta']} aria-hidden="true">
    {#each znacky as z (z)}<span style={`left:${pct(z)}%`}>{popisZnacky(z)}</span>{/each}
  </div>
  {#if krajniEra}<p class="dva__era t-popisek" aria-hidden="true">{krajniEra}</p>{/if}
  <figcaption class="dva__veta" aria-live="polite">{veta}</figcaption>
</figure>

  {#if pripraveno}
    <div class="dva__volba">
      <label class="t-ovladani dva__popisek" for={`${id}-vyber`}>Druhý život</label>
      <select id={`${id}-vyber`} class="dva__vyber" bind:value={vybrany}>
        {#each skupiny as s (s.nazev)}
          <optgroup label={s.nazev}>
            {#each s.lide as o (o.id)}<option value={o.id}>{o.jmeno} · {o.zivotText}</option>{/each}
          </optgroup>
        {/each}
      </select>
    </div>
  {/if}
</div>

<style>
  .dva__obraz { margin: 0; }
  .dva__pasy { position: relative; display: grid; gap: 14px; padding: 10px 0; }
  .dva__mrizka { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--rule); }
  /* Společná léta: tint období mezi pruhy s čárkovanými okraji; mezera mezi životy: čárkovaná čára mezi pruhy. */
  .dva__usek { position: absolute; transition: left var(--pohyb-kamera), width var(--pohyb-kamera); }
  .dva__usek--spolecne { top: 0; bottom: 0; background: var(--pc-tint); border-inline: 1px dashed var(--pc); }
  .dva__usek--mezera { top: 50%; height: 0; border-top: 2px dashed var(--muted); }
  .dva__popis {
    margin: 0;
    color: var(--ink);
    transition: padding var(--pohyb-kamera);
  }
  .dva__popis--b { margin-bottom: var(--s-2); }
  .dva__popis strong { font-weight: 600; }
  .dva__popis .t-letopocet { color: var(--ink-2); white-space: nowrap; }
  .dva__draha { position: relative; display: block; height: 12px; }
  .dva__pruh {
    position: absolute;
    top: 0;
    height: 12px;
    border-radius: var(--r-full);
    background: var(--pc);
    transition: left var(--pohyb-kamera), width var(--pohyb-kamera);
  }

  .dva__osa { position: relative; height: 22px; border-top: 1px solid var(--muted); color: var(--ink-2); }
  .dva__osa span { position: absolute; top: 4px; transform: translateX(-50%); white-space: nowrap; }
  .dva__era { margin: 0; text-align: right; color: var(--ink-2); }
  .dva__veta {
    margin: var(--s-3) 0 0;
    font-family: var(--font-serif);
    font-size: var(--fs-text);
    line-height: 1.45;
    color: var(--ink);
  }
  .dva__volba { display: grid; gap: var(--s-1); margin-top: var(--s-4); max-width: 420px; }
  .dva__popisek { color: var(--ink-2); }
  .dva__vyber {
    display: block;
    width: 100%;
    min-height: 44px;
    padding: var(--s-2) var(--s-3);
    border: 1px solid var(--muted);
    border-radius: var(--r-sm);
    background: var(--surface);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani-l);
    cursor: pointer;
  }
  .dva__vyber:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  @media (max-width: 599px) {
    .dva__osa--husta span:nth-child(even) { visibility: hidden; }
  }
</style>
