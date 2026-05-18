(function() {
    'use strict';

    const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';

    let shiftHeld = false;

    function init() {
        if (document.readyState !== 'complete') {
            window.addEventListener('load', onLoad);
        } else {
            onLoad();
        }
    }

    function onLoad() {
        waitForUrlbar().then(() => {
            console.log('[Instant Links] Initialized.');
            attachListeners();
        }).catch(() => {
            console.error('[Instant Links] Failed to initialize.');
        });
    }

    function waitForUrlbar() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;

            function check() {
                attempts++;
                const input = document.getElementById('urlbar-input');
                if (input) {
                    resolve();
                } else if (attempts < maxAttempts) {
                    setTimeout(check, 100);
                } else {
                    reject();
                }
            }
            check();
        });
    }

    function attachListeners() {
        const input = document.getElementById('urlbar-input');
        if (!input) return;

        input.addEventListener('keydown', onKeyDown, true);
        input.addEventListener('keyup', onKeyUp, true);
    }

    function onKeyDown(event) {
        if (event.key === 'Shift') {
            shiftHeld = true;
            updateIndicator(true);
        }

        if (event.key === 'Enter' && shiftHeld) {
            event.preventDefault();
            event.stopPropagation();
            handleEnter();
        }
    }

    function onKeyUp(event) {
        if (event.key === 'Shift') {
            shiftHeld = false;
            updateIndicator(false);
        }
    }

    function updateIndicator(active) {
        const urlbar = document.getElementById('urlbar');
        if (urlbar) {
            if (active) {
                urlbar.setAttribute('instant-link-mode', 'true');
            } else {
                urlbar.removeAttribute('instant-link-mode');
            }
        }
    }

    async function handleEnter() {
        const input = document.getElementById('urlbar-input');
        const value = input?.value?.trim() || '';

        if (!value || value.match(/^https?:\/\//)) {
            shiftHeld = false;
            updateIndicator(false);
            return;
        }

        await openInstantLink(value);
        shiftHeld = false;
        updateIndicator(false);
    }

    async function openInstantLink(query) {
        const searchUrl = GOOGLE_SEARCH_URL + encodeURIComponent(query);

        try {
            const response = await fetch(searchUrl, {
                credentials: 'omit',
                mode: 'cors'
            });

            const text = await response.text();
            const firstUrl = extractFirstResult(text);

            if (firstUrl) {
                openTab(firstUrl);
            }
        } catch (e) {
            openTab(searchUrl);
        }
    }

    function openTab(url) {
        const tab = gBrowser.addTrustedTab(url);
        gBrowser.selectedTab = tab;
        if (gURLBar) gURLBar.value = '';
    }

    function extractFirstResult(html) {
        try {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a[href]');
            for (const link of links) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/url?q=')) {
                    const match = href.match(/url\?q=(.*?)&sa=/);
                    if (match && match[1]) {
                        return decodeURIComponent(match[1]);
                    }
                }
            }
        } catch (e) {}
        return null;
    }

    init();
})();