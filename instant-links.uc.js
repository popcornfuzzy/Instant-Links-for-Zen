(function() {
    'use strict';

    const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';
    const LUCKY_PARAM = '&btnI=I%27m+Feeling+Lucky';

    let shiftHeld = false;
    let initialized = false;

    function init() {
        if (initialized) return;
        initialized = true;

        if (document.readyState === 'complete') {
            attachListeners();
        } else {
            window.addEventListener('load', attachListeners);
        }
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

        console.log('[Instant Links] Ready. Hold Shift + Enter for instant navigation.');
    }

    function handleKeyDown(event) {
        if (event.key === 'Shift' && !event.repeat) {
            shiftHeld = true;
            updateIndicator(true);
        }

        if (event.key === 'Enter' && shiftHeld) {
            event.preventDefault();
            event.stopPropagation();

            const input = document.getElementById('urlbar-input');
            const value = input?.value?.trim() || '';

            if (value && !value.match(/^https?:\/\//)) {
                openInstantLink(value);
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

    async function openInstantLink(query) {
        const searchUrl = GOOGLE_SEARCH_URL + encodeURIComponent(query);

        try {
            const response = await fetch(searchUrl, {
                credentials: 'omit',
                headers: {
                    'Accept': 'text/html'
                }
            });

            const text = await response.text();
            const firstUrl = extractFirstResult(text);

            if (firstUrl) {
                const tab = gBrowser.addTrustedTab(firstUrl);
                gBrowser.selectedTab = tab;
                if (gURLBar) gURLBar.value = '';
                console.log('[Instant Links] Opened:', firstUrl);
            } else {
                gBrowser.addTrustedTab(searchUrl + LUCKY_PARAM);
            }
        } catch (e) {
            console.error('[Instant Links] Error:', e);
            gBrowser.addTrustedTab(searchUrl + LUCKY_PARAM);
        }
    }

    function extractFirstResult(html) {
        try {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const link = doc.querySelector('a[href^="/url?q="]');
            if (link) {
                const url = link.href;
                const match = url.match(/url\?q=(.*?)&sa=/);
                if (match && match[1]) {
                    return decodeURIComponent(match[1]);
                }
            }
        } catch (e) {}
        return null;
    }

    function updateIndicator(active) {
        const urlbar = document.getElementById('urlbar');
        if (!urlbar) return;

        if (active) {
            urlbar.setAttribute('instant-link-mode', 'true');
        } else {
            urlbar.removeAttribute('instant-link-mode');
        }
    }

    init();
})();