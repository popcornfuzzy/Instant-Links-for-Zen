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
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            color: inherit;
            pointer-events: none;
            z-index: 1000;
        `;

    const createIcon = (nodes) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("width", "12");
      svg.setAttribute("height", "12");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.style.cssText =
        "fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;";

      nodes.forEach(({ name, attrs }) => {
        const node = document.createElementNS("http://www.w3.org/2000/svg", name);
        Object.entries(attrs).forEach(([key, value]) => {
          node.setAttribute(key, value);
        });
        svg.appendChild(node);
      });

      return svg;
    };

    const createFilledIcon = (viewBox, pathData) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", viewBox);
      svg.setAttribute("width", "12");
      svg.setAttribute("height", "12");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.style.cssText = "fill: currentColor;";

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      svg.appendChild(path);

      return svg;
    };

    const iconBox = document.createElement("span");
    iconBox.className = "instant-link-hint-icons";
    iconBox.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            border-radius: 6px;
            background: color-mix(in srgb, currentColor 16%, transparent);
            color: inherit;
        `;

    const shiftIcon = createFilledIcon(
      "0 -960 960 960",
      "M320-160v-280H204q-26 0-36.5-22.5T173-505l276-337q12-15 31-15t31 15l276 337q16 20 5.5 42.5T756-440H640v280q0 17-11.5 28.5T600-120H360q-17 0-28.5-11.5T320-160Zm80-40h160v-320h111L480-754 289-520h111v320Zm80-320Z",
    );

    const returnIcon = createIcon([
      { name: "polyline", attrs: { points: "9 10 5 14 9 18" } },
      { name: "path", attrs: { d: "M19 6v6a4 4 0 0 1-4 4H5" } },
    ]);

    iconBox.append(shiftIcon, returnIcon);

    const text = document.createElement("span");
    text.textContent = "Open top result instantly";

    hint.append(text, iconBox);
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
