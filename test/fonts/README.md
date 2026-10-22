# Test fonts

Subsets of Nunito (weights 300, 400, 600, 700, 800) and Inter (600, 700, 800) that the visual tests use instead of system fonts. Both fonts are licensed under the SIL Open Font License 1.1: `OFL-Nunito.txt` and `OFL-Inter.txt`.

The subsets keep Basic Latin, Latin-1, Cyrillic and common punctuation. Rebuild them with `./build-fonts.sh`, which requires curl, unzip and Python fontTools. To support other characters in a test, extend `unicodes` in the script.
