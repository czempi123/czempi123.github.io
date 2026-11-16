// Sdílená data pro Dva životy: jméno, roky a období každého člověka s roky života (src/lib/dva-zivoty-data.ts).
import type { APIRoute } from 'astro';
import { data } from '../lib/data';
import { zivotOsoby } from '../lib/cas-mapy';
import { vytahZivota } from '../lib/dva-zivoty-data';

export const GET: APIRoute = () => {
  const lide = Object.fromEntries(data.lide.filter((o) => zivotOsoby(o)).map((o) => [o.id, vytahZivota(o)]));
  return new Response(JSON.stringify(lide), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
