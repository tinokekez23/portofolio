import { esc } from "./util.mjs";

// Absolute URL of a page; `path` is relative to the language root ("" or "projekti/arthur/").
export const pageUrl = (P, lang, path = "") => `${P.siteUrl}/${lang === "en" ? "en/" : ""}${path}`;

// <head> for every page. The stylesheet is small, so it is inlined: one request fewer
// before the first paint.
export function head(ctx, { title, description, path = "", css, jsonld, themeColor, themeColorDark, fonts = [], shareImage, shareAlt }) {
  const { P, t, lang } = ctx;
  const url = (l) => pageUrl(P, l, path);
  // A page may bring its own share image (already localised); otherwise the profile's is used.
  const share = shareImage
    ? { ...shareImage, src: `${P.siteUrl}/${shareImage.src}`, alt: shareAlt }
    : P.shareImage && { ...P.shareImage, src: `${P.siteUrl}/${t(P.shareImage.src)}`, alt: `${P.name} ${t(P.headline)}` };
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url(lang)}">
${!path && P.googleVerification ? `<meta name="google-site-verification" content="${esc(P.googleVerification)}">` : ""}
<link rel="alternate" hreflang="hr" href="${url("hr")}">
<link rel="alternate" hreflang="en" href="${url("en")}">
<link rel="alternate" hreflang="x-default" href="${url("hr")}">
<meta name="theme-color" content="${themeColor}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${themeColorDark}" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${path ? "article" : "profile"}">
<meta property="og:site_name" content="${esc(P.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url(lang)}">
<meta property="og:locale" content="${lang === "hr" ? "hr_HR" : "en_GB"}">
<meta property="og:locale:alternate" content="${lang === "hr" ? "en_GB" : "hr_HR"}">
${path ? "" : `<meta property="profile:first_name" content="${esc(P.firstName)}">
<meta property="profile:last_name" content="${esc(P.name.slice(P.firstName.length).trim())}">`}
${share ? `<meta property="og:image" content="${share.src}">
<meta property="og:image:width" content="${share.width}">
<meta property="og:image:height" content="${share.height}">
<meta property="og:image:alt" content="${esc(share.alt)}">
<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
${fonts.map((f) => `<link rel="preload" href="/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join("\n")}
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(jsonld).replaceAll("<", "\\u003c")}</script>
</head>`;
}

// Schema.org entities shared by all pages, referenced by @id.
export function entities(ctx) {
  const { P, t } = ctx;
  return {
    website: { "@type": "WebSite", "@id": `${P.siteUrl}/#website`, url: `${P.siteUrl}/`, name: P.name, inLanguage: ["hr", "en"] },
    person: {
      "@type": "Person",
      "@id": `${P.siteUrl}/#person`,
      name: P.name,
      url: `${P.siteUrl}/`,
      description: t(P.role),
      email: `mailto:${P.email}`,
      affiliation: { "@type": "CollegeOrUniversity", name: "Prirodoslovno-matematički fakultet u Splitu" },
      address: { "@type": "PostalAddress", addressLocality: "Sinj", addressCountry: "HR" },
      knowsLanguage: ["hr", "en"],
      knowsAbout: P.skills.slice(0, 2).flatMap((g) => g.items.map(t)),
      ...(P.photo ? { image: `${P.siteUrl}/${P.photo}` } : {}),
      ...(P.socials.length ? { sameAs: P.socials.map((s) => s.url) } : {})
    }
  };
}

// Responsive project image. `img.src` is a base path; build ships -640 and -1200 WebP files.
export function picture(ctx, img, { sizes = "(min-width: 60rem) 40rem, 100vw", cls = "", eager = false } = {}) {
  const { t } = ctx;
  return `<img class="${cls}" src="/${img.src}-1200.webp" srcset="/${img.src}-640.webp 640w, /${img.src}-1200.webp 1200w" sizes="${sizes}" width="${img.width}" height="${img.height}" alt="${esc(t(img.alt))}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
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
<div class="cf-hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
${field("name", f.name, `<input id="cf-name" type="text" name="name" autocomplete="name" required maxlength="100" aria-describedby="cf-name-err">`)}
${field("email", f.email, `<input id="cf-email" name="email" type="email" autocomplete="email" spellcheck="false" required maxlength="200" aria-describedby="cf-email-err">`)}
${field("message", f.message, `<textarea id="cf-message" name="message" rows="6" required minlength="10" maxlength="5000" aria-describedby="cf-message-err"></textarea>`)}
<div class="cf-actions"><button class="cf-send" type="submit">${f.send}</button></div>
<p class="cf-note">${f.privacy}</p>
<p class="cf-status" role="status" aria-live="polite"></p>
</form>`;
}

export const langLink = (ctx, path = "", cls = "lang") =>
  `<a class="${cls}" href="/${ctx.lang === "hr" ? "en/" : ""}${path}" hreflang="${ctx.lang === "hr" ? "en" : "hr"}" lang="${ctx.lang === "hr" ? "en" : "hr"}">${ctx.ui.otherLangShort}<span class="sr"> (${ctx.ui.otherLangLabel})</span></a>`;

// Vercel serves its Web Analytics script here once Analytics is enabled for the project.
export const analyticsScript = (P) => (P.analytics ? '<script src="/_vercel/insights/script.js" defer></script>' : "");

// site.js comes first: it sets up the queue the analytics script reads.
export const script = (ctx, extra = []) =>
  [...["site.js", ...extra].map((s) => `<script src="/assets/${ctx.asset(s)}" defer></script>`), analyticsScript(ctx.P)].filter(Boolean).join("\n");
