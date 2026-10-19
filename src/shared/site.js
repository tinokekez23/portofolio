// Small progressive enhancements. Every page works without this file.
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Mobile menu. The toggle is a link to #nav so CSS :target opens it without JS;
     here it becomes a real button with aria-expanded. */
  const menuBtn = $("[data-menu-button]");
  const menu = menuBtn && document.getElementById(menuBtn.getAttribute("aria-controls"));
  if (menuBtn && menu) {
    menuBtn.setAttribute("role", "button");
    menuBtn.setAttribute("aria-expanded", "false");
    const set = (open) => {
      menuBtn.setAttribute("aria-expanded", String(open));
      menu.toggleAttribute("data-open", open);
    };
    menuBtn.addEventListener("click", (e) => { e.preventDefault(); set(menuBtn.getAttribute("aria-expanded") !== "true"); });
    menuBtn.addEventListener("keydown", (e) => { if (e.key === " ") { e.preventDefault(); menuBtn.click(); } });
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") { set(false); menuBtn.focus(); }
    });
  }

  /* Photos (header circle, guitar photo) open larger in a dialog; without JS the
     link opens the image itself. Closing fades out before the dialog goes away. */
  const photos = $$("[data-photo]");
  if (photos.length && window.HTMLDialogElement) {
    const dlg = document.createElement("dialog");
    dlg.className = "photo-dlg";
    const close = document.documentElement.lang === "en" ? "Close" : "Zatvori";
    dlg.innerHTML = `<img src="" alt=""><button type="button">${close}</button>`;
    document.body.append(dlg);
    const big = $("img", dlg);
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    photos.forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const img = $("img", a);
      big.src = a.getAttribute("href");
      dlg.setAttribute("aria-label", img.alt);
      dlg.classList.toggle("is-wide", a.dataset.photo === "wide");
      dlg.classList.remove("is-closing");
      dlg.showModal();
    }));
    const shut = () => {
      if (still.matches) return dlg.close();
      dlg.classList.add("is-closing");
      setTimeout(() => { dlg.close(); dlg.classList.remove("is-closing"); }, 220);
    };
    dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("button")) shut(); });
  }

  /* Current section in the navigation */
  const links = $$("[data-nav] a[href^='#']");
  if (links.length && "IntersectionObserver" in window) {
    const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute("aria-current"));
        byId.get(en.target.id)?.setAttribute("aria-current", "true");
      }
    }, { rootMargin: "-40% 0px -55% 0px" });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* Header gets a hairline once the page is scrolled */
  const bar = $(".bar");
  if (bar) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { bar.toggleAttribute("data-scrolled", scrollY > 8); ticking = false; });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Reveal on scroll. Only blocks that start below the fold are hidden, so the
     first screen never blinks; the CSS decides whether anything actually moves. */
  const reveal = $$(".sec > h2, .prose > p, .about-photo, .job, .vol, .two > div, .facts-list > li, .skills > div, .proj, .contact-side, .cf, .quote, .case-body > section");
  if (reveal.length && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Read every position before changing anything, so the browser lays the page out once.
    const below = reveal.filter((el) => el.getBoundingClientRect().top >= innerHeight);
    const rio = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        en.target.dataset.reveal = "in";
        rio.unobserve(en.target);
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    const seen = new Map();
    below.forEach((el) => {
      const i = seen.get(el.parentElement) || 0;
      seen.set(el.parentElement, i + 1);
      el.style.setProperty("--i", Math.min(i, 4));
      el.dataset.reveal = "";
      rio.observe(el);
    });
    // Jumping to an anchor (#kontakt) must never land on invisible content.
    addEventListener("hashchange", () => {
      const t = location.hash && document.getElementById(location.hash.slice(1));
      if (t) $$("[data-reveal='']", t).concat(t.matches("[data-reveal='']") ? [t] : []).forEach((el) => { el.dataset.reveal = "in"; });
    });
  }

  /* Project clips play only while on screen, like a GIF but much lighter.
     With reduced motion they stay paused on the poster, with normal controls. */
  const clips = $$("video[data-autoplay]");
  if (clips.length && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const vio = new IntersectionObserver((entries) => {
      for (const en of entries) {
        const v = en.target;
        if (en.isIntersecting && !v.dataset.paused) v.play().catch(() => { v.controls = true; });
        else v.pause();
      }
    }, { threshold: 0.35 });
    clips.forEach((v) => {
      v.controls = false;
      v.preload = "auto";
      // Click to pause and resume; the choice sticks while scrolling.
      const toggle = () => {
        if (v.paused) { delete v.dataset.paused; v.play(); } else { v.dataset.paused = "1"; v.pause(); }
      };
      v.tabIndex = 0;
      v.addEventListener("click", toggle);
      v.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); } });
      vio.observe(v);
    });
  }

  /* Copy email address */
  $$("[data-copy]").forEach((btn) => {
    const label = btn.textContent;
    btn.hidden = !navigator.clipboard;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = btn.dataset.copied;
        setTimeout(() => { btn.textContent = label; }, 2000);
      } catch { /* clipboard blocked: the address is visible next to the button */ }
    });
  });

  /* Visits are counted by Vercel Web Analytics (no cookies) when its script is on the
     page. A PDF or the game can't run that script, so opening one is counted from its
     link instead, as a view of that file. */
  if ($('script[src^="/_vercel/insights/"]')) {
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-count]");
      if (a && a.origin === location.origin) window.va("pageview", { route: a.pathname, path: a.pathname });
    });
  }

  /* Contact form */
  const form = $("[data-contact]");
  if (!form) return;
  const m = JSON.parse(form.dataset.msgs);
  const status = $(".cf-status", form);
  const button = $(".cf-send", form);
  const fill = (s, vals) => s.replace(/\{(\w+)\}/g, (_, k) => vals[k] ?? "");
  form.elements.t.value = String(Date.now());

  const rules = {
    name: (v) => v.length >= 2 || m.errName,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || m.errEmail,
    message: (v) => v.length >= 10 || m.errMessage
  };
  const showError = (name, msg) => {
    const input = form.elements[name];
    input.setAttribute("aria-invalid", String(Boolean(msg)));
    $(`#cf-${name}-err`, form).textContent = msg || "";
  };
  const validate = (name) => {
    const r = rules[name](form.elements[name].value.trim());
    showError(name, r === true ? "" : r);
    return r === true;
  };
  // Validate on blur only after the first submit attempt, so people aren't scolded mid-typing.
  let tried = false;
  Object.keys(rules).forEach((n) => form.elements[n].addEventListener("input", () => { if (tried) validate(n); }));

  const setStatus = (text, kind, html) => {
    status.dataset.kind = kind || "";
    if (html) status.innerHTML = html; else status.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    tried = true;
    const bad = Object.keys(rules).filter((n) => !validate(n));
    if (bad.length) { form.elements[bad[0]].focus(); return; }

    const data = Object.fromEntries(new FormData(form));
    button.disabled = true;
    setStatus(m.sending, "busy");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus(fill(m.sent, { email: data.email.trim() }), "ok");
        form.reset();
        form.elements.t.value = String(Date.now());
        tried = false;
      } else if (res.status === 422 && body.errors) {
        for (const [n, code] of Object.entries(body.errors)) showError(n, m["err" + n[0].toUpperCase() + n.slice(1)] || code);
        setStatus("", "");
        form.elements[Object.keys(body.errors)[0]]?.focus();
      } else if (res.status === 429) {
        setStatus(m.errLimit, "err");
      } else {
        throw new Error(body.error || res.status);
      }
    } catch {
      // Email service not configured or unreachable: hand over to the visitor's mail app.
      const href = `mailto:${m.email}?subject=${encodeURIComponent("Portfolio: " + data.name)}&body=${encodeURIComponent(data.message)}`;
      const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
      setStatus("", "err", `${esc(fill(m.errOffline, { email: m.email }))} <a href="${esc(href)}">${esc(m.openMail)}</a>`);
    } finally {
      button.disabled = false;
    }
  });
})();
