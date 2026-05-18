// Instant Links - Sine/fx-autoconfig script
// Shift+Enter in the URL bar for instant page navigation

const { Services } = ChromeUtils.importESModule('resource://gre/modules/Services.sys.mjs');

const InstantLinks = {
  shiftHeld: false,
  enabled: true,
  showIndicator: true,
  searchEngine: 'google',

  SEARCH_URLS: {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q='
  },

  INSTANT_PARAMS: {
    google: '&btnI=I%27m+Feeling+Lucky',
    duckduckgo: '',
    bing: ''
  },

  init() {
    this.loadPreferences();
    this.setupListeners();
    console.log('[Instant Links] Active. Hold Shift + Enter for instant navigation.');
  },

  loadPreferences() {
    try {
      this.enabled = Services.prefs.getBoolPref('mod.instant-links.enabled', true);
      this.showIndicator = Services.prefs.getBoolPref('mod.instant-links.show-indicator', true);
      this.searchEngine = Services.prefs.getStringPref('mod.instant-links.search-engine', 'google');
    } catch (e) {}
  },

  setupListeners() {
    const windowListener = {
      onWindowOpened(window) {
        if (window.location?.href !== 'chrome://browser/content/browser.xhtml') return;
        window.addEventListener('load', () => {
          const urlbarInput = window.document.getElementById('urlbar-input');
          if (!urlbarInput) return;
          urlbarInput.addEventListener('keydown', e => InstantLinks.onKeyDown(e, window), true);
          urlbarInput.addEventListener('keyup', e => InstantLinks.onKeyUp(e, window), true);
          urlbarInput.addEventListener('blur', () => InstantLinks.onBlur(window), true);
        }, { once: true });
      }
    };

    Services.wm.addListener(windowListener);

    const existingWindow = Services.wm.getMostRecentWindow('navigator:browser');
    if (existingWindow) {
      windowListener.onWindowOpened(existingWindow);
    }
  },

  onKeyDown(event, window) {
    if (!this.enabled) return;

    if (event.key === 'Shift' && !event.repeat) {
      this.shiftHeld = true;
      if (this.showIndicator) this.setIndicator(window, true);
    }

    if (event.key === 'Enter' && this.shiftHeld) {
      event.preventDefault();
      event.stopPropagation();
      this.openInstantResult(window);
    }
  },

  onKeyUp(event, window) {
    if (event.key === 'Shift') {
      this.shiftHeld = false;
      if (this.showIndicator) this.setIndicator(window, false);
    }
  },

  onBlur(window) {
    this.shiftHeld = false;
    if (this.showIndicator) this.setIndicator(window, false);
  },

  openInstantResult(window) {
    const input = window.gURLBar?.value?.trim();
    if (!input || input.match(/^https?:\/\//) || input.includes('.')) return;

    const baseUrl = this.SEARCH_URLS[this.searchEngine] || this.SEARCH_URLS.google;
    const instantParam = this.INSTANT_PARAMS[this.searchEngine] || '';
    const url = baseUrl + encodeURIComponent(input) + instantParam;

    try {
      window.gBrowser.addTrustedTab(url);
      window.gURLBar.value = '';
    } catch (e) {
      console.error('[Instant Links] Error:', e);
    }

    this.shiftHeld = false;
    if (this.showIndicator) this.setIndicator(window, false);
  },

  setIndicator(window, active) {
    const urlbar = window.document.getElementById('urlbar');
    if (!urlbar) return;
    active ? urlbar.setAttribute('instant-links', 'true') : urlbar.removeAttribute('instant-links');
  }
};

InstantLinks.init();