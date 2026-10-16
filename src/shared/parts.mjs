import { esc } from "./util.mjs";

// <head> shared by every design. `css` is inlined: the whole stylesheet is small,
// so inlining saves a render-blocking request on a one-page site.
export function head(ctx, { css, fonts = [], themeColor, themeColorDark, favicon, extra = "" }) {
  const { P, t, lang, root, page } = ctx;
  const title = `${P.name}, ${t(P.role).charAt(0).toLowerCase()}${t(P.role).slice(1)}`;
  const desc = t(P.description);
  const url = (l) => `${P.siteUrl}/${l === "en" ? "en/" : ""}`;
  const share = P.shareImage && { ...P.shareImage, src: `${P.siteUrl}/${t(P.shareImage.src)}`, alt: `${P.name} ${t(P.headline)}` };
  const skills = P.skills.slice(0, 2).flatMap((g) => g.items.map(t));
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url(lang)}#page`,
        url: url(lang),
        name: title,
        description: desc,
        inLanguage: lang,
        isPartOf: { "@id": `${P.siteUrl}/#website` },
        mainEntity: { "@id": `${P.siteUrl}/#person` },
        ...(share ? { primaryImageOfPage: share.src } : {})
      },
      { "@type": "WebSite", "@id": `${P.siteUrl}/#website`, url: `${P.siteUrl}/`, name: P.name, inLanguage: ["hr", "en"] },
      {
        "@type": "Person",
        "@id": `${P.siteUrl}/#person`,
        name: P.name,
        url: `${P.siteUrl}/`,
        description: t(P.role),
        email: `mailto:${P.email}`,
        affiliation: { "@type": "CollegeOrUniversity", name: "Prirodoslovno-matematički fakultet u Splitu" },
        address: { "@type": "PostalAddress", addressLocality: "Sinj", addressCountry: "HR" },
        knowsLanguage: ["hr", "en"],
        knowsAbout: skills,
        ...(P.photo ? { image: `${P.siteUrl}/${P.photo}` } : {}),
        ...(P.socials.length ? { sameAs: P.socials.map((s) => s.url) } : {})
      }
    ]
  };
  // Previews of other designs are noindex and keep the favicon inline; the live
  // pages point at /favicon.svg, because search engines only show a favicon with a real URL.
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
<meta property="og:site_name" content="${esc(P.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url(lang)}">
<meta property="og:locale" content="${lang === "hr" ? "hr_HR" : "en_GB"}">
<meta property="og:locale:alternate" content="${lang === "hr" ? "en_GB" : "hr_HR"}">
<meta property="profile:first_name" content="${esc(P.firstName)}">
<meta property="profile:last_name" content="${esc(P.name.slice(P.firstName.length).trim())}">
${share ? `<meta property="og:image" content="${share.src}">
<meta property="og:image:width" content="${share.width}">
<meta property="og:image:height" content="${share.height}">
<meta property="og:image:alt" content="${esc(share.alt)}">
<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
${page.preview ? `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}">` : `<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">`}
${fonts.map((f) => `<link rel="preload" href="${root}fonts/${f}" as="font" type="font/woff2" crossorigin>`).join("\n")}
${extra}<style>${css.replaceAll("url(fonts/", `url(${root}fonts/`)}</style>
${page.preview ? "" : `<script type="application/ld+json">${JSON.stringify(graph).replaceAll("<", "\\u003c")}</script>`}
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
<div class="cf-hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
${field("name", f.name, `<input id="cf-name" type="text" name="name" autocomplete="name" required maxlength="100" aria-describedby="cf-name-err">`)}
${field("email", f.email, `<input id="cf-email" name="email" type="email" autocomplete="email" spellcheck="false" required maxlength="200" aria-describedby="cf-email-err">`)}
${field("message", f.message, `<textarea id="cf-message" name="message" rows="6" required minlength="10" maxlength="5000" aria-describedby="cf-message-err"></textarea>`)}
<div class="cf-actions"><button class="cf-send" type="submit">${f.send}</button></div>
<p class="cf-status" role="status" aria-live="polite"></p>
</form>`;
}

export const langLink = (ctx, cls = "") =>
  `<a class="${cls}" href="${ctx.page.altHref}" hreflang="${ctx.lang === "hr" ? "en" : "hr"}" lang="${ctx.lang === "hr" ? "en" : "hr"}">${ctx.ui.otherLangShort}<span class="sr"> (${ctx.ui.otherLangLabel})</span></a>`;

export const script = (ctx, extra = []) =>
  ["site.js", ...extra].map((s) => `<script src="${ctx.root}assets/${ctx.asset(s)}" defer></script>`).join("\n");
