// Česká sazba: jednopísmenné předložky a spojky (k, s, v, z, o, u, a, i) nesmějí zůstat na konci řádku.
// Za ně proto místo mezery patří nezlomitelná mezera. Do textů se nepíše ručně: doplní ji nezlomitelne()
// při vykreslení (texty bloků a hlasů přes radek() v bloky.ts, data v komponentách) a plugin sazbaMdast v MDX.
// Čistý JavaScript bez DOM, aby šel načíst i z astro.config.mjs; testy v tests/data/sazba.test.ts.

/** @import { MdastPluginDefinition } from 'satteri' */

const NBSP = ' ';
const PISMENA = 'ksvzouaiKSVZOUAI';
// Před písmenem začátek textu, mezera nebo otevírací závorka či uvozovka; za ním mezera a další slovo.
const UVNITR = new RegExp(`(^|[\\s(„‚«])([${PISMENA}]) (?=\\S)`, 'g');
const NA_KONCI = new RegExp(`(^|[\\s(„‚«])([${PISMENA}]) $`);

/**
 * Za jednopísmenné předložky a spojky vloží nezlomitelnou mezeru.
 * @param {string} text
 * @returns {string}
 */
export function nezlomitelne(text) {
  // Dvakrát kvůli dvojicím za sebou („a v lese“): první průchod spotřebuje mezeru před druhým písmenem.
  return text.replace(UVNITR, `$1$2${NBSP}`).replace(UVNITR, `$1$2${NBSP}`);
}

/**
 * Plugin pro Sätteri (Markdown a MDX v Astru): textovým uzlům doplní nezlomitelné mezery.
 * Kód a vložený kód jsou jiné druhy uzlů, takže zůstávají beze změny. Text v atributech komponent
 * (otazka="…") se sem nedostane; ten ošetří komponenta sama.
 * Zapojení: astro.config.mjs › markdown.processor: satteri({ mdastPlugins: [sazbaMdast] }).
 * Typ uzlu a kontextu vychází z MdastPluginDefinition v balíčku satteri, takže se s ním nerozejde.
 * @type {MdastPluginDefinition}
 */
export const sazbaMdast = {
  name: 'atlas-sazba',
  text(uzel, ctx) {
    let hodnota = nezlomitelne(uzel.value);
    // Předložka na konci textu před vloženou značkou („v *zahradě*“).
    if (NA_KONCI.test(hodnota)) {
      const i = ctx.indexOf(uzel);
      const sourozenci = ctx.parent(uzel)?.children;
      if (i !== undefined && sourozenci && i < sourozenci.length - 1) hodnota = hodnota.replace(NA_KONCI, `$1$2${NBSP}`);
    }
    if (hodnota !== uzel.value) ctx.setProperty(uzel, 'value', hodnota);
  },
};
