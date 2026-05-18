(function() {
    'use strict';

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
    }

    function attachToInput(input) {
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

    function handleEnter() {
        const input = document.getElementById('urlbar-input');
        const value = input?.value?.trim() || '';

        if (!value) {
            shiftHeld = false;
            updateIndicator(false);
            return;
        }

        console.log('[Instant Links] Query:', value);

        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(value);

        openTab(searchUrl);
        shiftHeld = false;
        updateIndicator(false);
    }

    function openTab(url) {
        try {
            const tab = gBrowser.addTrustedTab(url);
            gBrowser.selectedTab = tab;
            if (gURLBar) gURLBar.value = '';
            console.log('[Instant Links] Opened:', url);
        } catch (e) {
            console.error('[Instant Links] Error:', e);
        }
    }

    init();
})();