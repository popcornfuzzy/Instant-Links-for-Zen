// ==UserScript==
// @name Instant Links for Zen
// @description Shift+Enter in der URL bar öffnet direkt das "I'm Feeling Lucky" Ergebnis von Google
// @version 1.0.0
// @match *://*/*
// ==/UserScript==

(function () {
  'use strict';

  const LUCKY_PARAM = '&btnI=I%27m+Feeling+Lucky';
  const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';

  let shiftHeld = false;

  function onWindowLoad() {
    const window = Services.wm.getMostRecentWindow('navigator:browser');
    if (!window || !window.gBrowser) return;

    const urlbarInput = window.document.getElementById('urlbar-input');
    if (!urlbarInput) return;

    urlbarInput.addEventListener('keydown', (event) => {
      if (event.key === 'Shift') {
        shiftHeld = true;
        updateVisualIndicator(window, true);
      }
    });

    urlbarInput.addEventListener('keyup', (event) => {
      if (event.key === 'Shift') {
        shiftHeld = false;
        updateVisualIndicator(window, false);
      }
    });

    urlbarInput.addEventListener('blur', () => {
      shiftHeld = false;
      updateVisualIndicator(window, false);
    });

    const originalHandleCommand = window.gURLBar.handleCommand.bind(window.gURLBar);

    window.gURLBar.handleCommand = function (event) {
      const input = this.input.value.trim();

      if (shiftHeld && input && !input.startsWith('http') && !input.includes('.')) {
        event.preventDefault();
        event.stopPropagation();

        const luckyUrl = GOOGLE_SEARCH_URL + encodeURIComponent(input) + LUCKY_PARAM;

        const tab = window.gBrowser.addTrustedTab(luckyUrl, {
          triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({}),
        });

        this.value = '';
        this.closePopup();
        shiftHeld = false;
        updateVisualIndicator(window, false);
        return;
      }

      return originalHandleCommand(event);
    };

    console.log('Instant Links for Zen: Aktiviert. Drücke Shift+Enter für Google "I\'m Feeling Lucky".');
  }

  function updateVisualIndicator(window, isActive) {
    const urlbar = window.document.getElementById('urlbar');
    if (!urlbar) return;

    if (isActive) {
      urlbar.setAttribute('instant-lucky', 'true');
    } else {
      urlbar.removeAttribute('instant-lucky');
    }
  }

  Services.wm.addListener({
    onOpenWindow: (xulWindow) => {
      const domWindow = xulWindow.docShell.domWindow;
      domWindow.addEventListener('load', () => {
        if (domWindow.location.href === 'chrome://browser/content/browser.xhtml') {
          onWindowLoad();
        }
      }, { once: true });
    },
    onCloseWindow: () => {},
    onWindowTitleChange: () => {},
  });

  const existingWindow = Services.wm.getMostRecentWindow('navigator:browser');
  if (existingWindow && existingWindow.document.readyState === 'complete') {
    onWindowLoad();
  }
})();
