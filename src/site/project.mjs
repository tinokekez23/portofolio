// One page per project (/projekti/<id>/ and /en/projekti/<id>/): the full write-up that
// the home page only summarises.
import { esc } from "../shared/util.mjs";
import { head, entities, pageUrl, picture } from "../shared/parts.mjs";
import { header, footer, THEME_COLOR, THEME_COLOR_DARK, FONTS } from "./layout.mjs";

export function renderProject(ctx, p, next) {
  const { P, ui, lang } = ctx;
  const home = lang === "en" ? "/en/" : "/";
  const path = `projekti/${p.id}/`;
  const url = pageUrl(P, lang, path);
  const title = `${p.title} · ${P.name}`;
  const description = p.summary;
  const { person } = entities(ctx);
  const image = p.image ? `${P.siteUrl}/${p.image.src}-1200.webp` : null;

  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: p.title,
        description,
        url,
        inLanguage: lang,
        dateCreated: p.year,
        keywords: p.stack.join(", "),
        creator: { "@id": person["@id"] },
        ...(image ? { image } : {})
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: pageUrl(P, lang) },
          { "@type": "ListItem", position: 2, name: ui.projects, item: `${pageUrl(P, lang)}#projekti` },
          { "@type": "ListItem", position: 3, name: p.title, item: url }
        ]
      },
      person
    ]
  };

  const media = p.video
    ? `<figure class="case-media"><video poster="/${esc(p.video.poster)}" width="${p.video.width}" height="${p.video.height}" muted loop playsinline preload="none" controls data-autoplay aria-label="${esc(p.video.alt)}"><source src="/${esc(p.video.src)}.webm" type="video/webm"><source src="/${esc(p.video.src)}.mp4" type="video/mp4"></video></figure>`
    : p.image ? `<figure class="case-media">${picture(ctx, p.image, { sizes: "(min-width: 64rem) 60rem, calc(100vw - 2.5rem)", eager: true })}</figure>` : "";

  return `<!doctype html>
<html lang="${lang}">
${head(ctx, { title, description, path, css: ctx.css, jsonld, themeColor: THEME_COLOR, themeColorDark: THEME_COLOR_DARK, fonts: FONTS })}
<body>
${header(ctx, { home, path })}

<main id="sadrzaj" class="case wrap">
  <nav class="crumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="${home}">${ui.home}</a></li>
      <li><a href="${home}#projekti">${ui.projects}</a></li>
      <li aria-current="page">${esc(p.title)}</li>
    </ol>
  </nav>

  <header class="case-head" id="top">
    <p class="case-kicker">${ui.projectOf} · ${esc(p.year)}</p>
    <h1>${esc(p.title)}</h1>
    <p class="case-lead">${esc(p.summary)}</p>
    ${p.links.length ? `<p class="case-actions">${p.links.map((l, i) => `<a class="btn${i ? "" : " btn-solid"}" href="${esc(l.url)}">${esc(l.label)}</a>`).join(" ")}</p>` : ""}
  </header>

  ${media}

  <div class="case-body">
    <section aria-labelledby="h-problem">
      <h2 id="h-problem">${ui.problem}</h2>
      <p>${esc(p.problem)}</p>
    </section>
    <section aria-labelledby="h-solution">
      <h2 id="h-solution">${ui.solution}</h2>
      <p>${esc(p.solution)}</p>
    </section>
    <section aria-labelledby="h-result">
      <h2 id="h-result">${ui.result}</h2>
      <p>${esc(p.result)}</p>
    </section>
    <section aria-labelledby="h-stack">
      <h2 id="h-stack">${ui.builtWithStack}</h2>
      <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </section>
  </div>

  <nav class="case-next" aria-label="${ui.projects}">
    <a href="${home}#projekti">${ui.allProjects}</a>
    ${next ? `<a class="case-next-link" href="${home}projekti/${next.id}/"><span>${ui.nextProject}</span>${esc(next.title)}</a>` : ""}
  </nav>
</main>

${footer(ctx)}
</body>
</html>`;
}
