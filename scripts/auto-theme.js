const fs = require('fs');
const path = require('path');

const CLAUDE_DIR = process.env.CLAUDE_CONFIG_DIR || path.join(process.env.HOME, '.claude');
const CONFIG_FILE = path.join(CLAUDE_DIR, 'theme-adaptive.json');
const SETTINGS_FILE = path.join(CLAUDE_DIR, 'settings.json');
const THEMES_DIR = path.join(CLAUDE_DIR, 'themes');
const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');

const EVENT = process.argv[2] || 'session';

if (!fs.existsSync(CONFIG_FILE)) process.exit(0);

let config;
try {
  config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
} catch (e) {
  process.exit(0);
}

if (config.enabled === false) process.exit(0);

if (config.manualOverride) {
  if (EVENT === 'session') {
    config.manualOverride = false;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n');
  }
  process.exit(0);
}

let selectedSlug = null;

switch (config.mode) {
  case 'daynight': {
    const hour = new Date().getHours();
    const dayStart = config.daynight?.dayStart ?? 8;
    const nightStart = config.daynight?.nightStart ?? 20;
    const isDay = hour >= dayStart && hour < nightStart;
    selectedSlug = isDay
      ? (config.daynight?.day || 'paper-light')
      : (config.daynight?.night || 'nord');
    break;
  }

  case 'project': {
    if (EVENT !== 'cwd') process.exit(0);
    const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const projects = config.projects || {};
    for (const [dir, slug] of Object.entries(projects)) {
      if (cwd === dir || cwd.startsWith(dir + '/')) {
        selectedSlug = slug;
        break;
      }
    }
    if (!selectedSlug) process.exit(0);
    break;
  }

  case 'random': {
    if (EVENT !== 'session') process.exit(0);
    const categories = config.random?.categories || ['classic', 'natural', 'cyberpunk', 'minimal'];
    const allThemes = [];
    for (const cat of categories) {
      const dir = path.join(PLUGIN_ROOT, 'themes', cat);
      if (fs.existsSync(dir)) {
        for (const f of fs.readdirSync(dir)) {
          if (f.endsWith('.json')) allThemes.push(f.replace('.json', ''));
        }
      }
    }
    if (allThemes.length === 0) process.exit(0);
    selectedSlug = allThemes[Math.floor(Math.random() * allThemes.length)];
    break;
  }

  default:
    process.exit(0);
}

if (!selectedSlug) process.exit(0);

let category = null;
for (const cat of ['classic', 'cyberpunk', 'natural', 'minimal']) {
  if (fs.existsSync(path.join(PLUGIN_ROOT, 'themes', cat, selectedSlug + '.json'))) {
    category = cat;
    break;
  }
}
if (!category) process.exit(0);

const src = path.join(PLUGIN_ROOT, 'themes', category, selectedSlug + '.json');
fs.mkdirSync(THEMES_DIR, { recursive: true });
fs.copyFileSync(src, path.join(THEMES_DIR, selectedSlug + '.json'));

let settings = {};
try { settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')); } catch (e) {}
settings.theme = 'custom:' + selectedSlug;
fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2) + '\n');
