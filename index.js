(function() {
    'use strict';

    const PREF_PREFIX = 'mod.instant-links.';
    const LUCKY_PARAMS = {
        google: '&btnI=I%27m+Feeling+Lucky',
        duckduckgo: '',
        bing: ''
    };
    const SEARCH_URLS = {
        google: 'https://www.google.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        bing: 'https://www.bing.com/search?q='
    };

    let shiftHeld = false;
    let enabled = true;
    let showIndicator = true;
    let searchEngine = 'google';

    function getPref(name, defaultValue) {
        try {
            const type = Services.prefs.getPrefType(name);
            if (type === Services.prefs.PREF_STRING) return Services.prefs.getStringPref(name);
            if (type === Services.prefs.PREF_INT) return Services.prefs.getIntPref(name);
            if (type === Services.prefs.PREF_BOOL) return Services.prefs.getBoolPref(name);
        } catch (e) {}
        return defaultValue;
    }

    function loadPrefs() {
        enabled = getPref(PREF_PREFIX + 'enabled', true);
        showIndicator = getPref(PREF_PREFIX + 'show-indicator', true);
        searchEngine = getPref(PREF_PREFIX + 'search-engine', 'google');
    }

    function openLuckyTab(input) {
        if (!input || !input.trim()) return;
        const baseUrl = SEARCH_URLS[searchEngine] || SEARCH_URLS.google;
        const luckyParam = LUCKY_PARAMS[searchEngine] || '';
        const url = baseUrl + encodeURIComponent(input.trim()) + luckyParam;

        try {
            gBrowser.addTrustedTab(url);
            const urlbar = document.getElementById('urlbar');
            if (urlbar) urlbar.value = '';
        } catch (e) {
            console.error('[Instant Links] Error:', e);
        }
    }

    function setIndicator(active) {
        if (!showIndicator) return;
        const urlbar = document.getElementById('urlbar');
        if (!urlbar) return;
        if (active) {
            urlbar.setAttribute('instant-links', 'true');
        } else {
            urlbar.removeAttribute('instant-links');
        }
    }

    function handleKeyDown(e) {
        if (!enabled) return;
        if (e.target.id !== 'urlbar-input' && !e.target.classList.contains('urlbar-input')) return;

        if (e.key === 'Shift' && !e.repeat) {
            shiftHeld = true;
            setIndicator(true);
        }

        if (e.key === 'Enter' && shiftHeld) {
            e.preventDefault();
            e.stopPropagation();
            const input = gURLBar?.value || '';
            if (input && !input.match(/^https?:\/\//) && !input.includes('.') && !input.includes(' ')) {
                openLuckyTab(input);
            }
            shiftHeld = false;
            setIndicator(false);
        }
    }

    function handleKeyUp(e) {
        if (e.key === 'Shift') {
            shiftHeld = false;
            setIndicator(false);
        }
    }

    function handleBlur() {
        shiftHeld = false;
        setIndicator(false);
    }

    function attachListeners() {
        const urlbar = document.getElementById('urlbar-input');
        if (!urlbar) {
            setTimeout(attachListeners, 500);
            return;
        }

        urlbar.addEventListener('keydown', handleKeyDown, true);
        urlbar.addEventListener('keyup', handleKeyUp, true);
        urlbar.addEventListener('blur', handleBlur, true);

        console.log('[Instant Links] Initialized. Hold Shift + Enter for instant link.');
    }

    loadPrefs();
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        attachListeners();
    } else {
        window.addEventListener('DOMContentLoaded', attachListeners);
    }
})();