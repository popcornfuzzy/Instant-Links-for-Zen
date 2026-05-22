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
                injectHint();
            } else {
                urlbar.removeAttribute('instant-link-mode');
                removeHint();
            }
        }
    }

    function injectHint() {
        let hint = document.getElementById('instant-link-hint');
        if (hint) return;

        const results = document.getElementById('urlbar-results');
        if (!results) return;

        const firstRow = results.querySelector('.urlbarView-row[type="search"], .urlbarView-row[actiontype="searchengine"]');
        if (!firstRow) return;

        hint = document.createElement('div');
        hint.id = 'instant-link-hint';
        hint.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            color: var(--toolbar-field-color, #cdd6f4);
            pointer-events: none;
            z-index: 1000;
        `;
        hint.textContent = '⬆ Shift+Enter';

        firstRow.style.position = 'relative';
        firstRow.appendChild(hint);
    }

    function removeHint() {
        const hint = document.getElementById('instant-link-hint');
        if (hint) hint.remove();
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

        const searchUrl = 'https://www.google.com/search?btnI=1&q=' + encodeURIComponent(value);

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