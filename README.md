# Instant Links for Zen

A Zen Browser mod that provides instant navigation from the URL bar.

## Features

- **Shift+Enter Shortcut**: Hold `Shift` and press `Enter` in the URL bar for instant navigation to the most relevant result
- **Visual Indicator**: Shows "Instant Link" when Shift is held
- **Configurable**: Choose between Google, DuckDuckGo, and Bing search engines
- **Native Feel**: Works like a built-in browser feature

## Installation with Sine

1. Install [Sine](https://github.com/CosmoCreeper/Sine) if you haven't already
2. Open Sine and add this repository URL:
   ```
   https://github.com/popcornfuzzy/Instant-Links-for-Zen
   ```
3. Click "Install" on the Instant Links mod
4. Restart Zen Browser

## Manual Installation (fx-autoconfig)

1. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig)
2. Copy `instant-links.uc.js` to your `chrome/JS/` folder
3. Copy `style.css` to your `chrome/` folder
4. Add to `userChrome.css`: `@import "style.css";`
5. Restart Zen

## Usage

1. Open a new tab (`Ctrl+T` / `Cmd+T`)
2. Type your search query in the URL bar
3. Press `Enter` for normal search
4. Hold `Shift` + press `Enter` for instant navigation

## Settings

In `about:config` or via Sine:

| Setting | Default | Description |
|---------|---------|-------------|
| `mod.instant-links.enabled` | `true` | Enable/disable the mod |
| `mod.instant-links.search-engine` | `google` | Search engine (google, duckduckgo, bing) |
| `mod.instant-links.show-indicator` | `true` | Show visual indicator |

## License

MIT License