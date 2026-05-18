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
        let attempts = 0;
        const tryAttach = () => {
            const input = document.getElementById('urlbar-input');
            if (input) {
                attachToInput(input);
                console.log('[Instant Links] Initialized.');
            } else if (++attempts < 100) {
                setTimeout(tryAttach, 100);
            }
        };
        tryAttach();

        document.addEventListener('keydown', onDocumentKeyDown, true);
        document.addEventListener('keyup', onDocumentKeyUp, true);
    }

    function attachToInput(input) {
        input.addEventListener('keydown', onKeyDown, true);
        input.addEventListener('keyup', onKeyUp, true);
    }

    function onDocumentKeyDown(event) {
        const input = document.getElementById('urlbar-input');
        if (!input) return;
        if (document.activeElement !== input && document.activeElement !== document.getElementById('urlbar')) return;

        if (event.key === 'Shift') {
            shiftHeld = true;
            updateIndicator(true);
        }

        if (event.key === 'Enter' && shiftHeld) {
            if (document.activeElement === input || document.activeElement?.closest('#urlbar')) {
                event.preventDefault();
                event.stopPropagation();
                handleEnter();
            }
        }
    }

    function onDocumentKeyUp(event) {
        if (event.key === 'Shift') {
            shiftHeld = false;
            updateIndicator(false);
        }
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