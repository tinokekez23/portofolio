import { esc } from "../shared/util.mjs";
import { langLink, script } from "../shared/parts.mjs";

export const THEME_COLOR = "#ECEEEA";
export const THEME_COLOR_DARK = "#102320";
export const FONTS = ["schibsted.woff2"];
export const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0B6B63"/><path d="M14 44c8-10 14 6 22-4s10-12 14-12" fill="none" stroke="#ECEEEA" stroke-width="5" stroke-linecap="round"/></svg>`;

// Section anchors on the home page, in page order.
export const SECTIONS = [["projects", "projekti"], ["about", "o-meni"], ["experience", "iskustvo"], ["skills", "vjestine"], ["contact", "kontakt"]];

// `home` is "" on the home page (links stay in-page) and the language root elsewhere.
export function header(ctx, { home = "", path = "" } = {}) {
  const { P, ui } = ctx;
  return `<a class="skip" href="#sadrzaj">${ui.skip}</a>
<header class="bar">
  <div class="wrap bar-in">
    <a class="mark" href="${home || "#top"}">${esc(P.name)}</a>
    <nav id="nav" class="nav" aria-label="${ui.navLabel}" data-nav>
      ${SECTIONS.map(([key, id]) => `<a href="${home}#${id}">${ui.nav[key]}</a>`).join("\n      ")}
    </nav>
    ${langLink(ctx, path)}
    <a class="menu-btn" href="#nav" aria-controls="nav" data-menu-button><span class="sr">${ui.menu}</span><span aria-hidden="true"></span></a>
  </div>
</header>`;
}

export function footer(ctx) {
  const { P, ui } = ctx;
  return `<footer class="foot">
  <div class="wrap foot-in">
    <p>© ${new Date().getFullYear()} ${esc(P.name)}. ${ui.builtWith}</p>
    <a href="#top">${ui.toTop}</a>
  </div>
</footer>
${script(ctx)}`;
}
