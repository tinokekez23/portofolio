import { fmtRange, duration, fmtDate } from "./util.mjs";

// Localised, display-ready view of the profile so each design only deals with layout.
// Strings are NOT escaped here; designs escape on output.
export function model(ctx) {
  const { P, t, lang, ui } = ctx;
  return {
    name: P.name,
    headline: t(P.headline),
    role: t(P.role),
    tagline: t(P.tagline),
    location: t(P.location),
    study: t(P.study),
    availability: P.available ? t(P.availability) : "",
    email: P.email,
    phone: P.phone,
    photo: P.photo,
    cv: P.cvFile,
    socials: P.socials,
    about: P.about.map(t),
    aboutPhoto: P.aboutPhoto ? { src: P.aboutPhoto.src, alt: t(P.aboutPhoto.alt), caption: t(P.aboutPhoto.caption) } : null,
    jobs: P.experience.map((j) => ({
      role: t(j.role),
      company: t(j.company),
      place: t(j.place),
      start: fmtDate(j.start, lang),
      end: j.end ? fmtDate(j.end, lang) : ui.present,
      range: fmtRange(j.start, j.end, lang, ui),
      duration: duration(j.start, j.end, lang),
      current: !j.end,
      points: j.points.map(t),
      tags: (j.tags || []).map(t),
      logo: j.logo ? { src: j.logo.src, alt: t(j.logo.alt) } : null
    })),
    volunteering: P.volunteering.map((v) => ({
      role: t(v.role),
      company: t(v.company),
      place: t(v.place),
      range: fmtRange(v.start, v.end, lang, ui),
      points: v.points.map(t),
      icon: v.icon ? { src: v.icon.src, alt: t(v.icon.alt) } : null
    })),
    education: P.education.map((e) => ({
      title: t(e.title),
      school: t(e.school),
      range: e.end ? `${fmtDate(e.start, lang)} – ${fmtDate(e.end, lang)}` : `${ui.since} ${fmtDate(e.start, lang)}`,
      current: !e.end,
      note: t(e.note),
      icon: e.icon ? { src: e.icon.src, alt: t(e.icon.alt), logo: !!e.icon.logo } : null
    })),
    certificates: P.certificates.map((c) => ({ title: t(c.title), issuer: t(c.issuer), year: c.year, icon: c.icon ? { src: c.icon.src, alt: t(c.icon.alt), logo: !!c.icon.logo } : null, licences: (c.licences || []).map((l) => ({ cat: l.cat, src: l.src, alt: t(l.alt) })) })),
    skills: P.skills.map((g) => ({ group: t(g.group), items: g.items.map(t) })),
    languages: P.languages.map((l) => ({ name: t(l.name), level: l.level === "native" ? ui.native : l.level, native: l.level === "native" })),
    // "Hrvatski i engleski": Croatian doesn't capitalise language names mid-sentence
    languageNames: P.languages.map((l, i) => (i && lang === "hr" ? t(l.name).toLowerCase() : t(l.name))).join(lang === "hr" ? " i " : " and "),
    projects: P.projects.map((p) => ({
      id: p.id,
      title: t(p.title),
      year: p.year,
      planned: p.status === "planned",
      summary: t(p.summary),
      problem: t(p.problem),
      solution: t(p.solution),
      result: t(p.result),
      stack: p.stack || [],
      image: p.image,
      video: p.video ? { src: p.video.src, poster: p.video.poster, width: p.video.width, height: p.video.height, alt: t(p.video.alt) } : null,
      links: (p.links || []).map((l) => ({ label: t(l.label), url: l.url }))
    })),
    testimonials: P.testimonials.map((q) => ({ quote: t(q.quote), name: q.name, title: t(q.title) })),
    year: new Date().getFullYear()
  };
}
