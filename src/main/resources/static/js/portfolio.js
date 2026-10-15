(() => {
    "use strict";

    // Theme toggle
    const root = document.documentElement;
    const toggle = document.querySelector(".theme-toggle");
    const label = document.querySelector(".theme-label");
    const storageKey = "suvankar-portfolio-theme";

    const systemDark = window.matchMedia
        && window.matchMedia("(prefers-color-scheme: dark)").matches;

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem(storageKey);
    } catch (_) {
        // Storage may be unavailable.
    }

    root.dataset.theme = savedTheme || (systemDark ? "dark" : "light");

    function updateThemeButton() {
        if (!toggle || !label) return;

        const dark = root.dataset.theme === "dark";

        toggle.setAttribute("aria-pressed", String(dark));
        toggle.setAttribute(
            "aria-label",
            dark ? "Switch to light theme" : "Switch to dark theme"
        );
        label.textContent = dark ? "Light" : "Dark";
    }

    updateThemeButton();

    toggle?.addEventListener("click", () => {
        root.dataset.theme =
            root.dataset.theme === "dark" ? "light" : "dark";

        try {
            localStorage.setItem(storageKey, root.dataset.theme);
        } catch (_) {
            // Theme still works for the current page.
        }

        updateThemeButton();
    });

    // Copy API endpoint
    const copyButton = document.querySelector(".copy-button");
    const toast = document.querySelector(".toast");

    copyButton?.addEventListener("click", async () => {
        const value = copyButton.dataset.copy;
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);
            copyButton.textContent = "Copied";

            if (toast) toast.textContent = "Endpoint copied to clipboard";
        } catch (_) {
            copyButton.textContent = "Select endpoint";

            if (toast) toast.textContent = value;
        }

        toast?.classList.add("toast-visible");

        window.setTimeout(
            () => toast?.classList.remove("toast-visible"),
            2200
        );

        window.setTimeout(() => {
            copyButton.textContent = "Copy endpoint";
        }, 2200);
    });

    // Interactive dictionary demo
    const form = document.getElementById("portfolio-lookup-form");

    if (!form) return;

    const input = document.getElementById("portfolio-word-input");
    const result = document.getElementById("portfolio-try-result");
    const status = document.getElementById("portfolio-result-status");
    const output = document.getElementById("portfolio-result-json");
    const resultCopyButton = document.getElementById("portfolio-copy-result");
    const submitButton = form.querySelector('[type="submit"]');

    const apiBase = "https://api.suvankar.cc";
    let latestJson = "";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const word = input.value.trim();

        if (!word || !/^[A-Za-z -]+$/.test(word)) {
            input.reportValidity();
            return;
        }

        result.hidden = false;
        status.textContent = "Requesting…";
        output.textContent = "Fetching response from the API...";
        latestJson = "";
        submitButton.disabled = true;

        try {
            const url =
                `${apiBase}/dictionaryapi/v1/definitions/en/` +
                encodeURIComponent(word)
                + `?compact=true`;

            const response = await fetch(url, {
                headers: { Accept: "application/json" }
            });

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch (_) {
                data = { message: text || "Empty response" };
            }

            latestJson = JSON.stringify(data, null, 2);
            output.textContent = latestJson;
            status.textContent =
                `HTTP ${response.status} · ${response.statusText || "Response"}`;
        } catch (_) {
            output.textContent =
                "Unable to reach the API. Check your connection or try again later.";
            status.textContent = "Request failed";
        } finally {
            submitButton.disabled = false;
        }
    });

    resultCopyButton?.addEventListener("click", async () => {
        if (!latestJson) return;

        try {
            await navigator.clipboard.writeText(latestJson);
            resultCopyButton.textContent = "Copied";

            window.setTimeout(() => {
                resultCopyButton.textContent = "Copy JSON";
            }, 1500);
        } catch (_) {
            resultCopyButton.textContent = "Copy failed";
        }
    });
})();
