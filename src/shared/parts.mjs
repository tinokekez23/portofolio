import { esc } from "./util.mjs";

// <head> shared by every design. `css` is inlined: the whole stylesheet is small,
// so inlining saves a render-blocking request on a one-page site.
export function head(ctx, { css, fonts = [], themeColor, themeColorDark, favicon, extra = "" }) {
  const { P, t, lang, root, page } = ctx;
  const title = `${P.name}, ${t(P.role).charAt(0).toLowerCase()}${t(P.role).slice(1)}`;
  const desc = t(P.description);
  const url = (l) => `${P.siteUrl}/${l === "en" ? "en/" : ""}`;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: P.name,
    jobTitle: t(P.role),
    email: `mailto:${P.email}`,
    url: url(lang),
    alumniOf: { "@type": "CollegeOrUniversity", name: "Prirodoslovno-matematički fakultet Split" },
    address: { "@type": "PostalAddress", addressLocality: "Sinj", addressCountry: "HR" },
    knowsLanguage: ["hr", "en"],
    sameAs: P.socials.map((s) => s.url)
  };
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${page.preview ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url(lang)}">
<link rel="alternate" hreflang="hr" href="${url("hr")}">
<link rel="alternate" hreflang="en" href="${url("en")}">
<link rel="alternate" hreflang="x-default" href="${url("hr")}">`}
${themeColorDark ? `<meta name="theme-color" content="${themeColor}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${themeColorDark}" media="(prefers-color-scheme: dark)">` : `<meta name="theme-color" content="${themeColor}">`}
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url(lang)}">
<meta property="og:locale" content="${lang === "hr" ? "hr_HR" : "en_GB"}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}">
<link rel="manifest" href="${root}site.webmanifest">
${fonts.map((f) => `<link rel="preload" href="${root}fonts/${f}" as="font" type="font/woff2" crossorigin>`).join("\n")}
${extra}<style>${css.replaceAll("url(fonts/", `url(${root}fonts/`)}</style>
<script type="application/ld+json">${JSON.stringify(person)}</script>
</head>`;
}

// Responsive project image. `img.src` is a base path; build ships -640 and -1200 WebP files.
export function picture(ctx, img, { sizes = "(min-width: 60rem) 40rem, 100vw", cls = "" } = {}) {
  const { root, t } = ctx;
  return `<img class="${cls}" src="${root}${img.src}-1200.webp" srcset="${root}${img.src}-640.webp 640w, ${root}${img.src}-1200.webp 1200w" sizes="${sizes}" width="${img.width}" height="${img.height}" alt="${esc(t(img.alt))}" loading="lazy" decoding="async">`;
}

// Contact form. Works without JavaScript (plain POST to the API, which answers with
// a short HTML page); site.js upgrades it to an in-page request with inline errors.
export function contactForm(ctx) {
  const { ui, lang, P } = ctx;
  const f = ui.form;
  const msgs = { sending: f.sending, sent: f.sent, errName: f.errName, errEmail: f.errEmail, errMessage: f.errMessage, errLimit: f.errLimit, errOffline: f.errOffline, openMail: f.openMail, email: P.email };
  const field = (id, label, input) => `<div class="cf-field">
  <label for="cf-${id}">${label}</label>
  ${input}
  <p class="cf-err" id="cf-${id}-err"></p>
</div>`;
  return `<form class="cf" method="post" action="/api/contact" data-contact data-msgs="${esc(JSON.stringify(msgs))}" novalidate>
<input type="hidden" name="lang" value="${lang}">
<input type="hidden" name="t" value="">
<div class="cf-hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
${field("name", f.name, `<input id="cf-name" name="name" autocomplete="name" required maxlength="100" aria-describedby="cf-name-err">`)}
${field("email", f.email, `<input id="cf-email" name="email" type="email" autocomplete="email" spellcheck="false" required maxlength="200" aria-describedby="cf-email-err">`)}
${field("message", f.message, `<textarea id="cf-message" name="message" rows="6" required minlength="10" maxlength="5000" aria-describedby="cf-message-err"></textarea>`)}
<div class="cf-actions"><button class="cf-send" type="submit">${f.send}</button></div>
<p class="cf-status" role="status" aria-live="polite"></p>
</form>`;
}

export const langLink = (ctx, cls = "") =>
  `<a class="${cls}" href="${ctx.page.altHref}" hreflang="${ctx.lang === "hr" ? "en" : "hr"}" lang="${ctx.lang === "hr" ? "en" : "hr"}">${ctx.ui.otherLangShort}<span class="sr"> (${ctx.ui.otherLangLabel})</span></a>`;

export const script = (ctx, extra = []) =>
  ["site.js", ...extra].map((s) => `<script src="${ctx.root}assets/${s}" defer></script>`).join("\n");
