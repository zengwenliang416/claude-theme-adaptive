# claude-theme-adaptive

Natural-language theme switching for Claude Code. Describe what you want your terminal to look like, and Claude picks the best theme from 15 curated options.

## Install

```bash
claude plugin add https://github.com/zengwenliang416/claude-theme-adaptive.git
```

## Usage

### Switch theme with natural language

```
/claude-theme-adaptive:theme I want something calm and blue
/claude-theme-adaptive:theme 想要一个温暖舒适的配色
/claude-theme-adaptive:theme cyberpunk neon
/claude-theme-adaptive:theme 眼睛有点累了
```

### Browse all themes

```
/claude-theme-adaptive:list
```

## Themes

### Classic
| Theme | Description |
|-------|-------------|
| **Nord** | Arctic blue-gray, calm and minimal |
| **Dracula** | Purple-tinted dark with vibrant accents |
| **Gruvbox** | Warm retro with earthy orange-brown tones |
| **Catppuccin Mocha** | Gentle pastel with soft lavender |

### Cyberpunk
| Theme | Description |
|-------|-------------|
| **Neon City** | Electric cyan and magenta neon glow |
| **Synthwave '84** | Retro-future pink and teal |
| **Matrix** | Green phosphor terminal hacker |
| **Cyberpunk Red** | Aggressive red and violet neon |

### Natural
| Theme | Description |
|-------|-------------|
| **Forest** | Organic green woodland palette |
| **Ocean** | Deep teal and coral sea tones |
| **Sunset** | Warm golden-orange dusk |
| **Sakura** | Soft cherry blossom pink |

### Minimal
| Theme | Description |
|-------|-------------|
| **Monochrome** | Pure grayscale, no color distractions |
| **Amber Terminal** | Vintage CRT phosphor amber |
| **Paper Light** | Light background for bright environments |

## How it works

The plugin uses Claude's language understanding to map your description to the best matching theme. It understands:

- Mood words: calm, energetic, warm, cool, cozy, professional
- Colors: blue, green, purple, pink, neon, pastel
- Named themes: nord, dracula, gruvbox, etc.
- Context: night coding, eye strain, presentations, bright room
- Chinese and English input

No TypeScript engine or custom hooks — Claude itself is the intelligence layer.

## License

MIT
