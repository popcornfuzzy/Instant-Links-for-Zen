# Instant Links for Zen

A visual indicator mod that enhances Zen Browser's built-in instant link feature.

## Features

- **Visual Indicator**: When you hold `Shift` in the URL bar, an outline appears to show that the `Shift+Enter` instant link feature is active
- **Help Text**: Shows "Shift+Enter: Instant Link" tooltip when Shift is held
- **Uses Native Feature**: Works with Zen's built-in `Cmd+Enter` instant link functionality

## How It Works

Zen Browser already has a built-in instant link feature using `Cmd+Enter` (or `Ctrl+Enter` on Windows/Linux). This mod adds a visual indicator to show when `Shift+Enter` will trigger the instant link.

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

## Note

This mod only provides a visual indicator. The instant link functionality is built into Zen Browser. You can rebind the keyboard shortcut in `Settings > Keyboard Shortcuts`.

## License

MIT License