<script lang="ts">
  // Skladatel hodiny (/hodina/nova/): vlevo výběr z katalogu zastavení po stránkách, vpravo hodina
  // (na telefonu pod sebou, s počtem zvolených zastavení přilepeným nahoře nad výběrem).
  // Hodina se ukládá v prohlížeči (src/lib/hodiny-uloziste.ts) a do souboru; odkaz pro studenty nese jen
  // název, pořadí a podobu zastavení na plátně (adresaHodiny), poznámky nikdy. Logika výběru je v src/lib/skladatel.ts.
  // U bloku a kresby učitel vybere podobu na plátně (krok H4, src/lib/hodiny.ts › Podoba na plátně).
  // Použití: <Skladatel client:load obdobi={[{ id: 1, nazev: 'Počátky a klasické Řecko' }, …]} />
  import { onMount, tick } from 'svelte';
  import {
    NENI_V_ATLASU, VERZE_HODINY, adresaHodiny, hodinaZeSouboru, najdiZastaveni, nazevPodoby, platnaPodoba, podobyZastaveni, ucinnaPodoba,
    type Podoba, type UlozenaHodina, type Zastaveni, type ZastaveniHodiny,
  } from '../../lib/hodiny';
  import { nactiHodinu, noveIdHodiny, stahniHodinu, ulozHodinu } from '../../lib/hodiny-uloziste';
  import {
    DRUHY_VYBERU, druhStranky, filtrujKatalog, kdeStoji, pocetZastaveni, posun, prazdnyFiltr, stitekDruhu, stromKatalogu,
    type DruhVyberu, type Skupina, type Uzel,
  } from '../../lib/skladatel';
  import { nezlomitelne } from '../../lib/sazba.js';
  import { aktivniHodina, vstupDoHodiny } from '../../lib/pruchod-hodiny';

  interface Props {
    /** názvy období z dat (src/data/obdobi.yaml); filtr nabídne jen ta, která katalog má */
    obdobi: { id: number; nazev: string }[];
  }
  let { obdobi }: Props = $props();

  // ─── Katalog ───
  let katalog = $state<Zastaveni[] | null>(null);
  let chybaKatalogu = $state(false);
  let strom = $derived(katalog ? stromKatalogu(katalog) : []);
  let obdobiVKatalogu = $derived(katalog ? obdobi.filter((o) => katalog!.some((z) => z.obdobi === o.id)) : []);
  let hledat = $state('');
  let filtrObdobi = $state('');
  let filtrDruh = $state('');
  let filtr = $derived({ hledat, obdobi: filtrObdobi ? Number(filtrObdobi) : null, druh: (filtrDruh || null) as DruhVyberu | null });
  let vysledek = $derived(katalog && !prazdnyFiltr(filtr) ? filtrujKatalog(katalog, filtr) : null);
  let otevrene = $state<Record<string, boolean>>({});
  const ODDILY_VYBERU = [
    { druh: 'cesta', nadpis: 'Cesty' },
    { druh: 'profil', nadpis: 'Profily' },
    { druh: 'otazka', nadpis: 'Velké otázky' },
    { druh: 'tyden', nadpis: 'Týdny Zkus to žít' },
  ] as const;

  // ─── Hodina ───
  let id = $state<string | undefined>();
  let nazev = $state('');
  let poznamka = $state('');
  let zastaveni = $state<ZastaveniHodiny[]>([]);
  let ulozenoKdy = $state<string | null>(null);
  let neulozeno = $state(false);
  let zprava = $state('');
  let origin = $state('');
  let vHodine = $derived(new Set(zastaveni.map((z) => z.id)));
  let podleId = $derived(new Map((katalog ?? []).map((z) => [z.id, z])));
  /** Zastavení s podobou, kterou opravdu mají (podoba, kterou zastavení nemá, by do odkazu jen přidala značku). */
  let sPodobou = $derived(zastaveni.map((z) => ({ id: z.id, podoba: podobaZastaveni(z) })));
  let odkaz = $derived(origin + adresaHodiny({ nazev, zastaveni: sPodobou }));
  /** Odkaz na papíře: diakritika v názvu čitelně, mezera jako %20 (opsaná mezera by z adresy udělala hledání). */
  let odkazNaPapir = $derived.by(() => {
    try { return decodeURI(odkaz).replace(/ /g, '%20'); } catch { return odkaz; }
  });
  let souborVstup = $state<HTMLInputElement>();
  let odkazVstup = $state<HTMLInputElement>();

  const cas = (iso: string) =>
    new Date(iso).toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

  onMount(() => {
    origin = location.origin;
    const parametr = new URLSearchParams(location.search).get('hodina');
    if (parametr) {
      const h = nactiHodinu(parametr);
      if (h) otevri(h, true);
      else zprava = 'Tahle hodina v tomto prohlížeči uložená není. Skládáš novou.';
    }
    fetch('/hodina/katalog.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((k: { zastaveni: Zastaveni[] }) => (katalog = k.zastaveni))
      .catch(() => (chybaKatalogu = true));
    const varuj = (e: BeforeUnloadEvent) => {
      if (neulozeno && zastaveni.length) e.preventDefault();
    };
    addEventListener('beforeunload', varuj);
    return () => removeEventListener('beforeunload', varuj);
  });

  function otevri(h: UlozenaHodina, ulozena: boolean) {
    id = h.id;
    nazev = h.nazev;
    poznamka = h.poznamka;
    zastaveni = h.zastaveni.map((z) => ({ ...z }));
    ulozenoKdy = ulozena ? h.zmeneno : null;
    neulozeno = !ulozena;
  }

  const zmena = () => (neulozeno = true);
  const nazevZastaveni = (zid: string) => podleId.get(zid)?.nazev ?? NENI_V_ATLASU;
  /** Podoba na plátně, jak se ukáže: u zastavení, které ji nemá (nebo které atlas nezná), celý blok. */
  function podobaZastaveni(z: ZastaveniHodiny): Podoba {
    const k = podleId.get(z.id);
    return k ? ucinnaPodoba(k, z.podoba) : (z.podoba ?? 'cely');
  }
  const malym = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

  function zmenPodobu(i: number, hodnota: string) {
    const p = platnaPodoba(hodnota);
    const { podoba: _stara, ...bez } = zastaveni[i];
    zastaveni[i] = p ? { ...bez, podoba: p } : bez;
    const k = podleId.get(zastaveni[i].id);
    zprava = `${nazevZastaveni(zastaveni[i].id)}: na plátně ${malym(nazevPodoby(p ?? 'cely', k?.typ))}.`;
    zmena();
  }

  function prepni(z: Zastaveni) {
    if (vHodine.has(z.id)) {
      zastaveni = zastaveni.filter((x) => x.id !== z.id);
      zprava = `Odebráno z hodiny: ${z.nazev}. V hodině je ${pocetZastaveni(zastaveni.length)}.`;
    } else {
      zastaveni = [...zastaveni, { id: z.id, poznamka: '' }];
      zprava = `Přidáno do hodiny: ${z.nazev}. V hodině je ${pocetZastaveni(zastaveni.length)}.`;
    }
    zmena();
  }

  async function odeber(i: number) {
    const pryc = zastaveni[i];
    zastaveni = zastaveni.filter((_, j) => j !== i);
    zprava = `Odebráno z hodiny: ${nazevZastaveni(pryc.id)}. V hodině je ${pocetZastaveni(zastaveni.length)}.`;
    zmena();
    await tick();
    // Fokus na stejné místo seznamu (další zastavení), jinak na předchozí, jinak na nadpis hodiny.
    const dalsi = zastaveni[i] ?? zastaveni[i - 1];
    const cil = dalsi ? document.querySelector<HTMLElement>(`[data-odebrat="${dalsi.id}"]`) : document.getElementById('hodina-nadpis');
    cil?.focus();
  }

  async function posunout(i: number, smer: -1 | 1) {
    const zid = zastaveni[i].id;
    zastaveni = posun(zastaveni, i, smer);
    zprava = `${nazevZastaveni(zid)} je teď ${i + smer + 1}. z ${zastaveni.length}.`;
    zmena();
    await tick();
    // Posunuté zastavení se v DOM přesune a fokus ztratí; vrátí se na totéž tlačítko, na kraji na to druhé.
    const tl = (s: number) => document.querySelector<HTMLButtonElement>(`[data-posun="${zid}"][data-smer="${s}"]`);
    const cil = tl(smer);
    (cil && !cil.disabled ? cil : tl(-smer))?.focus();
  }

  function uloz() {
    const h = ulozHodinu({ id, nazev, poznamka, zastaveni: $state.snapshot(zastaveni) });
    otevri(h, true);
    history.replaceState(null, '', `?hodina=${encodeURIComponent(h.id)}`);
    zprava = 'Hodina je uložená v tomto prohlížeči. Najdeš ji i v deníku, v oddílu Moje hodiny.';
  }

  function stahni() {
    // Bez id by soubor a pozdější uložení dostaly každý jiné; hodina ho proto dostane hned.
    id ??= noveIdHodiny();
    const h = hodinaZeSouboru(
      JSON.stringify({ verze: VERZE_HODINY, id, nazev, poznamka, zastaveni: $state.snapshot(zastaveni), zmeneno: new Date().toISOString() }),
    );
    if (h) {
      stahniHodinu(h);
      zprava = 'Soubor s hodinou se stahuje. Jsou v něm i tvoje poznámky.';
    }
  }

  async function nahraj(e: Event) {
    const vstup = e.currentTarget as HTMLInputElement;
    const soubor = vstup.files?.[0];
    if (!soubor) return;
    const h = hodinaZeSouboru(await soubor.text());
    vstup.value = '';
    if (!h) {
      zprava = 'Tenhle soubor není hodina z atlasu.';
      return;
    }
    otevri(h, false);
    zprava = `Hodina ${h.nazev ? `„${h.nazev}“ ` : ''}je otevřená ze souboru. Ulož ji, ať ji najdeš v deníku.`;
  }

  async function kopiruj() {
    try {
      await navigator.clipboard.writeText(odkaz);
    } catch {
      odkazVstup?.select();
      document.execCommand('copy');
    }
    zprava = 'Odkaz pro studenty je zkopírovaný.';
  }

  /** Promítat hodinu: otevře první zastavení v režimu pro plátno (lišta hodiny a promítání, src/scripts/hodina-lista.ts). */
  function promitat() {
    if (!katalog) return;
    const ids = zastaveni.map((z) => z.id);
    const podoby = Object.fromEntries(zastaveni.flatMap((z) => (z.podoba ? [[z.id, z.podoba]] : [])));
    const h = aktivniHodina({ nazev, zastaveni: ids, podoby }, katalog, adresaHodiny({ nazev, zastaveni: sPodobou }), true);
    const cil = vstupDoHodiny(h, undefined, true);
    if (cil) location.href = cil;
    else zprava = 'V hodině není žádné místo, které by v atlasu bylo.';
  }

  function zrusFiltr() {
    hledat = '';
    filtrObdobi = '';
    filtrDruh = '';
    document.getElementById('vyber-hledat')?.focus();
  }

  const viditelny = (zid: string) => !vysledek || vysledek.viditelne.has(zid);
  const pocetVeSkupine = (g: Skupina) => {
    let n = 1;
    const projdi = (u: Uzel[]) => u.forEach((x) => { n++; projdi(x.deti); });
    projdi(g.deti);
    return n;
  };
  const vHodineVeSkupine = (g: Skupina) => zastaveni.filter((z) => podleId.get(z.id)?.stranka.startsWith(g.koren.stranka)).length;
</script>

{#snippet polozka(z: Zastaveni, deti: Uzel[])}
  {#if viditelny(z.id)}
    {@const zvoleno = vHodine.has(z.id)}
    <li class="polozka" class:polozka--souvislost={vysledek && !vysledek.shoda.has(z.id)}>
      <div class="polozka__radek">
        <div class="polozka__text">
          <span class="polozka__druh">{stitekDruhu(z)}</span>
          <a class="polozka__nazev" href={z.adresa} target="_blank" rel="noopener">{nezlomitelne(z.nazev)}<span class="vizualne-skryte">otevře se v nové kartě</span><span class="sipka" aria-hidden="true">↗</span></a>
        </div>
        <button
          type="button"
          class="blok__tl tl-maly {zvoleno ? 'blok__tl--tiche' : 'blok__tl--vedlejsi'}"
          aria-label={zvoleno ? `Odebrat z hodiny: ${z.nazev}` : `Přidat do hodiny: ${z.nazev}`}
          onclick={() => prepni(z)}
        >{zvoleno ? 'Odebrat' : 'Přidat'}</button>
      </div>
      {#if deti.some((d) => viditelny(d.z.id))}
        <ul class="polozky">
          {#each deti as d (d.z.id)}{@render polozka(d.z, d.deti)}{/each}
        </ul>
      {/if}
    </li>
  {/if}
{/snippet}

<div class="skladatel">
  <section class="vyber" aria-labelledby="vyber-nadpis">
    <div class="pocitadlo t-ovladani">
      <span>V hodině: <strong>{pocetZastaveni(zastaveni.length)}</strong></span>
      <a href="#hodina">K hodině<span class="sipka" aria-hidden="true">↓</span></a>
    </div>
    <h2 class="t-h3 nadpis" id="vyber-nadpis">Vyber z atlasu</h2>
    <div class="filtr">
      <div class="filtr__pole">
        <label class="blok__popis" for="vyber-hledat">Hledat podle názvu</label>
        <input id="vyber-hledat" class="vstup" type="search" autocomplete="off" bind:value={hledat} placeholder="Delfy, Epiktétos, jeskyně…" />
      </div>
      <div class="filtr__pole">
        <label class="blok__popis" for="vyber-obdobi">Období</label>
        <select id="vyber-obdobi" class="vstup" bind:value={filtrObdobi}>
          <option value="">Všechna období</option>
          {#each obdobiVKatalogu as o (o.id)}<option value={String(o.id)}>{o.id}. {o.nazev}</option>{/each}
        </select>
      </div>
      <div class="filtr__pole">
        <label class="blok__popis" for="vyber-druh">Druh</label>
        <select id="vyber-druh" class="vstup" bind:value={filtrDruh}>
          <option value="">Všechny druhy</option>
          {#each DRUHY_VYBERU as d (d.id)}<option value={d.id}>{d.nazev}</option>{/each}
        </select>
      </div>
    </div>
    <p class="vysledek t-popisek" aria-live="polite">
      {#if vysledek && vysledek.shoda.size}Nalezeno: {pocetZastaveni(vysledek.shoda.size)}{/if}
    </p>

    {#if chybaKatalogu}
      <p class="t-ovladani">Výběr se nenačetl. Zkus stránku obnovit.</p>
    {:else if !katalog}
      <p class="t-ovladani nacitam">Načítám místa z atlasu…</p>
    {:else if vysledek && vysledek.shoda.size === 0}
      <div class="nic">
        <p class="t-ovladani">Nic takového v atlasu není. Zkus jiné slovo, nebo zruš filtr.</p>
        <button type="button" class="blok__tl blok__tl--tiche" onclick={zrusFiltr}>Zrušit filtr</button>
      </div>
    {:else}
      {#each ODDILY_VYBERU as o (o.druh)}
        {@const skupiny = strom.filter((g) => g.koren.druh === o.druh && viditelny(g.koren.id))}
        {#if skupiny.length}
          <h3 class="oddil t-nadtitulek">{o.nadpis}</h3>
          <div class="skupiny">
            {#each skupiny as g (g.koren.id)}
              {@const vHodineZde = vHodineVeSkupine(g)}
              <details
                class="skupina {g.koren.obdobi ? `obdobi-${g.koren.obdobi}` : ''}"
                open={vysledek !== null || !!otevrene[g.koren.id]}
                ontoggle={(e) => {
                  // S filtrem jsou skupiny otevřené všechny; pamatuje se jen to, co učitel otevřel bez filtru.
                  if (!vysledek) otevrene[g.koren.id] = (e.currentTarget as HTMLDetailsElement).open;
                }}
              >
                <summary class="skupina__hlava">
                  <span class="skupina__druh">{druhStranky(g.koren)}</span>
                  <span class="skupina__nazev">{nezlomitelne(g.koren.nazev)}</span>
                  <span class="skupina__pocet">{pocetZastaveni(pocetVeSkupine(g))}{vHodineZde ? ` · v hodině ${vHodineZde}` : ''}</span>
                </summary>
                <ul class="polozky polozky--koren">
                  {@render polozka(g.koren, [])}
                  {#each g.deti as d (d.z.id)}{@render polozka(d.z, d.deti)}{/each}
                </ul>
              </details>
            {/each}
          </div>
        {/if}
      {/each}
    {/if}
  </section>

  <section class="hodina" id="hodina" aria-labelledby="hodina-nadpis">
    <h2 class="t-h3 nadpis" id="hodina-nadpis" tabindex="-1">Hodina</h2>
    <p class="t-popisek stav">
      {pocetZastaveni(zastaveni.length)}{ulozenoKdy && !neulozeno ? ` · uloženo ${cas(ulozenoKdy)}` : neulozeno ? ' · neuložené změny' : ''}
    </p>
    <label class="blok__popis" for="hodina-nazev">Název hodiny</label>
    <input id="hodina-nazev" class="vstup" type="text" maxlength="120" bind:value={nazev} oninput={zmena} placeholder="Třeba Delfy a sofisté" />
    <label class="blok__popis popis-poznamka" for="hodina-poznamka">Poznámka k hodině <span class="nepovinne">jen pro tebe</span></label>
    <textarea id="hodina-poznamka" class="blok__pole blok__pole--kratke" bind:value={poznamka} oninput={zmena}></textarea>

    {#if zastaveni.length === 0}
      <p class="prazdna t-ovladani">Zatím tu nic není. Přidej zastavení z výběru.</p>
    {:else if !katalog && !chybaKatalogu}
      <p class="t-ovladani nacitam">Načítám místa z atlasu…</p>
    {:else}
      <ol class="zvolena">
        {#each zastaveni as zs, i (zs.id)}
          {@const n = najdiZastaveni(katalog ?? [], [zs.id])[0]}
          <li class="zvolene {n.nalezeno && n.zastaveni.obdobi ? `obdobi-${n.zastaveni.obdobi}` : ''}" class:zvolene--chybi={!n.nalezeno}>
            <span class="zvolene__cislo" aria-hidden="true">{i + 1}</span>
            <div class="zvolene__obsah">
              {#if n.nalezeno}
                <p class="zvolene__kde">{stitekDruhu(n.zastaveni)} · {kdeStoji(n.zastaveni)}</p>
                <a class="zvolene__nazev" href={n.zastaveni.adresa} target="_blank" rel="noopener"><span class="vizualne-skryte">{i + 1}.</span>{nezlomitelne(n.zastaveni.nazev)}<span class="vizualne-skryte">otevře se v nové kartě</span><span class="sipka" aria-hidden="true">↗</span></a>
                <label class="vizualne-skryte" for="poznamka-{i}">Poznámka k zastavení {i + 1}: {n.zastaveni.nazev}</label>
                <textarea id="poznamka-{i}" class="vstup vstup--poznamka" rows="2" placeholder="Poznámka" bind:value={zs.poznamka} oninput={zmena}></textarea>
                {@const podoby = podobyZastaveni(n.zastaveni)}
                {#if podoby.length > 1}
                  <div class="podoba">
                    <label class="podoba__popis" for="podoba-{i}">Na plátně<span class="vizualne-skryte">, zastavení {i + 1}</span>:</label>
                    <select id="podoba-{i}" class="vstup vstup--podoba" value={podobaZastaveni(zs)} onchange={(e) => zmenPodobu(i, e.currentTarget.value)}>
                      {#each podoby as p (p)}<option value={p}>{nazevPodoby(p, n.zastaveni.typ)}</option>{/each}
                    </select>
                  </div>
                {/if}
              {:else}
                <p class="zvolene__nazev zvolene__nazev--chybi">{NENI_V_ATLASU}</p>
                <p class="zvolene__kde">{zs.id}</p>
              {/if}
              <div class="zvolene__akce">
                <button type="button" class="blok__tl blok__tl--tiche tl-maly" data-posun={zs.id} data-smer="-1" disabled={i === 0}
                  aria-label="Posunout výš: {nazevZastaveni(zs.id)}" onclick={() => posunout(i, -1)}>Výš</button>
                <button type="button" class="blok__tl blok__tl--tiche tl-maly" data-posun={zs.id} data-smer="1" disabled={i === zastaveni.length - 1}
                  aria-label="Posunout níž: {nazevZastaveni(zs.id)}" onclick={() => posunout(i, 1)}>Níž</button>
                <button type="button" class="blok__tl blok__tl--tiche tl-maly" data-odebrat={zs.id}
                  aria-label="Odebrat z hodiny: {nazevZastaveni(zs.id)}" onclick={() => odeber(i)}>Odebrat</button>
              </div>
            </div>
          </li>
        {/each}
      </ol>
    {/if}

    <div class="blok__akce akce">
      <button type="button" class="blok__tl blok__tl--hlavni" onclick={uloz}>Uložit</button>
      <button type="button" class="blok__tl blok__tl--vedlejsi" onclick={stahni} disabled={zastaveni.length === 0}>Stáhnout soubor</button>
      <button type="button" class="blok__tl blok__tl--tiche" onclick={() => souborVstup?.click()}>Nahrát soubor</button>
      <input bind:this={souborVstup} class="vizualne-skryte" type="file" accept=".json,application/json" tabindex="-1" aria-hidden="true" onchange={nahraj} />
    </div>
    {#if zastaveni.length}
      <div class="blok__akce akce akce--hodina">
        {#if id && ulozenoKdy}
          <button type="button" class="blok__tl blok__tl--vedlejsi" onclick={promitat} disabled={!katalog}>Promítat hodinu</button>
        {/if}
        <button type="button" class="blok__tl blok__tl--tiche" onclick={() => print()}>Vytisknout přehled</button>
      </div>
    {/if}
    <p class="zprava t-ovladani" role="status">{zprava}</p>

    {#if zastaveni.length}
      <div class="odkaz">
        <label class="blok__popis" for="hodina-odkaz">Odkaz pro studenty</label>
        <p class="t-popisek odkaz__pozn" id="hodina-odkaz-pozn">Nese název a pořadí zastavení. Poznámky v něm nejsou.</p>
        <div class="odkaz__radek">
          <input id="hodina-odkaz" bind:this={odkazVstup} class="vstup" type="text" readonly value={odkaz} aria-describedby="hodina-odkaz-pozn" onfocus={(e) => e.currentTarget.select()} />
          <button type="button" class="blok__tl blok__tl--vedlejsi" onclick={kopiruj}>Kopírovat</button>
        </div>
      </div>
    {/if}
    {#if id}
      <p class="nova t-ovladani"><a href="/hodina/nova/">Začít novou hodinu</a></p>
    {/if}
  </section>
</div>

<!-- Přehled hodiny pro učitele: jen na papíře (Vytisknout přehled), na obrazovce skrytý. -->
<div class="tisk">
  <p class="tisk__nad">Přehled hodiny · Atlas myšlení</p>
  <p class="tisk__nazev">{nazev || 'Hodina bez názvu'}</p>
  <p class="tisk__odkaz">Odkaz pro studenty: {odkazNaPapir}</p>
  {#if poznamka.trim()}<p class="tisk__poznamka">{poznamka}</p>{/if}
  <ol class="tisk__seznam">
    {#each zastaveni as zs, i (zs.id)}
      {@const n = najdiZastaveni(katalog ?? [], [zs.id])[0]}
      <li class="tisk__zastaveni">
        <span class="tisk__cislo">{i + 1}.</span>
        <div>
          {#if n.nalezeno}
            <p class="tisk__kde">{stitekDruhu(n.zastaveni)} · {kdeStoji(n.zastaveni)}</p>
            <p class="tisk__nazev-zastaveni">{n.zastaveni.nazev}</p>
            {#if podobaZastaveni(zs) !== 'cely'}<p class="tisk__podoba">na plátně: {malym(nazevPodoby(podobaZastaveni(zs), n.zastaveni.typ))}</p>{/if}
            <p class="tisk__adresa">{origin}{n.zastaveni.adresa}</p>
          {:else}
            <p class="tisk__nazev-zastaveni">{NENI_V_ATLASU}</p>
            <p class="tisk__adresa">{zs.id}</p>
          {/if}
          {#if zs.poznamka.trim()}<p class="tisk__pozn">Poznámka: {zs.poznamka}</p>{/if}
        </div>
      </li>
    {/each}
  </ol>
</div>

<style>
  .skladatel { display: grid; gap: var(--s-7); align-items: start; }
  @media (min-width: 900px) {
    .skladatel { grid-template-columns: minmax(0, 1fr) minmax(340px, 440px); gap: var(--s-8); }
    .hodina {
      position: sticky;
      top: calc(var(--hlavicka) + var(--s-4));
      max-height: calc(100dvh - var(--hlavicka) - var(--s-6));
      padding-right: var(--s-2);
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .pocitadlo { display: none !important; }
  }

  .nadpis { margin: 0 0 var(--s-4); }
  .nadpis:focus { outline: none; }
  .nadpis:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

  /* Telefon: počet zvolených zastavení drží nahoře nad výběrem. */
  .pocitadlo {
    position: sticky;
    top: var(--hlavicka);
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    min-height: 48px;
    margin: 0 calc(-1 * var(--okraj)) var(--s-4);
    padding: 0 var(--okraj);
    border-bottom: 1px solid var(--rule);
    background: var(--paper);
  }
  .pocitadlo a { display: inline-flex; align-items: center; min-height: 44px; color: var(--ink); font-weight: 600; }
  @media (max-width: 899px) {
    .vyber :is(a, button, summary, input, select) { scroll-margin-top: calc(48px + var(--s-2)); }
  }

  .vstup {
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
  }
  .vstup::placeholder { color: var(--muted); opacity: 1; }
  .vstup:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  select.vstup { cursor: pointer; }

  .filtr { display: grid; gap: var(--s-3); }
  @media (min-width: 640px) {
    .filtr { grid-template-columns: minmax(0, 2fr) minmax(0, 1.4fr) minmax(0, 1fr); align-items: end; }
  }
  .filtr__pole .blok__popis { margin-bottom: var(--s-1); }
  .vysledek { min-height: 1.5em; margin: var(--s-3) 0 0; }
  .nacitam { color: var(--ink-2); }
  .nic { padding: var(--s-4) 0; }
  .nic p { margin: 0 0 var(--s-3); }

  .oddil { margin: var(--s-6) 0 var(--s-3); color: var(--muted); }
  .skupiny { border-bottom: 1px solid var(--rule); }
  .skupina { border-top: 1px solid var(--rule); }
  .skupina__hlava {
    display: grid;
    grid-template-columns: 12px minmax(0, 1fr);
    column-gap: var(--s-3);
    align-items: baseline;
    min-height: 56px;
    padding: var(--s-3) 0 var(--s-3) var(--s-3);
    border-left: 4px solid var(--pc, var(--rule));
    cursor: pointer;
    list-style: none;
  }
  .skupina__hlava::-webkit-details-marker { display: none; }
  .skupina__hlava::before {
    content: '';
    grid-column: 1;
    grid-row: 1 / span 3;
    align-self: center;
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--ink-2);
    border-bottom: 2px solid var(--ink-2);
    transform: rotate(-45deg);
    transition: transform var(--pohyb-rychle);
  }
  .skupina[open] > .skupina__hlava::before { transform: rotate(45deg); }
  .skupina__hlava:hover .skupina__nazev { text-decoration: underline; }
  .skupina__hlava:focus { outline: none; }
  .skupina__hlava:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .skupina__druh { grid-column: 2; font-family: var(--font-sans); font-size: var(--fs-nadtitulek); font-weight: 600; color: var(--pc, var(--muted)); text-transform: uppercase; letter-spacing: 0.14em; }
  .skupina__nazev { grid-column: 2; font-size: var(--fs-perex); line-height: 1.3; color: var(--ink); }
  .skupina__pocet { grid-column: 2; font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--muted); }

  .polozky { margin: 0; padding: 0; list-style: none; }
  .polozky--koren { padding: 0 0 var(--s-4) var(--s-4); }
  .polozky .polozky { margin-left: var(--s-2); padding-left: var(--s-4); border-left: 1px solid var(--rule); }
  .polozka__radek { display: flex; align-items: center; justify-content: space-between; gap: var(--s-3); padding: var(--s-2) 0; }
  .polozka__text { display: grid; min-width: 0; }
  .polozka__druh { font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--muted); }
  .polozka__nazev { display: inline-block; min-height: 24px; color: var(--ink); font-family: var(--font-sans); font-size: var(--fs-ovladani); font-weight: 600; text-decoration: none; overflow-wrap: anywhere; }
  .polozka__nazev:hover { text-decoration: underline; }
  .polozka--souvislost > .polozka__radek .polozka__nazev { font-weight: 400; color: var(--ink-2); }
  .sipka { margin-left: 0.25em; color: var(--muted); font-weight: 400; }
  .tl-maly { flex: none; min-width: 88px; padding: 0 var(--s-3); font-size: var(--fs-ovladani); }

  .stav { margin: calc(-1 * var(--s-3)) 0 var(--s-4); }
  .popis-poznamka { display: flex; flex-wrap: wrap; column-gap: var(--s-2); margin-top: var(--s-4); }
  .nepovinne { color: var(--muted); font-weight: 400; }
  .prazdna { margin: var(--s-4) 0; padding: var(--s-4); border: 1px dashed var(--rule); border-radius: var(--r-sm); color: var(--ink-2); }

  .zvolena { margin: var(--s-4) 0 0; padding: 0; list-style: none; }
  .zvolene { display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: var(--s-3); padding: var(--s-4) 0; border-top: 1px solid var(--rule); }
  .zvolene:last-child { border-bottom: 1px solid var(--rule); }
  .zvolene__cislo {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--r-full);
    background: var(--pc-tint, var(--sunk));
    color: var(--pc, var(--ink));
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .zvolene__obsah { min-width: 0; }
  .zvolene__kde { margin: 0; font-family: var(--font-sans); font-size: var(--fs-popisek); color: var(--muted); overflow-wrap: anywhere; }
  .zvolene__nazev { display: inline-block; margin: 0 0 var(--s-2); color: var(--ink); font-family: var(--font-sans); font-size: var(--fs-ovladani-l); font-weight: 600; text-decoration: none; overflow-wrap: anywhere; }
  .zvolene__nazev:hover { text-decoration: underline; }
  .zvolene__nazev--chybi { color: var(--ink-2); font-style: italic; font-weight: 500; }
  .vstup--poznamka { min-height: 44px; font-size: var(--fs-ovladani); resize: vertical; }
  .podoba { display: flex; flex-wrap: wrap; align-items: center; column-gap: var(--s-2); row-gap: var(--s-1); margin-top: var(--s-2); }
  .podoba__popis { font-family: var(--font-sans); font-size: var(--fs-ovladani); color: var(--ink-2); }
  .vstup--podoba { display: inline-block; flex: 1 1 12em; width: auto; min-width: 0; font-size: var(--fs-ovladani); }
  .zvolene__akce { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-top: var(--s-2); }
  .zvolene__akce .tl-maly { min-width: 0; }

  .akce { margin-top: var(--s-5); }
  .zprava { min-height: 1.45em; margin: var(--s-3) 0 0; color: var(--ink-2); }
  .zprava:empty { margin: 0; min-height: 0; }
  .odkaz { margin-top: var(--s-5); padding-top: var(--s-4); border-top: 1px solid var(--rule); }
  .odkaz .blok__popis { margin-bottom: 0; }
  .odkaz__pozn { margin: 0 0 var(--s-2); }
  .odkaz__radek { display: flex; gap: var(--s-2); }
  .odkaz__radek .vstup { flex: 1; min-width: 0; font-size: var(--fs-ovladani); color: var(--ink-2); }
  .odkaz__radek .blok__tl { flex: none; }
  .nova { margin: var(--s-4) 0 0; }
  .nova a { display: inline-flex; align-items: center; min-height: 44px; color: var(--ink); }
  .akce--hodina { margin-top: var(--s-3); }

  /* Tisk: jen přehled hodiny, bez navigace, výběru a tlačítek. */
  .tisk { display: none; }
  @media print {
    :global(.hlavicka), :global(.drobecky), :global(.paticka), :global(nav.lista), :global(.preskocit), :global(.hodina-lista) { display: none !important; }
    .skladatel { display: none !important; }
    .tisk { display: block; color: var(--ink); font-family: var(--font-serif); font-size: 11.5pt; line-height: 1.45; }
    .tisk p { margin: 0; }
    .tisk__nad { font-family: var(--font-sans); font-size: 9pt; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-2); }
    .tisk__nazev { margin: 4pt 0 6pt !important; font-size: 22pt; line-height: 1.15; }
    .tisk__odkaz { margin-bottom: 8pt !important; font-family: var(--font-sans); font-size: 9pt; color: var(--ink-2); overflow-wrap: anywhere; }
    .tisk__poznamka { margin-bottom: 10pt !important; white-space: pre-line; }
    .tisk__seznam { margin: 10pt 0 0; padding: 0; list-style: none; border-top: 0.75pt solid var(--ink-2); }
    .tisk__zastaveni { display: grid; grid-template-columns: 22pt 1fr; gap: 4pt; padding: 7pt 0; border-bottom: 0.5pt solid var(--rule); break-inside: avoid; }
    .tisk__cislo { font-family: var(--font-sans); font-weight: 600; }
    .tisk__kde { font-family: var(--font-sans); font-size: 9pt; color: var(--ink-2); }
    .tisk__nazev-zastaveni { font-size: 12.5pt; font-weight: 600; }
    .tisk__podoba { font-family: var(--font-sans); font-size: 9.5pt; font-weight: 600; }
    .tisk__adresa { font-family: var(--font-sans); font-size: 8.5pt; color: var(--ink-2); overflow-wrap: anywhere; }
    .tisk__pozn { margin-top: 3pt !important; white-space: pre-line; }
  }
</style>
