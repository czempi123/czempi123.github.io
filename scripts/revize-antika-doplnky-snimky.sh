#!/bin/zsh
# Revize větve antika-doplnky (R): listy všech nových stránek na 390 px světle a 1440 px tmavě.
# Spouští se z kořene repozitáře při běžícím náhledu (npx astro preview --port 4323).
export VEN="Claude outputs/snimky/r"
mkdir -p "$VEN"
stranky=(
  "/co-je-filozofie/ filozofie"
  "/nabozenstvi/ nabozenstvi"
  "/nabozenstvi/judaismus/ judaismus"
  "/obdobi/pocatky-a-klasicke-recko/ obdobi1"
  "/obdobi/helenismus-a-rim/ obdobi2"
  "/smer/stoicismus/ stoicismus"
  "/smer/epikureismus/ epikureismus"
  "/smer/kynismus/ kynismus"
  "/smer/akademie/ akademie"
  "/pokus/gyguv-prsten/ gyges"
  "/pokus/zrcadlo-casu/ zrcadlo"
  "/otazka/co-je-spravne/ otazka2"
  "/otazka/jak-spolu-mame-zit/ otazka8"
  "/denik/antika/ antika-prazdna"
)
for s in $stranky; do
  a=(${=s})
  pre=""
  case $a[2] in otazka2) pre="otazka-co-je-spravne";; otazka8) pre="otazka-jak-spolu-mame-zit";; esac
  PRESKOCIT=$pre node scripts/snimky-listy.mjs $a[1] $a[2]-390 390 light 4 2000 1
  PRESKOCIT=$pre node scripts/snimky-listy.mjs $a[1] $a[2]-1440 1440 dark 2 3200 0.55
done
echo HOTOVO
