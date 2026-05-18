# Instant Links for Zen

Ein Zen Browser Mod, der das "I'm Feeling Lucky" Feature direkt in die URL bar bringt.

## Features

- **Shift+Enter Shortcut**: Halte `Shift` gedrückt und drücke `Enter` in der URL bar, um direkt zum ersten Google Suchergebnis zu springen
- **Visueller Indikator**: Zeigt "I'm Feeling Lucky" an, wenn Shift gedrückt wird
- **Konfigurierbar**: Wähle zwischen Google, DuckDuckGo und Bing
- **Nativ**: Fühlt sich an wie ein eingebautes Feature

## Installation

### Über Sine (Empfohlen)

1. Installiere [Sine](https://github.com/CosmoCreeper/Sine)
2. Füge diese Repository URL hinzu: `https://github.com/simonpassenbrunner/Instant-Links-for-Zen`
3. Aktiviere den Mod in Sine

### Manuell (fx-autoconfig)

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

| Einstellung | Standard | Beschreibung |
|-------------|----------|--------------|
| `mod.instant-lucky.enabled` | `true` | Mod aktivieren/deaktivieren |
| `mod.instant-lucky.search-engine` | `google` | Suchmaschine wählen |
| `mod.instant-lucky.show-indicator` | `true` | Visuellen Indikator anzeigen |

## Lizenz

MIT License
