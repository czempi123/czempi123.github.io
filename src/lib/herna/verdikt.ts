// „Sedí“ a „zkus to jinak“ (herna-v1, K1; plán Co platí): jediná dvojice pro správně a jinak ve znalostních hrách.
// Bez bodů, bez červené a zelené. Sedí je kulatý otisk v inkoustu, zkus to jinak lístek s jednou větou, kam se podívat.

export const SEDI = 'Sedí.';
export const ZKUS_JINAK = 'Zkus to jinak.';

export interface Verdikt {
  sedi: boolean;
  /** „Sedí.“, nebo „Zkus to jinak.“ */
  slovo: string;
  /** u „zkus to jinak“ jedna věta, kam se podívat */
  veta?: string;
}

export function verdikt(sedi: boolean, kamSePodivat?: string): Verdikt {
  if (sedi) return { sedi, slovo: SEDI };
  const veta = kamSePodivat?.trim();
  return veta ? { sedi, slovo: ZKUS_JINAK, veta } : { sedi, slovo: ZKUS_JINAK };
}

// Vybavení (denik-v2, K2; plán Co platí): v kvízu Co ti zůstalo? a v kartičkách s rozestupem jde o to, co si student
// vybaví, ne o hádání. Druhý pokus není, a proto ne „zkus to jinak“, ale jen tahle dvojice; bez bodů a bez počtu.
export const VIS = 'Víš.';
export const ZOPAKUJ_SI = 'Zopakuj si.';

/** „Víš.“, nebo „Zopakuj si.“ */
export const vybaveni = (vis: boolean) => (vis ? VIS : ZOPAKUJ_SI);
