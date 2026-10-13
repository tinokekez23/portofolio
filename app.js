(function () {
  "use strict";
  var P = window.PROFILE;
  var root = document.documentElement;
  root.classList.add("js");

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var UI = {
    hr: {
      skip: "Preskoči na sadržaj", notice: "Demo sadržaj: imena, brojke i projekti su primjeri koje treba zamijeniti.", close: "Zatvori",
      nav_about: "O meni", nav_exp: "Iskustvo", nav_skills: "Vještine", nav_projects: "Projekti", nav_contact: "Kontakt",
      cta_projects: "Pogledaj projekte", cta_cv: "Preuzmi CV", personal: "Osobni podaci",
      f_location: "Lokacija", f_study: "Studij", f_email: "E-pošta", f_phone: "Telefon", f_lang: "Jezici",
      eb_about: "Profil", h_about: "O meni", eb_exp: "Životopis", h_exp: "Radno iskustvo", h_edu: "Obrazovanje", h_cert: "Dozvole i sport",
      eb_skills: "Kompetencije", h_skills: "Vještine", skills_note: "Razina od 1 do 5, vlastita procjena.",
      h_lang: "Strani jezici", cefr_note: "Prema Zajedničkom europskom referentnom okviru (CEFR), A1 do C2.",
      eb_proj: "Odabrani radovi", h_proj: "Projekti", all: "Sve", details: "Detalji projekta →", none: "Nema projekata u ovoj kategoriji.",
      eb_test: "Preporuke", h_test: "Što kažu suradnici",
      eb_contact: "Kontakt", h_contact: "Razgovarajmo", contact_note: "Javi se za posao, suradnju ili samo pitanje. Odgovaram u roku od jednog radnog dana.",
      copy: "Kopiraj adresu", copied: "Kopirano ✓", profiles: "Profili",
      l_name: "Ime i prezime", l_email: "E-pošta", l_msg: "Poruka", send: "Pošalji poruku",
      e_name: "Upiši ime.", e_email: "Upiši ispravnu adresu e-pošte.", e_msg: "Poruka treba imati barem 10 znakova.",
      ok: "Hvala, {name}! Ovo je demo obrazac, pa poruka nije stvarno poslana.",
      to_top: "Natrag na vrh ↑", present: "danas", problem: "Problem", solution: "Rješenje", result: "Rezultat",
      native: "materinski", yr: ["god.", "god.", "god."], mo: "mj.", lvl: "razina",
      a_lang: "Switch to English", a_theme: "Promijeni temu", a_menu: "Izbornik", a_nav: "Glavna navigacija", a_filter: "Filtriraj projekte", a_personal: "Osobni podaci", a_home: "Početak"
    },
    en: {
      skip: "Skip to content", notice: "Demo content: names, figures and projects are examples to be replaced.", close: "Close",
      nav_about: "About", nav_exp: "Experience", nav_skills: "Skills", nav_projects: "Projects", nav_contact: "Contact",
      cta_projects: "View projects", cta_cv: "Download CV", personal: "Personal details",
      f_location: "Location", f_study: "Studies", f_email: "Email", f_phone: "Phone", f_lang: "Languages",
      eb_about: "Profile", h_about: "About me", eb_exp: "Résumé", h_exp: "Work experience", h_edu: "Education", h_cert: "Licences & sport",
      eb_skills: "Expertise", h_skills: "Skills", skills_note: "Level 1 to 5, self-assessed.",
      h_lang: "Languages", cefr_note: "Common European Framework of Reference (CEFR), A1 to C2.",
      eb_proj: "Selected work", h_proj: "Projects", all: "All", details: "Project details →", none: "No projects in this category.",
      eb_test: "Recommendations", h_test: "What colleagues say",
      eb_contact: "Contact", h_contact: "Let's talk", contact_note: "Get in touch about a role, a collaboration or just a question. I reply within one working day.",
      copy: "Copy address", copied: "Copied ✓", profiles: "Profiles",
      l_name: "Full name", l_email: "Email", l_msg: "Message", send: "Send message",
      e_name: "Enter your name.", e_email: "Enter a valid email address.", e_msg: "The message needs at least 10 characters.",
      ok: "Thanks, {name}! This is a demo form, so the message was not actually sent.",
      to_top: "Back to top ↑", present: "present", problem: "Problem", solution: "Solution", result: "Result",
      native: "native", yr: ["yr", "yrs", "yrs"], mo: "mo", lvl: "level",
      a_lang: "Prebaci na hrvatski", a_theme: "Toggle theme", a_menu: "Menu", a_nav: "Main navigation", a_filter: "Filter projects", a_personal: "Personal details", a_home: "Home"
    }
  };

  var lang = store.get("lang") || (root.lang === "en" ? "en" : "hr");
  var filter = "all";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function t(v) { return v && typeof v === "object" ? (v[lang] != null ? v[lang] : v.hr) : (v == null ? "" : v); }
  function u(k) { return UI[lang][k]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- dates ---------- */
  var MONTHS = { hr: ["sij", "velj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function fmtDate(s) {
    if (!s) return u("present");
    var p = s.split("-");
    return p[1] ? MONTHS[lang][+p[1] - 1] + " " + p[0] : p[0];
  }
  function duration(a, b) {
    var s = a.split("-"), e = b ? b.split("-") : null, now = new Date();
    var m = ((e ? +e[0] : now.getFullYear()) - +s[0]) * 12 + ((e ? +e[1] : now.getMonth() + 1) - +s[1]) + 1;
    var y = Math.floor(m / 12), r = m % 12, out = [];
    if (y) out.push(y + " " + u("yr")[y === 1 ? 0 : 1]);
    if (r) out.push(r + " " + u("mo"));
    return out.join(" ");
  }

  /* ---------- render ---------- */
  function renderStatic() {
    root.lang = lang;
    $$("[data-i18n]").forEach(function (el) { el.textContent = u(el.dataset.i18n); });
    $$("[data-i18n-label]").forEach(function (el) { el.setAttribute("aria-label", u(el.dataset.i18nLabel)); });
    $$("[data-bind]").forEach(function (el) { el.textContent = t(P[el.dataset.bind]); });
    $("#langBtn").textContent = lang === "hr" ? "EN" : "HR";
    $("#langBtn").setAttribute("aria-label", u("a_lang"));
    $("#themeBtn").setAttribute("aria-label", u("a_theme"));
    $("#menuBtn").setAttribute("aria-label", u("a_menu"));
    $("#nav").setAttribute("aria-label", u("a_nav"));
    $(".idcard").setAttribute("aria-label", u("a_personal"));
    $(".brand").setAttribute("aria-label", u("a_home"));
    $(".status").classList.toggle("off", !P.available);
    $("#mailLink").href = "mailto:" + P.email;
    $("#cvLink").href = P.cvFile;
    $("#langSummary").textContent = P.languages.map(function (l) { return t(l.name); }).join(", ");
    $("#year").textContent = new Date().getFullYear();
    document.title = P.name + " · " + t(P.role);
  }

  function renderSections() {
    $("#stats").innerHTML = P.facts.map(function (f) {
      return "<li><b>" + esc(f.value) + "</b><span>" + esc(t(f.label)) + "</span></li>";
    }).join("");

    $("#about").innerHTML = P.about.map(function (p) { return "<p>" + esc(t(p)) + "</p>"; }).join("");
    $("#values").innerHTML = P.values.map(function (v) {
      return "<li><b>" + esc(t(v.title)) + "</b><span>" + esc(t(v.text)) + "</span></li>";
    }).join("");

    $("#experience").innerHTML = P.experience.map(function (j) {
      return '<li class="job reveal">' +
        '<p class="job-when"><span>' + fmtDate(j.start) + " –</span><span" + (j.end ? "" : ' class="now"') + ">" + fmtDate(j.end) + '</span><span class="job-dur">' + duration(j.start, j.end) + "</span></p>" +
        "<div><h3>" + esc(t(j.role)) + '</h3><p class="job-co"><b>' + esc(t(j.company)) + "</b> · " + esc(t(j.place)) + "</p>" +
        "<ul>" + j.points.map(function (p) { return "<li>" + esc(t(p)) + "</li>"; }).join("") + "</ul>" +
        '<div class="tags">' + j.tags.map(function (g) { return '<span class="tag">' + esc(t(g)) + "</span>"; }).join("") + "</div></div></li>";
    }).join("");

    $("#education").innerHTML = P.education.map(function (e) {
      return "<li><b>" + esc(t(e.title)) + "</b><span>" + esc(t(e.school)) + '</span><span class="meta">' + esc(e.start) + " – " + esc(t(e.end)) + "</span>" +
        (e.note ? '<span class="note">' + esc(t(e.note)) + "</span>" : "") + "</li>";
    }).join("");
    $("#certificates").innerHTML = P.certificates.map(function (c) {
      return "<li><b>" + esc(t(c.title)) + "</b><span>" + esc(t(c.issuer)) + "</span>" + (c.year ? '<span class="meta">' + esc(c.year) + "</span>" : "") + "</li>";
    }).join("");

    $("#skills").innerHTML = P.skills.map(function (g) {
      return '<div class="skill-group reveal"><h3>' + esc(t(g.group)) + "</h3>" + g.items.map(function (s) {
        var bars = ""; for (var i = 1; i <= 5; i++) bars += "<i" + (i <= s[1] ? ' class="on"' : "") + "></i>";
        return '<div class="skill"><span>' + esc(t(s[0])) + '</span><span class="meter" role="img" aria-label="' + u("lvl") + " " + s[1] + '/5">' + bars + "</span></div>";
      }).join("") + "</div>";
    }).join("");

    var CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
    $("#languages").innerHTML = P.languages.map(function (l) {
      var n = l.level === "native" ? 6 : CEFR.indexOf(l.level) + 1, cells = "";
      for (var i = 1; i <= 6; i++) cells += "<i" + (i <= n ? ' class="on"' : "") + "></i>";
      var label = l.level === "native" ? u("native") : l.level;
      return '<li class="lang"><span>' + esc(t(l.name)) + '</span><span class="cefr" role="img" aria-label="' + esc(label) + '">' + cells + '</span><span class="lang-lvl">' + esc(label) + "</span></li>";
    }).join("");

    var cats = Object.keys(P.projectCategories);
    $("#filters").setAttribute("aria-label", u("a_filter"));
    $("#filters").innerHTML = ["all"].concat(cats).map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (filter === c) + '">' + esc(c === "all" ? u("all") : t(P.projectCategories[c])) + "</button>";
    }).join("");
    renderProjects();

    $("#testimonials").innerHTML = P.testimonials.map(function (q) {
      return '<figure class="quote reveal"><blockquote>' + esc(t(q.quote)) + "</blockquote><figcaption><b>" + esc(q.name) + "</b>" + esc(t(q.title)) + "</figcaption></figure>";
    }).join("");

    $("#socials").innerHTML = P.socials.map(function (s) {
      return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + " ↗</a></li>";
    }).join("");
  }

  function cover(p) {
    return '<div class="cover" style="--h:' + (+p.hue || 220) + '" aria-hidden="true"><span class="cover-title">' + esc(t(p.title)) + '</span><div class="cover-ui"><i></i><i></i><i></i></div></div>';
  }

  function renderProjects() {
    var list = P.projects.filter(function (p) { return filter === "all" || p.category === filter; });
    $("#projects").innerHTML = list.length ? list.map(function (p) {
      var i = P.projects.indexOf(p);
      return '<li class="project"><button type="button" data-project="' + i + '">' + cover(p) +
        '<span class="p-meta"><span>' + esc(t(P.projectCategories[p.category])) + "</span><span>" + esc(p.year) + "</span></span>" +
        '<span class="p-title">' + esc(t(p.title)) + '</span><span class="p-sum">' + esc(t(p.summary)) + '</span><span class="p-more">' + u("details") + "</span></button></li>";
    }).join("") : '<li class="empty">' + u("none") + "</li>";
  }

  /* ---------- modal ---------- */
  var modal = $("#projectModal"), lastFocus = null;
  function openProject(i) {
    var p = P.projects[i];
    lastFocus = document.activeElement;
    $("#modalBody").innerHTML =
      '<button type="button" class="modal-close" id="modalClose" aria-label="' + u("close") + '">×</button>' + cover(p) +
      '<div><p class="eyebrow">' + esc(t(P.projectCategories[p.category])) + " · " + esc(p.year) + '</p><h2 id="modalTitle">' + esc(t(p.title)) + '</h2></div><p>' + esc(t(p.summary)) + "</p>" +
      '<div class="cs"><div><p class="eyebrow">' + u("problem") + "</p><p>" + esc(t(p.problem)) + '</p></div><div><p class="eyebrow">' + u("solution") + "</p><p>" + esc(t(p.solution)) + '</p></div><div><p class="eyebrow">' + u("result") + "</p><p>" + esc(t(p.result)) + "</p></div></div>" +
      '<div class="tags">' + p.stack.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</div>" +
      '<div class="modal-links">' + (p.links || []).map(function (l) { return '<a class="btn btn-ghost btn-sm" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(t(l.label)) + " ↗</a>"; }).join("") + "</div>";
    $(".modal-in").style.position = "relative";
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
    $("#modalClose").focus();
  }
  function closeModal() { if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.id === "modalClose") closeModal(); });
  modal.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });

  /* ---------- interactions ---------- */
  document.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (chip) {
      filter = chip.dataset.cat;
      $$(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      renderProjects();
      return;
    }
    var pb = e.target.closest("[data-project]");
    if (pb) openProject(+pb.dataset.project);
  });

  $("#langBtn").addEventListener("click", function () {
    lang = lang === "hr" ? "en" : "hr";
    store.set("lang", lang);
    render();
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  });

  function currentTheme() {
    return root.dataset.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  var savedTheme = store.get("theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  $("#themeBtn").addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    store.set("theme", next);
  });

  var menuBtn = $("#menuBtn"), nav = $("#nav");
  function setMenu(open) { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", String(open)); }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  if (P.showPlaceholderNotice && store.get("noticeClosed") !== "1") $("#notice").hidden = false;
  $("#noticeClose").addEventListener("click", function () { $("#notice").hidden = true; store.set("noticeClosed", "1"); });

  $("#copyBtn").addEventListener("click", function () {
    var btn = this;
    function done() { btn.textContent = u("copied"); setTimeout(function () { btn.textContent = u("copy"); }, 1800); }
    function fallback() {
      var r = document.createRange(); r.selectNodeContents($("#mailLink"));
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(P.email).then(done, fallback);
    else fallback();
  });

  /* ---------- form ---------- */
  var form = $("#contactForm");
  function check(id, ok, msgKey) {
    var el = $("#" + id), err = $("#" + id + "-err");
    el.setAttribute("aria-invalid", String(!ok));
    err.textContent = ok ? "" : u(msgKey);
    return ok;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#cf-name").value.trim(), mail = $("#cf-email").value.trim(), msg = $("#cf-msg").value.trim();
    var ok = [
      check("cf-name", name.length > 1, "e_name"),
      check("cf-email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail), "e_email"),
      check("cf-msg", msg.length >= 10, "e_msg")
    ];
    var firstBad = ["cf-name", "cf-email", "cf-msg"][ok.indexOf(false)];
    if (firstBad) { $("#" + firstBad).focus(); return; }
    var okEl = $("#formOk");
    okEl.textContent = u("ok").replace("{name}", name.split(" ")[0]);
    okEl.hidden = false;
    form.reset();
  });

  /* ---------- scroll: header state, scroll-spy, reveal ---------- */
  var topbar = $(".topbar");
  function onScroll() { topbar.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    var links = $$(".nav a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  function observeReveal() {
    var els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) {
      // anything already on screen is shown straight away
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in"); else io.observe(el);
    });
    // safety net: never leave content hidden
    setTimeout(function () { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }, 2500);
  }

  function toggleOptional() {
    $("#preporuke").hidden = !P.testimonials.length;
    $$('[data-bind="phone"]').forEach(function (el) { (el.closest("div") && el.closest(".facts-list") ? el.closest("div") : el).hidden = !P.phone; });
    $('#kontakt [data-i18n="f_phone"]').hidden = !P.phone;
    $('#kontakt [data-i18n="profiles"]').hidden = !P.socials.length;
    $("#socials").hidden = !P.socials.length;
  }

  function render() { renderStatic(); renderSections(); toggleOptional(); }
  render();
  observeReveal();
})();
