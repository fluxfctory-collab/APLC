#!/usr/bin/env bash
# Lighthouse (mobile + desktop) for the main pages of a running build.
# Usage: scripts/qa/lighthouse.sh http://localhost:4400 OUT_DIR [lighthouse-bin]
set -euo pipefail
BASE=${1:-http://localhost:4400}
OUT=${2:-qa/lighthouse}
LH=${3:-npx lighthouse@13}
CHROME=${CHROME_PATH:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}
mkdir -p "$OUT"
for page in / /about/ /practice-areas/ /practice-areas/spousal-support/ /contact/; do
  name=$(echo "$page" | sed 's#/#_#g; s#^_##; s#_$##'); name=${name:-home}
  for preset in mobile desktop; do
    extra=""; [ "$preset" = desktop ] && extra="--preset=desktop"
    $LH "$BASE$page" $extra --chrome-path="$CHROME" --chrome-flags="--headless=new --no-sandbox" \
      --output=json --output-path="$OUT/$name-$preset.json" --quiet --only-categories=performance,accessibility,best-practices,seo || true
  done
done
