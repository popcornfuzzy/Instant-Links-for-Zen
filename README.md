# Instant Links for Zen

Ein Zen Browser Mod, der das "I'm Feeling Lucky" Feature direkt in die URL bar bringt.

## Features

- **Shift+Enter Shortcut**: Halte `Shift` gedrückt und drücke `Enter` in der URL bar, um direkt zum ersten Google Suchergebnis zu springen
- **Visueller Indikator**: Zeigt "I'm Feeling Lucky" an, wenn Shift gedrückt wird
- **Konfigurierbar**: Wähle zwischen Google, DuckDuckGo und Bing
- **Nativ**: Fühlt sich an wie ein eingebautes Feature

## Installation mit Sine

1. Installiere [Sine](https://github.com/CosmoCreeper/Sine) falls noch nicht vorhanden
2. Öffne Sine und füge diese Repository URL hinzu:
   ```
   https://github.com/simonpassenbrunner/Instant-Links-for-Zen
   ```
3. Klicke auf "Install" für den Instant Links Mod
4. Starte Zen Browser neu

## Manuelle Installation (fx-autoconfig)

1. Installiere [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig)
2. Kopiere `index.js` in deinen `chrome/JS/` Ordner
3. Kopiere `style.css` in deinen `chrome/` Ordner
4. Füge zu `userChrome.css` hinzu: `@import "style.css";`
5. Starte Zen neu

## Verwendung

1. Öffne einen neuen Tab (`Ctrl+T` / `Cmd+T`)
2. Tippe deine Suche in die URL bar
3. Drücke `Enter` für normale Suche
4. Halte `Shift` + drücke `Enter` für "I'm Feeling Lucky"

## Einstellungen

In `about:config` oder über Sine:

| Einstellung | Standard | Beschreibung |
|-------------|----------|--------------|
| `mod.instant-lucky.enabled` | `true` | Mod aktivieren/deaktivieren |
| `mod.instant-lucky.search-engine` | `google` | Suchmaschine wählen (google, duckduckgo, bing) |
| `mod.instant-lucky.show-indicator` | `true` | Visuellen Indikator anzeigen |

## Technische Details

- **Google**: Nutzt `&btnI=I%27m+Feeling+Lucky` Parameter für "I'm Feeling Lucky"
- **DuckDuckGo/Bing**: Öffnet die erste Suchergebnis-URL direkt

## Lizenz

MIT License