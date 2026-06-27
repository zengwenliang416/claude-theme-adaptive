---
description: Switch Claude Code theme using natural language - describe what you want, get the right theme
allowed-tools: Bash, Read, Write, AskUserQuestion
---

# Adaptive Theme Switching

You are a theme recommendation engine. The user describes their visual preference in natural language (English or Chinese). Pick the best matching theme and apply it.

## Step 1: Understand Intent

Parse for:
- **Mood/atmosphere**: cozy, energetic, calm, dark, retro, futuristic, warm, cool, professional, playful
- **Color preferences**: specific colors (green, purple, neon, pastel, warm, cool)
- **Reference themes**: named themes (nord, dracula, gruvbox, synthwave, matrix, etc.)
- **Context**: coding at night, bright room, eye strain, presenting
- **Direct names**: if the user names a theme exactly, skip reasoning and apply it

## Step 2: Match to Theme

### Classic (editor-inspired, familiar palettes)

| Theme | Slug | Category | Keywords (EN) | Keywords (CN) | Best for |
|-------|------|----------|---------------|---------------|----------|
| Nord | nord | classic | cool, arctic, blue-gray, calm, minimal, Scandinavian, ice | 冷色, 冰, 北欧, 平静, 安静, 蓝灰 | Calm focused work, low contrast |
| Dracula | dracula | classic | purple, dark, vampire, popular, vibrant | 紫色, 吸血鬼, 流行, 经典 | General coding, popular choice |
| Gruvbox | gruvbox | classic | warm, retro, brown, orange, earthy, cozy | 暖色, 温暖, 复古, 棕色, 橙色, 舒适 | Warm retro feel, eye comfort |
| Catppuccin Mocha | catppuccin-mocha | classic | pastel, soft, mocha, gentle, lavender | 柔和, 粉彩, 摩卡, 温柔, 薰衣草 | Gentle on eyes, modern pastel |

### Cyberpunk (neon, high-contrast, futuristic)

| Theme | Slug | Category | Keywords (EN) | Keywords (CN) | Best for |
|-------|------|----------|---------------|---------------|----------|
| Neon City | neon-city | cyberpunk | neon, city, electric, cyan, magenta, bright | 霓虹, 城市, 电光, 青色, 品红 | High energy cyberpunk |
| Synthwave '84 | synthwave-84 | cyberpunk | synthwave, retro-future, 80s, vaporwave, pink | 合成波, 复古未来, 80年代, 蒸汽波 | Retro-futuristic coding |
| Matrix | matrix | cyberpunk | matrix, hacker, green-on-black, terminal | 黑客, 矩阵, 绿色终端, 代码雨 | Hacker aesthetic |
| Cyberpunk Red | cyberpunk-red | cyberpunk | cyberpunk, red, danger, edgy, aggressive | 赛博朋克, 红色, 危险, 攻击性 | High contrast aggressive |

### Natural (nature-inspired, organic)

| Theme | Slug | Category | Keywords (EN) | Keywords (CN) | Best for |
|-------|------|----------|---------------|---------------|----------|
| Forest | forest | natural | forest, green, nature, trees, organic, earthy | 森林, 绿色, 自然, 树木, 大地 | Nature lovers, calm green |
| Ocean | ocean | natural | ocean, sea, blue, water, deep, teal | 海洋, 大海, 蓝色, 深海, 水 | Deep blue calm |
| Sunset | sunset | natural | sunset, warm, orange, dusk, golden, evening | 日落, 黄昏, 温暖, 金色, 傍晚 | Evening coding, warm tones |
| Sakura | sakura | natural | sakura, cherry blossom, pink, spring, Japanese | 樱花, 粉色, 春天, 日系, 浪漫 | Spring aesthetic, soft pink |

### Minimal (reduced palette, high readability)

| Theme | Slug | Category | Keywords (EN) | Keywords (CN) | Best for |
|-------|------|----------|---------------|---------------|----------|
| Monochrome | monochrome | minimal | monochrome, grayscale, simple, no color, focus | 黑白, 灰度, 简约, 无色, 极简 | Maximum focus |
| Amber Terminal | amber-terminal | minimal | amber, retro terminal, CRT, vintage, phosphor | 琥珀, 复古终端, CRT, 老式 | Retro terminal nostalgia |
| Paper Light | paper-light | minimal | light, paper, day, bright, white, daytime | 浅色, 纸张, 白天, 明亮, 白色 | Bright environments |

### Context-based Recommendations

| User Context | Recommended Theme | Why |
|---|---|---|
| 眼睛累了 / eye strain / 刺眼 | catppuccin-mocha or forest | Low contrast, gentle colors |
| 太亮了 / too bright | nord or ocean | Cool, subdued tones |
| 太暗了 / too dark | paper-light | Light base theme |
| 晚上 / night coding | dracula or gruvbox | Dark with good contrast |
| 演示 / presenting | monochrome or paper-light | Clean, professional |
| 想要酷一点 / cool / awesome | neon-city or cyberpunk-red | High visual impact |
| 想要安静 / peaceful | nord or forest | Calm, low saturation |
| 想要温暖 / warm / cozy | gruvbox or sunset | Warm earth tones |

## Step 3: Apply

If the match is clear, apply directly without asking. If ambiguous, show top 2-3 options and let the user pick.

Resolve the plugin root and run the apply script:

```bash
PLUGIN_ROOT=$(ls -d "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/*/claude-theme-adaptive/*/ 2>/dev/null | sort -V | tail -1)
bash "${PLUGIN_ROOT}scripts/apply-theme.sh" "<category>" "<slug>"
```

Where `<category>` is one of: classic, cyberpunk, natural, minimal.
And `<slug>` is the theme filename without .json extension.

After applying, set the manual override flag so auto-switching does not overwrite the user's choice until next session:

```bash
CONFIG="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/theme-adaptive.json"
if [ -f "$CONFIG" ]; then
  node -e "const fs=require('fs'),p=process.argv[1];try{const c=JSON.parse(fs.readFileSync(p,'utf8'));c.manualOverride=true;fs.writeFileSync(p,JSON.stringify(c,null,2)+'\n')}catch(e){}" "$CONFIG"
fi
```

After success, tell the user in one sentence what was applied and suggest 1-2 alternatives from the same or adjacent category.

## Edge Cases

- **"random" / "随机" / "surprise me"**: Pick randomly. Run `echo $((RANDOM % 15))` and map 0-3 to classic, 4-7 to cyberpunk, 8-11 to natural, 12-14 to minimal themes.
- **"reset" / "重置" / "default" / "默认"**: Remove the custom theme. Read settings.json, delete the "theme" key, write it back.
- **"current" / "当前" / "what theme"**: Read `~/.claude/settings.json`, extract and report the current "theme" value.
- **"list" / "列表"**: Suggest using `/claude-theme-adaptive:list` instead.
- **No input / empty**: Show all themes grouped by category and ask the user to describe what they want.
