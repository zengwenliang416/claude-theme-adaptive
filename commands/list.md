---
description: List all available themes grouped by category with descriptions
allowed-tools: Bash, Read
---

# Theme Browser

List all available themes from the plugin. First check which theme is currently active.

## Read Current Theme

```bash
grep -o '"theme"[[:space:]]*:[[:space:]]*"[^"]*"' "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/settings.json" 2>/dev/null || echo "No custom theme set"
```

## Present Theme List

Show all themes in this format, marking the active one with **[active]**:

### Classic (Editor-Inspired)
| Theme | Slug | Description |
|-------|------|-------------|
| Nord | `nord` | Arctic blue-gray, calm and minimal |
| Dracula | `dracula` | Purple-tinted dark with vibrant accents |
| Gruvbox | `gruvbox` | Warm retro with earthy orange-brown tones |
| Catppuccin Mocha | `catppuccin-mocha` | Gentle pastel with soft lavender |

### Cyberpunk (Neon & Futuristic)
| Theme | Slug | Description |
|-------|------|-------------|
| Neon City | `neon-city` | Electric cyan and magenta neon glow |
| Synthwave '84 | `synthwave-84` | Retro-future pink and teal |
| Matrix | `matrix` | Green phosphor terminal hacker |
| Cyberpunk Red | `cyberpunk-red` | Aggressive red and violet neon |

### Natural (Nature-Inspired)
| Theme | Slug | Description |
|-------|------|-------------|
| Forest | `forest` | Organic green woodland palette |
| Ocean | `ocean` | Deep teal and coral sea tones |
| Sunset | `sunset` | Warm golden-orange dusk |
| Sakura | `sakura` | Soft cherry blossom pink |

### Minimal (High Readability)
| Theme | Slug | Description |
|-------|------|-------------|
| Monochrome | `monochrome` | Pure grayscale, no color distractions |
| Amber Terminal | `amber-terminal` | Vintage CRT phosphor amber |
| Paper Light | `paper-light` | Light background for bright environments |

At the end, tell the user:

> To apply a theme, use `/claude-theme-adaptive:theme` followed by the theme name or describe what you want.
