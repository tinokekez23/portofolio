// Home page: one plain sentence about who Tino is, then projects first, because they
// are what an employer in IT looks for.
import { esc } from "../shared/util.mjs";
import { head, entities, pageUrl, picture, contactForm } from "../shared/parts.mjs";
import { model } from "../shared/model.mjs";
import { header, footer, THEME_COLOR, THEME_COLOR_DARK, FONTS } from "./layout.mjs";

export function renderHome(ctx) {
  const m = model(ctx);
  const { P, ui, lang, t } = ctx;
  const projectPath = (p) => `${lang === "en" ? "/en" : ""}/projekti/${p.id}/`;

  const job = (j) => `<li class="job">
  <p class="job-when">${esc(j.range)}${j.duration ? `<span>${esc(j.duration)}</span>` : ""}</p>
  <div class="job-body">
    <div class="job-head">
      ${j.logo ? `<img class="job-logo" src="/${esc(j.logo.src)}" alt="${esc(j.logo.alt)}" width="56" height="56" loading="lazy">` : ""}
      <div><h3>${esc(j.role)}</h3><p class="job-org">${esc(j.company)}, ${esc(j.place)}</p></div>
    </div>
    ${j.points.length > 1 ? `<ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : `<p>${esc(j.points[0])}</p>`}
  </div>
</li>`;

  const vol = (v) => `<li class="vol">
  ${v.icon ? `<img class="vol-icon" src="/${esc(v.icon.src)}" alt="${esc(v.icon.alt)}" width="48" height="48" loading="lazy">` : ""}
  <div>
    <h4>${esc(v.role)}</h4>
    <p class="job-org">${esc(v.company)}, ${esc(v.place)} · ${esc(v.range)}</p>
    ${v.points.map((p) => `<p>${esc(p)}</p>`).join("")}
  </div>
</li>`;

  const project = (p) => p.planned
    ? `<li class="proj proj-planned">
  <p class="proj-status">${ui.planned}</p>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.summary)}</p>
</li>`
    : `<li class="proj">
  ${p.video ? `<figure class="proj-shot"><video poster="/${esc(p.video.poster)}" width="${p.video.width}" height="${p.video.height}" muted loop playsinline preload="none" controls data-autoplay aria-label="${esc(p.video.alt)}"><source src="/${esc(p.video.src)}.webm" type="video/webm"><source src="/${esc(p.video.src)}.mp4" type="video/mp4"></video></figure>`
    : p.image ? `<figure class="proj-shot"><a href="${projectPath(p)}" tabindex="-1">${picture(ctx, p.image, { sizes: "(min-width: 64rem) 44rem, calc(100vw - 2.5rem)" })}</a></figure>` : ""}
  <div class="proj-text">
    <h3><a href="${projectPath(p)}">${esc(p.title)}</a> <span class="proj-year">${esc(p.year)}</span></h3>
    <p>${esc(p.summary)}</p>
    <p class="proj-stack">${p.stack.map(esc).join(", ")}</p>
    <p class="proj-links"><a class="btn btn-small" href="${projectPath(p)}">${ui.projectDetails}</a>${p.links.map((l) => ` <a class="btn btn-small" href="${esc(l.url)}">${esc(l.label)}</a>`).join("")}</p>
  </div>
</li>`;

  const title = `${P.name}, ${t(P.role).charAt(0).toLowerCase()}${t(P.role).slice(1)}`;
  const description = t(P.description);
  const { website, person } = entities(ctx);
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl(P, lang)}#page`,
        url: pageUrl(P, lang),
        name: title,
        description,
        inLanguage: lang,
        isPartOf: { "@id": website["@id"] },
        mainEntity: { "@id": person["@id"] },
        ...(P.shareImage ? { primaryImageOfPage: `${P.siteUrl}/${t(P.shareImage.src)}` } : {})
      },
      website,
      person
    ]
  };

  return `<!doctype html>
<html lang="${lang}">
${head(ctx, { title, description, css: ctx.css, jsonld, themeColor: THEME_COLOR, themeColorDark: THEME_COLOR_DARK, fonts: FONTS })}
<body>
${header(ctx)}

<main id="sadrzaj">
  <section class="hero wrap" id="top" aria-labelledby="hero-h">
    <div class="hero-main">
    <h1 id="hero-h">${esc(m.name)} ${esc(m.headline)}</h1>
    <div class="hero-actions">
      <a class="btn btn-solid" href="#projekti">${ui.seeProjects}</a>
      <a class="btn" href="/${esc(m.cv)}" download>${ui.downloadCv}</a>
      ${m.availability ? `<p class="avail"><span class="avail-dot" aria-hidden="true"></span>${esc(m.availability)}</p>` : ""}
    </div>
    </div>
    <dl class="facts">
      <div><dt>${ui.location}</dt><dd>${esc(m.location)}</dd></div>
      <div><dt>${ui.study}</dt><dd>${esc(m.study)}</dd></div>
      <div><dt>${ui.languages}</dt><dd>${esc(m.languageNames)}</dd></div>
      <div><dt>${ui.email}</dt><dd><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></dd></div>
    </dl>
  </section>

  <section class="sec wrap" id="projekti" aria-labelledby="h-proj">
    <h2 id="h-proj">${ui.projects}</h2>
    <div class="sec-body"><ul class="projs">${m.projects.map(project).join("")}</ul></div>
  </section>

  <section class="sec wrap" id="o-meni" aria-labelledby="h-about">
    <h2 id="h-about">${ui.about}</h2>
    <div class="sec-body">
      <div class="prose">${m.about.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      ${m.aboutPhoto ? `<figure class="about-photo"><a class="about-shot" href="/${esc(m.aboutPhoto.src)}" data-photo="wide"><img src="/${esc(m.aboutPhoto.src)}" alt="${esc(m.aboutPhoto.alt)}" width="1200" height="900" loading="lazy" decoding="async"></a><figcaption>${esc(m.aboutPhoto.caption)}</figcaption></figure>` : ""}
    </div>
  </section>

  <section class="sec wrap" id="iskustvo" aria-labelledby="h-exp">
    <h2 id="h-exp">${ui.experience}</h2>
    <div class="sec-body">
      <ol class="jobs">${m.jobs.map(job).join("")}</ol>
      ${m.volunteering.length ? `<div class="block">
        <h3 class="sub">${ui.volunteering}</h3>
        <ul class="vols">${m.volunteering.map(vol).join("")}</ul>
      </div>` : ""}
      <div class="two">
        <div>
          <h3 class="sub">${ui.education}</h3>
          <ul class="facts-list">${m.education.map((e) => `<li${e.icon ? ` class="has-icon"` : ""}>${e.icon ? `<img class="vol-icon is-logo" src="/${esc(e.icon.src)}" alt="${esc(e.icon.alt)}" width="48" height="48" loading="lazy">` : ""}<b>${esc(e.title)}</b><span>${esc(e.school)}</span><span class="meta">${esc(e.range)}${e.note ? `, ${esc(e.note.toLowerCase())}` : ""}</span></li>`).join("")}</ul>
        </div>
        <div>
          <h3 class="sub">${ui.certificates}</h3>
          <ul class="facts-list">${m.certificates.map((c) => `<li${c.icon ? ` class="has-icon"` : ""}>${c.icon ? `<img class="vol-icon${c.icon.logo ? " is-logo" : ""}" src="/${esc(c.icon.src)}" alt="${esc(c.icon.alt)}" width="48" height="48" loading="lazy">` : ""}<b>${esc(c.title)}</b>${c.issuer ? `<span>${esc(c.issuer)}</span>` : ""}${c.year ? `<span class="meta">${esc(c.year)}</span>` : ""}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
  </section>

  <section class="sec wrap" id="vjestine" aria-labelledby="h-skills">
    <h2 id="h-skills">${ui.skills}</h2>
    <div class="sec-body">
      <dl class="skills">${m.skills.map((g) => `<div><dt>${esc(g.group)}</dt><dd>${g.items.map(esc).join(", ")}</dd></div>`).join("")}
        <div><dt>${ui.languages}</dt><dd>${m.languages.map((l) => `${esc(l.name)} (${esc(l.level)})`).join(", ")}</dd></div>
      </dl>
    </div>
  </section>

  ${m.testimonials.length ? `<section class="sec wrap" id="preporuke" aria-labelledby="h-test">
    <h2 id="h-test">${ui.testimonials}</h2>
    <div class="sec-body">${m.testimonials.map((q) => `<figure class="quote"><blockquote><p>${esc(q.quote)}</p></blockquote><figcaption>${esc(q.name)}, ${esc(q.title)}</figcaption></figure>`).join("")}</div>
  </section>` : ""}

  <section class="sec wrap contact" id="kontakt" aria-labelledby="h-contact">
    <h2 id="h-contact">${ui.contact}</h2>
    <div class="sec-body contact-grid">
      <div class="contact-side">
        <p class="lead">${ui.contactLead}</p>
        <p class="mail"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p>
        <button class="btn btn-small" type="button" data-copy="${esc(m.email)}" data-copied="${ui.copied}" hidden>${ui.copy}</button>
        ${m.phone ? `<p class="phone"><a href="tel:${esc(m.phone.replace(/\s/g, ""))}">${esc(m.phone)}</a></p>` : ""}
        ${m.socials.length ? `<ul class="socials">${m.socials.map((s) => `<li><a href="${esc(s.url)}" rel="me noopener">${esc(s.label)}</a></li>`).join("")}</ul>` : ""}
      </div>
      ${ctx.contactForm ? contactForm(ctx) : ""}
    </div>
  </section>
</main>

${footer(ctx)}
</body>
</html>`;
}
