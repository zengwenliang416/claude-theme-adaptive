#!/usr/bin/env bash
set -euo pipefail

CATEGORY="${1:?Usage: apply-theme.sh <category> <slug>}"
SLUG="${2:?Usage: apply-theme.sh <category> <slug>}"

CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
THEMES_DIR="$CLAUDE_DIR/themes"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"

SOURCE_THEME="$PLUGIN_ROOT/themes/$CATEGORY/$SLUG.json"

if [ ! -f "$SOURCE_THEME" ]; then
  echo "ERROR: Theme not found: $SOURCE_THEME" >&2
  echo "Available themes:" >&2
  find "$PLUGIN_ROOT/themes" -name "*.json" -exec basename {} .json \; | sort >&2
  exit 1
fi

mkdir -p "$THEMES_DIR"
cp "$SOURCE_THEME" "$THEMES_DIR/$SLUG.json"

if [ ! -f "$SETTINGS_FILE" ]; then
  echo '{}' > "$SETTINGS_FILE"
fi

RUNTIME=""
if command -v node >/dev/null 2>&1; then
  RUNTIME="node"
elif command -v bun >/dev/null 2>&1; then
  RUNTIME="bun"
else
  echo "Theme copied to $THEMES_DIR/$SLUG.json" >&2
  echo "Manually set \"theme\": \"custom:$SLUG\" in $SETTINGS_FILE" >&2
  exit 1
fi

"$RUNTIME" -e "
const fs = require('fs');
const settingsPath = process.argv[1];
const slug = process.argv[2];
let settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
} catch (e) {
  settings = {};
}
settings.theme = 'custom:' + slug;
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
console.log('Theme set to custom:' + slug);
" "$SETTINGS_FILE" "$SLUG"

echo "OK: Theme '$SLUG' applied"
