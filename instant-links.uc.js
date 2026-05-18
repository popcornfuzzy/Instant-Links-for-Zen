(function() {
    'use strict';

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

        console.log('[Instant Link Indicator] Ready. Hold Shift to see the instant link outline.');
    }

    function handleKeyDown(event) {
        if (event.key === 'Shift' && !event.repeat) {
            shiftHeld = true;
            updateIndicator(true);
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