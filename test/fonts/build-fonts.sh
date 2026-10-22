#!/usr/bin/env bash
# Rebuilds the test font fixtures. Requires curl, unzip and Python fontTools.
set -euo pipefail

cd "$(dirname "$0")"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

google_fonts_rev='8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5'
unicodes='U+0020-007E,U+00A0-00FF,U+0400-045F,U+2010-2027,U+2116'

subset() {
  python3 -m fontTools.subset "$1" --unicodes="$unicodes" --name-IDs='*' --no-hinting --output-file="$2"
}

curl -sSfL -o "$tmp/nunito.ttf" "https://raw.githubusercontent.com/google/fonts/$google_fonts_rev/ofl/nunito/Nunito%5Bwght%5D.ttf"
curl -sSfL -o OFL-Nunito.txt "https://raw.githubusercontent.com/google/fonts/$google_fonts_rev/ofl/nunito/OFL.txt"
for pair in 300:Light 400:Regular 600:SemiBold 700:Bold 800:ExtraBold; do
  weight="${pair%%:*}"
  style="${pair#*:}"
  python3 -m fontTools.varLib.instancer "$tmp/nunito.ttf" "wght=$weight" --update-name-table -q -o "$tmp/Nunito-$style.ttf"
  subset "$tmp/Nunito-$style.ttf" "Nunito-$style.ttf"
done

curl -sSfL -o "$tmp/inter.zip" 'https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip'
unzip -q -j "$tmp/inter.zip" LICENSE.txt extras/ttf/Inter-SemiBold.ttf extras/ttf/Inter-Bold.ttf extras/ttf/Inter-ExtraBold.ttf -d "$tmp"
mv "$tmp/LICENSE.txt" OFL-Inter.txt
for style in SemiBold Bold ExtraBold; do
  subset "$tmp/Inter-$style.ttf" "Inter-$style.ttf"
done
