import { esc } from "./util.mjs";

// dist/404.html, which Vercel serves for any missing URL. One page for both languages,
// since the URL that failed doesn't say which one the visitor reads.
export function notFound({ P, favicon }) {
  return `<!doctype html>
<html lang="hr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Stranica ne postoji · ${esc(P.name)}</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}">
<style>
:root { --bg: #ECEEEA; --ink: #17302B; --muted: #4A5F5A; --link: #0B6B63; --line: #C6CFCB; color-scheme: light dark; }
@media (prefers-color-scheme: dark) { :root { --bg: #102320; --ink: #E4EDEA; --muted: #A2B7B2; --link: #6CCBBE; --line: #2C4742; } }
body { margin: 0; background: var(--bg); color: var(--ink); font: 1.125rem/1.6 "Helvetica Neue", Arial, sans-serif; }
main { max-width: 36rem; margin: 0 auto; padding: 18vh 1.25rem 4rem; }
h1 { font-size: 2rem; line-height: 1.2; margin: 0 0 .75rem; }
h2 { font-size: 1.25rem; margin: 0 0 .5rem; }
p { margin: 0 0 1rem; color: var(--muted); }
section + section { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--line); }
a { color: var(--link); font-weight: 600; text-underline-offset: .2em; }
a:focus-visible { outline: 2px solid var(--link); outline-offset: 3px; }
</style>
</head>
<body>
<main>
<section>
<h1>Ova stranica ne postoji</h1>
<p>Možda je link pogrešno upisan ili je stranica premještena.</p>
<p><a href="/">${esc(P.name)}, naslovna</a></p>
</section>
<section lang="en">
<h2>This page doesn't exist</h2>
<p>The link may be mistyped, or the page has moved.</p>
<p><a href="/en/">${esc(P.name)}, home page</a></p>
</section>
</main>
</body>
</html>
`;
}
