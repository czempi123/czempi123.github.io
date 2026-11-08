<script lang="ts">
  // Hledání přes Pagefind (statický index vytvořený při sestavení). Otevírá se tlačítkem nebo klávesou /.
  import { onMount } from 'svelte';

  let dialog: HTMLDialogElement;
  let nacteno = $state(false);
  let chyba = $state(false);

  async function nactiPagefind() {
    if (nacteno) return;
    try {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '/pagefind/pagefind-ui.css';
      document.head.append(css);
      await new Promise<void>((ok, ne) => {
        const s = document.createElement('script');
        s.src = '/pagefind/pagefind-ui.js';
        s.onload = () => ok();
        s.onerror = () => ne(new Error('Pagefind není sestavený'));
        document.head.append(s);
      });
      // @ts-expect-error PagefindUI přidá skript výše
      new window.PagefindUI({ element: '#hledani-vysledky', showSubResults: true, showImages: false, resetStyles: false, autofocus: true });
      nacteno = true;
    } catch {
      chyba = true;
    }
  }

  async function otevri() {
    dialog.showModal();
    await nactiPagefind();
    (dialog.querySelector('input') as HTMLInputElement | null)?.focus();
  }

  onMount(() => {
    const klavesa = (e: KeyboardEvent) => {
      const cil = e.target as HTMLElement;
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !/INPUT|TEXTAREA|SELECT/.test(cil.tagName) && !cil.isContentEditable) {
        e.preventDefault();
        otevri();
      }
    };
    window.addEventListener('keydown', klavesa);
    return () => window.removeEventListener('keydown', klavesa);
  });
</script>

<button class="hledat" type="button" onclick={otevri} aria-haspopup="dialog" aria-keyshortcuts="/" aria-label="Hledat (klávesa /)">
  <svg width="20" height="20" aria-hidden="true"><use href="/ikony/ui.svg#hledat" /></svg>
  <span class="hledat__text">Hledat</span>
  <kbd>/</kbd>
</button>

<dialog bind:this={dialog} class="dialog" aria-label="Hledání v atlasu" onclick={(e) => e.target === dialog && dialog.close()}>
  <div class="dialog__vnitrek">
    <div class="dialog__hlavicka">
      <h2 class="t-h3">Hledat v atlasu</h2>
      <button class="zavrit" type="button" onclick={() => dialog.close()} aria-label="Zavřít hledání">
        <svg width="22" height="22" aria-hidden="true"><use href="/ikony/ui.svg#zavrit" /></svg>
      </button>
    </div>
    <div id="hledani-vysledky"></div>
    {#if chyba}
      <p class="t-popisek">Hledání je dostupné v sestaveném webu (npm run build a npm run preview).</p>
    {/if}
  </div>
</dialog>

<style>
  /* Hledání ve vtlačené drážce (design-v2, K2): na telefonu kolečko s ikonou, na notebooku drážka s klávesou /. */
  .hledat {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-2);
    width: var(--dotyk);
    height: var(--dotyk);
    padding: 0;
    border: 0;
    border-radius: var(--r-plne);
    background: var(--papir);
    box-shadow: var(--vtla);
    color: var(--ink-3);
    font-family: var(--font-sans);
    font-size: var(--fs-ovladani);
    font-weight: 500;
    cursor: pointer;
  }
  .hledat:hover { box-shadow: var(--vtla-mele); color: var(--ink); }
  .hledat svg { width: 18px; height: 18px; }
  .hledat__text, kbd { display: none; }
  /* Klávesa jako malý vystouplý knoflík v drážce. */
  kbd {
    padding: 1px 7px;
    border-radius: var(--r-razitko);
    background: var(--plocha-m);
    box-shadow: var(--vyst-m);
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--ink-2);
  }
  @media (min-width: 900px) {
    .hledat { width: auto; min-width: 190px; padding: 10px var(--s-4); justify-content: flex-start; cursor: text; }
    .hledat__text { display: inline; margin-right: auto; }
    kbd { display: inline; }
  }
  /* Okno hledání: ležící list. */
  .dialog {
    width: min(720px, calc(100vw - 32px));
    max-height: min(80vh, 760px);
    margin: 10vh auto auto;
    padding: 0;
    border: 0;
    border-radius: var(--r-papir);
    background: var(--list);
    color: var(--ink);
    box-shadow: var(--lezi-zved);
  }
  .dialog::backdrop { background: rgb(0 0 0 / 35%); }
  .dialog__vnitrek { padding: var(--s-5); }
  .dialog__hlavicka { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--s-4); }
  .zavrit {
    display: grid; place-items: center;
    width: var(--dotyk); height: var(--dotyk);
    border: 0; border-radius: var(--r-plne); background: none; color: var(--ink-2); cursor: pointer;
  }
  .zavrit:hover { background: var(--papir); box-shadow: var(--vtla-mele); color: var(--ink); }
  :global(#hledani-vysledky) {
    --pagefind-ui-scale: 0.9;
    --pagefind-ui-primary: var(--ink);
    --pagefind-ui-text: var(--ink);
    --pagefind-ui-background: var(--list);
    --pagefind-ui-border: var(--tuzka);
    --pagefind-ui-tag: var(--plocha-m);
    --pagefind-ui-border-width: 1px;
    --pagefind-ui-border-radius: 10px;
    --pagefind-ui-font: var(--font-sans);
  }
  :global(#hledani-vysledky .pagefind-ui__result-title) { font-family: var(--font-serif); }
  :global(#hledani-vysledky mark) { background: var(--listek); color: var(--ink); }
</style>
