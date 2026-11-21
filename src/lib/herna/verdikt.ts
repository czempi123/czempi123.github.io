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
