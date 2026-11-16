// Sdílený obrys pobřeží mini mapy (src/lib/podklad-sdileny.ts): jedna cesta s id „p“, bez barev, ty dává
// <use> v MiniMapa.astro (vlastnosti se do klonu dědí).
import type { APIRoute, GetStaticPaths } from 'astro';
import { podklad, type Vyrez } from '../../lib/mapa';
import { sdileneVyrezy } from '../../lib/podklad-sdileny';

export const getStaticPaths: GetStaticPaths = () => [...sdileneVyrezy()].map(([klic, v]) => ({ params: { klic }, props: { v } }));

export const GET: APIRoute = ({ props }) => {
  const v = props.v as Vyrez;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v.sirka} ${v.vyska}"><path id="p" d="${podklad(v).pevnina}"/></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
