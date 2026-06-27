---
description: Configure automatic theme switching mode (day/night, per-project, or random)
allowed-tools: Bash, Read, Write, AskUserQuestion
---

# Configure Auto Theme Switching

Help the user set up automatic theme switching. The configuration is stored at `~/.claude/theme-adaptive.json`.

## Step 1: Read Current Config

```bash
cat "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/theme-adaptive.json" 2>/dev/null || echo "No config yet"
```

Show the current configuration if it exists.

## Step 2: Ask Mode

Use AskUserQuestion to ask which auto-switching mode the user wants:

- **daynight**: Automatically switch between a day theme and a night theme based on time of day
- **project**: Different themes for different project directories
- **random**: Random theme on each session start
- **off**: Disable auto-switching

## Step 3: Configure Mode Parameters

### If daynight:

Ask the user (can use AskUserQuestion or conversation):

1. **Day theme** (default: paper-light) - theme to use during daytime
2. **Night theme** (default: nord) - theme to use at night
3. **Day start hour** (default: 8) - hour when day begins (0-23)
4. **Night start hour** (default: 20) - hour when night begins (0-23)

Show available themes for reference:
- Classic: nord, dracula, gruvbox, catppuccin-mocha
- Cyberpunk: neon-city, synthwave-84, matrix, cyberpunk-red
- Natural: forest, ocean, sunset, sakura
- Minimal: monochrome, amber-terminal, paper-light

### If project:

1. Ask which project directory to configure (default to current working directory)
2. Ask which theme to associate with it
3. Show current project mappings if any exist
4. Allow adding multiple mappings

### If random:

Ask which theme categories to include (default: all four):
- classic
- cyberpunk
- natural
- minimal

## Step 4: Write Config

Write the configuration to `~/.claude/theme-adaptive.json`:

### daynight example:
```json
{
  "enabled": true,
  "mode": "daynight",
  "manualOverride": false,
  "daynight": {
    "day": "paper-light",
    "night": "nord",
    "dayStart": 8,
    "nightStart": 20
  }
}
```

### project example:
```json
{
  "enabled": true,
  "mode": "project",
  "manualOverride": false,
  "projects": {
    "/Users/me/work/frontend": "neon-city",
    "/Users/me/work/backend": "gruvbox"
  }
}
```

### random example:
```json
{
  "enabled": true,
  "mode": "random",
  "manualOverride": false,
  "random": {
    "categories": ["classic", "natural", "cyberpunk", "minimal"]
  }
}
```

### off:
```json
{
  "enabled": false,
  "mode": "off"
}
```

Use the Write tool to create/update the file at `${CLAUDE_CONFIG_DIR:-$HOME/.claude}/theme-adaptive.json`.

## Step 5: Confirm

After writing, tell the user:

- Which mode was configured
- When it will take effect:
  - **daynight**: next session start (or restart current session)
  - **project**: next time you change project directory
  - **random**: next session start
- How to override: manually use `/claude-theme-adaptive:theme` anytime; auto-switching resumes next session
- How to disable: run `/claude-theme-adaptive:configure` and choose "off"
