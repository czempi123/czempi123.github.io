// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { sazbaMdast } from './src/lib/sazba.js';

// Atlas myšlení: statický web, interaktivní ostrovy ve Svelte, obsah v MDX.
export default defineConfig({
  // Zveřejněno na GitHub Pages v kořeni adresy (repozitář czempi123.github.io), proto bez `base`.
  site: 'https://czempi123.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [svelte(), mdx()],
  // Nezlomitelné mezery za jednopísmennými předložkami v textech Markdownu a MDX (src/lib/sazba.js).
  markdown: { processor: satteri({ mdastPlugins: [sazbaMdast] }) },
  devToolbar: { enabled: false },
});
