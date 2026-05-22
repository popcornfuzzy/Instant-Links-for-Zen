(function () {
  "use strict";

  let shiftHeld = false;
  let hintObserver = null;
  let hintContainer = null;
  let hintUpdateTimer = null;
  let currentHintRow = null;

  function init() {
    if (document.readyState !== "complete") {
      window.addEventListener("load", onLoad);
    } else {
      onLoad();
    }
  }

  function onLoad() {
    let attempts = 0;
    const tryAttach = () => {
      const input = document.getElementById("urlbar-input");
      if (input) {
        attachToInput(input);
        setupHintObservers(input);
        console.log("[Instant Links] Initialized.");
      } else if (++attempts < 100) {
        setTimeout(tryAttach, 100);
      }
    };
    tryAttach();
  }

  function attachToInput(input) {
    input.addEventListener("keydown", onKeyDown, true);
    input.addEventListener("keyup", onKeyUp, true);
  }

  function onKeyDown(event) {
    if (event.key === "Shift") {
      shiftHeld = true;
      updateIndicator(true);
    }

    if (event.key === "Enter" && shiftHeld) {
      event.preventDefault();
      event.stopPropagation();
      handleEnter();
    }
  }

  function onKeyUp(event) {
    if (event.key === "Shift") {
      shiftHeld = false;
      updateIndicator(false);
    }
  }

  function updateIndicator(active) {
    const urlbar = document.getElementById("urlbar");
    if (urlbar) {
      if (active) {
        urlbar.setAttribute("instant-link-mode", "true");
      } else {
        urlbar.removeAttribute("instant-link-mode");
      }
    }
  }

  function setupHintObservers(input) {
    input.addEventListener("input", scheduleHintUpdate, true);
    input.addEventListener("focus", scheduleHintUpdate, true);
    window.addEventListener("resize", scheduleHintUpdate, true);
    scheduleHintUpdate();
  }

  function scheduleHintUpdate() {
    if (hintUpdateTimer) {
      clearTimeout(hintUpdateTimer);
    }
    hintUpdateTimer = setTimeout(updateHint, 0);
    observeResults();
  }

  function observeResults() {
    const results = getResultsRoot();
    if (!results || results === hintContainer) return;

    if (hintObserver) {
      hintObserver.disconnect();
    }
    hintContainer = results;
    hintObserver = new MutationObserver(scheduleHintUpdate);
    hintObserver.observe(results, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  function getResultsRoot() {
    return (
      document.getElementById("urlbar-results") ||
      document.getElementById("urlbarView-results") ||
      document.querySelector(".urlbarView-results")
    );
  }

  function updateHint() {
    const results = getResultsRoot();
    if (!results) {
      removeHint();
      return;
    }

    const selectedRow = results.querySelector(".urlbarView-row[selected]");
    if (!selectedRow) {
      removeHint();
      return;
    }

    const isSearchRow =
      selectedRow.getAttribute("type") === "search" ||
      selectedRow.getAttribute("actiontype") === "searchengine";

    if (!isSearchRow) {
      removeHint();
      return;
    }

    ensureHint(selectedRow);
  }

  function ensureHint(row) {
    if (currentHintRow && currentHintRow !== row) {
      removeHint();
    }

    let hint = row.querySelector(".instant-link-hint");
    if (hint) {
      currentHintRow = row;
      return;
    }

    hint = document.createElement("span");
    hint.className = "instant-link-hint";
    hint.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            color: var(--toolbar-field-color, var(--lwt-text-color, #cdd6f4));
            pointer-events: none;
            z-index: 1000;
        `;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.style.fill = "currentColor";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M8.65 17.65 12 14.3l3.35 3.35q.3.3.7.3t.7-.3q.3-.3.3-.7t-.3-.7l-4-4q-.3-.3-.7-.3t-.7.3l-4 4q-.3.3-.3.7t.3.7q.3.3.7.3t.7-.3ZM7 10q-.825 0-1.413-.588Q5 8.825 5 8V6q0-.825.587-1.413Q6.175 4 7 4h10q.825 0 1.413.587Q19 5.175 19 6v2q0 .825-.587 1.412Q17.825 10 17 10Z",
    );
    svg.appendChild(path);

    const text = document.createElement("span");
    text.textContent = "Shift+Enter for top result";

    hint.append(svg, text);
    row.style.position = "relative";
    row.appendChild(hint);
    currentHintRow = row;
  }

  function removeHint() {
    const hint = document.querySelector(".instant-link-hint");
    if (hint) hint.remove();
    currentHintRow = null;
  }

  function handleEnter() {
    const input = document.getElementById("urlbar-input");
    const value = input?.value?.trim() || "";

    if (!value) {
      shiftHeld = false;
      updateIndicator(false);
      return;
    }

    console.log("[Instant Links] Query:", value);

    const searchUrl =
      "https://www.google.com/search?btnI=1&q=" + encodeURIComponent(value);

    openTab(searchUrl);
    shiftHeld = false;
    updateIndicator(false);
  }

  function openTab(url) {
    try {
      const tab = gBrowser.addTrustedTab(url);
      gBrowser.selectedTab = tab;
      if (gURLBar) gURLBar.value = "";
      console.log("[Instant Links] Opened:", url);
    } catch (e) {
      console.error("[Instant Links] Error:", e);
    }
  }

  init();
})();
