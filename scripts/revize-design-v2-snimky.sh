#!/bin/zsh
# Revize větve design-v2 (R): listy každého typu stránky na 390 a 1440 px ve dne i v noci,
# kroky cesty 1 a okraj s pojmem. Spouští se z kořene repozitáře nad sestaveným webem
# (node scripts/staticky-server.mjs 4323). Výstup v „Claude outputs/snimky/design-v2-r/“.
export VEN="Claude outputs/snimky/design-v2-r"
mkdir -p "$VEN"
DENIK=tests/e2e/data/denik-kapitoly.json
HODINA='/hodina/?v=1&n=Delfy&z=k:kdy-mam-dobry-duvod-verit/1,k:kdy-mam-dobry-duvod-verit/2'
PROMITAT="[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Promítat hodinu'))?.click()"
stranky=(
  "/ domu"
  "/lide/ lide"
  "/otazky/ otazky"
  "/mapa/ mapa"
  "/osobnost/sokrates/ profil"
  "/osobnost/krates-a-hipparchia/ spolecny"
  "/osobnost/thales/ medailonek"
  "/cesta/kdy-mam-dobry-duvod-verit/ prehled"
  "/otazka/jak-zit/ otazka"
  "/obdobi/helenismus-a-rim/ obdobi"
  "/smer/stoicismus/ smer"
  "/pokus/gyguv-prsten/ pokus"
  "/co-je-filozofie/ uvod"
  "/nabozenstvi/judaismus/ tradice"
  "/pojem/ctnost/ pojem"
  "/pojmy/ pojmy"
  "/denik/ denik"
  "/denik/antika/ antika"
  "/tyden/stoicky/ tyden"
  "/hodina/nova/ priprava"
  "$HODINA hodina"
  "$HODINA promitani"
  "/dilna/bloky/ dilna"
  "/neexistuje/ 404"
)
for s in $stranky; do
  a=(${=s})
  pre=""; ul=""; akce=""
  case $a[2] in
    otazka) pre="otazka-jak-zit";;
    denik|antika) ul=$DENIK;;
    promitani) akce=$PROMITAT;;
  esac
  for r in light dark; do
    PRESKOCIT=$pre ULOZISTE=$ul AKCE=$akce node scripts/snimky-listy.mjs "$a[1]" r-$a[2]-390-$r 390 $r 4 2000 1
    PRESKOCIT=$pre ULOZISTE=$ul AKCE=$akce node scripts/snimky-listy.mjs "$a[1]" r-$a[2]-1440-$r 1440 $r 2 3200 0.55
  done
done
for r in light dark; do
  for w in 390 1440; do node scripts/snimky-cesta.mjs kdy-mam-dobry-duvod-verit $w $r odkryt; done
done
node scripts/snimky-okno.mjs /osobnost/sokrates/ '#delfy' r-okraj-sokrates-1440-light 1440 light 900
node scripts/snimky-okno.mjs /osobnost/sokrates/ '#delfy' r-okraj-sokrates-1440-dark 1440 dark 900
node scripts/snimky-okno.mjs /osobnost/sokrates/ '#delfy' r-listek-sokrates-390-dark 390 dark 844 'věštírny'
echo HOTOVO
