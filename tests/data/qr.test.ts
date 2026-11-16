import { describe, expect, it } from 'vitest';
import qrcode from 'qrcode-generator';
import { kodQr, QR_NEJVIC } from '../../src/lib/qr';

const tvurce = qrcode as unknown as Parameters<typeof kodQr>[1];

describe('kód QR pro přenos deníku', () => {
  it('odkaz dá čtvercový kód a cestu z obdélníků', () => {
    const k = kodQr('https://czempi123.github.io/denik/#denik=abc', tvurce)!;
    expect(k.strana).toBeGreaterThanOrEqual(21);
    expect((k.strana - 17) % 4).toBe(0);
    expect(k.d).toMatch(/^M\d+ \d+h\d+v1h-\d+z/);
    // Tři vyhledávací čtverce v rozích: levý horní modul je tmavý.
    expect(k.d.startsWith('M0 0h7v1h-7z')).toBe(true);
  });
  it('příliš dlouhý odkaz kód nedostane', () => {
    expect(kodQr('x'.repeat(QR_NEJVIC + 1), tvurce)).toBeNull();
  });
});
