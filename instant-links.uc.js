(function() {
    'use strict';

    const PREF_ENABLED = 'mod.instant-links.enabled';
    const PREF_INDICATOR = 'mod.instant-links.show-indicator';
    const PREF_ENGINE = 'mod.instant-links.search-engine';

    const SEARCH_URLS = {
        google: 'https://www.google.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        bing: 'https://www.bing.com/search?q='
    };

    const LUCKY_PARAMS = {
        google: '&btnI=I%27m+Feeling+Lucky',
        duckduckgo: '',
        bing: ''
    };

    let shiftHeld = false;
    let initialized = false;
    let indicatorAdded = false;

    function getPref(name, defaultValue) {
        try {
            const type = Services.prefs.getPrefType(name);
            if (type === Services.prefs.PREF_BOOL) return Services.prefs.getBoolPref(name);
            if (type === Services.prefs.PREF_STRING) return Services.prefs.getStringPref(name);
        } catch (e) {}
        return defaultValue;
    }

    function addPermanentIndicator() {
        if (indicatorAdded) return;
        
        const urlbar = document.getElementById('urlbar');
        if (!urlbar) return;

        const indicator = document.createElement('div');
        indicator.id = 'instant-links-icon';
        indicator.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        indicator.title = 'Hold Shift + Enter for instant link';
        
        const inputBox = urlbar.querySelector('.urlbar-input-box') || urlbar.querySelector('#urlbar-input-container');
        if (inputBox && inputBox.parentNode) {
            inputBox.parentNode.insertBefore(indicator, inputBox);
            indicatorAdded = true;
        }
    }

    function init() {
        if (!getPref(PREF_ENABLED, true)) {
            console.log('[Instant Links] Disabled by preference.');
            return;
        }
        if (initialized) return;
        initialized = true;

        if (document.readyState === 'complete') {
            attachListeners();
            addPermanentIndicator();
        } else {
            window.addEventListener('load', () => {
                attachListeners();
                addPermanentIndicator();
            });
        }

        console.log('[Instant Links] Initialized. Hold Shift + Enter for instant navigation.');
    }

    function attachListeners() {
        const input = document.getElementById('urlbar-input');
        if (!input) {
            setTimeout(attachListeners, 200);
            return;
        }

        input.addEventListener('keydown', handleKeyDown, true);
        input.addEventListener('keyup', handleKeyUp, true);
        input.addEventListener('blur', handleBlur, true);

        console.log('[Instant Links] Listeners attached to URL bar.');
    }

    function handleKeyDown(event) {
        if (!getPref(PREF_ENABLED, true)) return;

        if (event.key === 'Shift' && !event.repeat) {
            shiftHeld = true;
            updateIndicator(true);
        }

        if (event.key === 'Enter' && shiftHeld) {
            event.preventDefault();
            event.stopPropagation();

            const input = document.getElementById('urlbar-input');
            const value = input?.value?.trim() || '';

            if (value && !value.match(/^https?:\/\//) && !value.includes('.') && !value.includes(' ')) {
                openInstantTab(value);
            }

            shiftHeld = false;
            updateIndicator(false);
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'Shift') {
            shiftHeld = false;
            updateIndicator(false);
        }
    }

    function handleBlur() {
        shiftHeld = false;
        updateIndicator(false);
    }

    function openInstantTab(query) {
        const engine = getPref(PREF_ENGINE, 'google');
        const baseUrl = SEARCH_URLS[engine] || SEARCH_URLS.google;
        const luckyParam = LUCKY_PARAMS[engine] || '';
        const url = baseUrl + encodeURIComponent(query) + luckyParam;

        try {
            const tab = gBrowser.addTrustedTab(url);
            gBrowser.selectedTab = tab;
            if (gURLBar) gURLBar.value = '';
            console.log('[Instant Links] Opened:', url);
        } catch (e) {
            console.error('[Instant Links] Error:', e);
        }
    }

    function updateIndicator(active) {
        const icon = document.getElementById('instant-links-icon');
        if (icon) {
            if (active) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        }

        if (!getPref(PREF_INDICATOR, true)) return;

        const urlbar = document.getElementById('urlbar');
        if (!urlbar) return;

        if (active) {
            urlbar.setAttribute('instant-links', 'true');
        } else {
            urlbar.removeAttribute('instant-links');
        }
    }

    init();
})();