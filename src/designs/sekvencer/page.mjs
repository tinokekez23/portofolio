// "Sekvencer": Tino plays drums and writes code, so the hero is a working 16-step drum
// machine in the colours of a classic rhythm composer. Everything below it stays quiet.
import { esc } from "../../shared/util.mjs";
import { head, picture, contactForm, langLink, script } from "../../shared/parts.mjs";
import { model } from "../../shared/model.mjs";

export const meta = {
  name: "Sekvencer",
  blurb: {
    hr: "Osobno i pamtljivo. Vrh stranice je pravi bubanj-stroj sa 16 koraka u bojama legendarnih ritam-mašina: posjetitelj može složiti i pustiti ritam. Pokazuje da znaš JavaScript i da sviraš bubnjeve, ostatak je uredan i jednostavan.",
    en: "Personal and memorable. The top of the page is a working 16-step drum machine in classic rhythm-machine colours that visitors can program and play. Shows you know JavaScript and play drums; the rest is tidy and simple."
  }
};

const TEXT = {
  hr: {
    tracks: ["Bas bubanj", "Doboš", "Hi-hat"],
    play: "Pokreni ritam", stop: "Zaustavi", tempo: "Tempo",
    step: "korak",
    note: "Sviram bubnjeve, gitaru i klavir, a učim programirati. Uključi korake i pokreni ritam.",
    machine: "Bubanj-stroj"
  },
  en: {
    tracks: ["Kick", "Snare", "Hi-hat"],
    play: "Play the beat", stop: "Stop", tempo: "Tempo",
    step: "step",
    note: "I play drums, guitar and piano, and I'm learning to code. Switch steps on and press play.",
    machine: "Drum machine"
  }
};

// Starting groove: kick, snare, closed hat (16 steps each)
const PATTERN = [
  [0, 6, 10],
  [4, 12],
  [0, 2, 4, 6, 8, 10, 12, 14]
];

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#2B2A27"/><rect x="8" y="22" width="10" height="20" rx="2" fill="#D33A2C"/><rect x="21" y="22" width="10" height="20" rx="2" fill="#EC7A1F"/><rect x="34" y="22" width="10" height="20" rx="2" fill="#EFC032"/><rect x="47" y="22" width="10" height="20" rx="2" fill="#EFE9DA"/></svg>`;

// 16 cells in four groups of four, like the coloured key blocks on the machine
const groups = (cells) => [0, 1, 2, 3].map((g) => `<div class="grp">${cells.slice(g * 4, g * 4 + 4).join("")}</div>`).join("");

function sequencer(L) {
  const rows = L.tracks.map((name, r) => {
    const steps = Array.from({ length: 16 }, (_, i) => {
      const on = PATTERN[r].includes(i);
      return `<button type="button" class="step g${Math.floor(i / 4)}" aria-pressed="${on}" aria-label="${esc(name)}, ${L.step} ${i + 1}" disabled></button>`;
    });
    return `<div class="track" role="group" aria-label="${esc(name)}"><span class="track-name" aria-hidden="true">${esc(name)}</span><div class="steps" data-track="${r}">${groups(steps)}</div></div>`;
  }).join("");
  const leds = Array.from({ length: 16 }, (_, i) => `<i class="led" data-led="${i}"></i>`);
  return `<div class="seq" data-seq aria-label="${L.machine}" role="region">
  <div class="seq-controls">
    <button type="button" class="play" data-play aria-pressed="false" hidden data-label-play="${L.play}" data-label-stop="${L.stop}"><span class="play-icon" aria-hidden="true"></span><span data-play-text>${L.play}</span></button>
    <label class="tempo" hidden data-tempo-wrap>${L.tempo} <input type="range" min="70" max="140" value="96" data-tempo aria-valuetext="96 BPM"> <output data-bpm>96</output>&nbsp;BPM</label>
  </div>
  <div class="track leds-row" aria-hidden="true"><span class="track-name"></span><div class="steps leds">${groups(leds)}</div></div>
  ${rows}
</div>`;
}

export function render(ctx) {
  const m = model(ctx);
  const { ui, lang, root } = ctx;
  const L = TEXT[lang];
  const n = ui.nav;

  const project = (p) => p.planned
    ? `<li class="proj proj-planned"><div class="proj-text"><p class="proj-tag">${ui.planned}</p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></div></li>`
    : `<li class="proj">
  ${p.image ? `<figure class="proj-shot">${picture(ctx, p.image, { sizes: "(min-width: 70rem) 40rem, calc(100vw - 2.5rem)" })}</figure>` : ""}
  <div class="proj-text">
    <h3>${esc(p.title)}</h3>
    <p class="proj-meta">${esc(p.year)}, ${p.stack.map(esc).join(", ")}</p>
    <p>${esc(p.summary)}</p>
    <details>
      <summary>${ui.howMade}</summary>
      <dl class="cs">
        <div><dt>${ui.problem}</dt><dd>${esc(p.problem)}</dd></div>
        <div><dt>${ui.solution}</dt><dd>${esc(p.solution)}</dd></div>
        <div><dt>${ui.result}</dt><dd>${esc(p.result)}</dd></div>
      </dl>
    </details>
  </div>
</li>`;

  return `<html lang="${lang}">
${head(ctx, { css: ctx.css, fonts: ["archivo.woff2"], themeColor: "#E3E4E1", themeColorDark: "#1C1B19", favicon: FAVICON })}
<body>
<a class="skip" href="#sadrzaj">${ui.skip}</a>
<header class="bar">
  <div class="wrap bar-in">
    <a class="mark" href="#top" aria-label="${esc(m.name)}"><span class="mark-keys" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${esc(m.name)}</a>
    <nav id="nav" class="nav" aria-label="${ui.navLabel}" data-nav>
      <a href="#o-meni">${n.about}</a>
      <a href="#iskustvo">${n.experience}</a>
      <a href="#vjestine">${n.skills}</a>
      <a href="#projekti">${n.projects}</a>
      <a href="#kontakt">${n.contact}</a>
    </nav>
    ${langLink(ctx, "lang")}
    <a class="menu-btn" href="#nav" aria-controls="nav" data-menu-button><span class="sr">${ui.menu}</span><span aria-hidden="true"></span></a>
  </div>
</header>

<main id="sadrzaj">
  <section class="hero" id="top" aria-labelledby="hero-h">
    <div class="wrap">
      <div class="panel">
        <div class="panel-head">
          <div>
            <h1 id="hero-h">${esc(m.name)}</h1>
            <p class="role">${esc(m.role)}</p>
          </div>
          ${m.availability ? `<p class="avail"><span class="avail-led" aria-hidden="true"></span>${esc(m.availability)}</p>` : ""}
        </div>
        ${sequencer(L)}
        <p class="seq-note">${L.note}</p>
      </div>
      <div class="hero-foot">
        <p class="tagline">${esc(m.tagline)}</p>
        <div class="actions">
          <a class="btn btn-red" href="${root}${esc(m.cv)}" download>${ui.downloadCv}</a>
          <a class="btn" href="#kontakt">${ui.writeMe}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sec wrap" id="o-meni" aria-labelledby="h-about">
    <h2 id="h-about">${ui.about}</h2>
    <div class="sec-body">
      <div class="prose">${m.about.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      <dl class="facts">
        <div><dt>${ui.location}</dt><dd>${esc(m.location)}</dd></div>
        <div><dt>${ui.study}</dt><dd>${esc(m.study)}</dd></div>
        <div><dt>${ui.languages}</dt><dd>${m.languages.map((l) => `${esc(l.name)} (${esc(l.level)})`).join(", ")}</dd></div>
      </dl>
    </div>
  </section>

  <section class="sec wrap" id="iskustvo" aria-labelledby="h-exp">
    <h2 id="h-exp">${ui.experience}</h2>
    <div class="sec-body">
      <ol class="jobs">${m.jobs.map((j) => `<li class="job">
        <div class="job-head"><h3>${esc(j.role)}</h3><p class="job-when">${esc(j.range)}${j.duration ? `, ${esc(j.duration)}` : ""}</p></div>
        <p class="job-org">${esc(j.company)}, ${esc(j.place)}</p>
        ${j.points.length > 1 ? `<ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : `<p>${esc(j.points[0])}</p>`}
      </li>`).join("")}</ol>
      <div class="two">
        <div><h3 class="sub">${ui.education}</h3><ul class="list">${m.education.map((e) => `<li><b>${esc(e.title)}</b><span>${esc(e.school)}</span><span class="meta">${esc(e.range)}</span></li>`).join("")}</ul></div>
        <div><h3 class="sub">${ui.certificates}</h3><ul class="list">${m.certificates.map((c) => `<li><b>${esc(c.title)}</b>${c.issuer ? `<span>${esc(c.issuer)}</span>` : ""}${c.year ? `<span class="meta">${esc(c.year)}</span>` : ""}</li>`).join("")}</ul></div>
      </div>
    </div>
  </section>

  <section class="sec wrap" id="vjestine" aria-labelledby="h-skills">
    <h2 id="h-skills">${ui.skills}</h2>
    <div class="sec-body">
      <div class="skills">${m.skills.map((g) => `<div class="skill"><h3>${esc(g.group)}</h3><ul>${g.items.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>`).join("")}</div>
    </div>
  </section>

  <section class="sec wrap" id="projekti" aria-labelledby="h-proj">
    <h2 id="h-proj">${ui.projects}</h2>
    <div class="sec-body"><ul class="projs">${m.projects.map(project).join("")}</ul></div>
  </section>

  ${m.testimonials.length ? `<section class="sec wrap" id="preporuke" aria-labelledby="h-test"><h2 id="h-test">${ui.testimonials}</h2><div class="sec-body">${m.testimonials.map((q) => `<figure class="quote"><blockquote><p>${esc(q.quote)}</p></blockquote><figcaption>${esc(q.name)}, ${esc(q.title)}</figcaption></figure>`).join("")}</div></section>` : ""}

  <section class="contact" id="kontakt" aria-labelledby="h-contact">
    <div class="wrap contact-in">
      <div class="contact-side">
        <h2 id="h-contact">${ui.contact}</h2>
        <p class="lead">${ui.contactLead}</p>
        <p class="mail"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p>
        <button class="btn btn-small btn-light" type="button" data-copy="${esc(m.email)}" data-copied="${ui.copied}" hidden>${ui.copy}</button>
        ${m.phone ? `<p class="phone"><a href="tel:${esc(m.phone.replace(/\s/g, ""))}">${esc(m.phone)}</a></p>` : ""}
        ${m.socials.length ? `<ul class="socials">${m.socials.map((s) => `<li><a href="${esc(s.url)}" rel="me noopener">${esc(s.label)}</a></li>`).join("")}</ul>` : ""}
      </div>
      ${contactForm(ctx)}
    </div>
  </section>
</main>
<footer class="foot">
  <div class="wrap foot-in">
    <p>© ${m.year} ${esc(m.name)}. ${ui.builtWith}</p>
    <a href="#top">${ui.toTop}</a>
  </div>
</footer>
${script(ctx, ["sequencer.js"])}
</body>
</html>`;
}
