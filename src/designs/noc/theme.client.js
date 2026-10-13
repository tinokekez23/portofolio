// Runs in <head> before the page paints, so a saved light/dark choice never flashes.
try { const t = localStorage.getItem("theme"); if (t === "light" || t === "dark") document.documentElement.dataset.theme = t; } catch { /* storage blocked */ }
