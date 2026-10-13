const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ENTITIES[c]);

// Picks the right language from { hr, en } values; plain strings pass through.
export const makeT = (lang) => (v) =>
  v && typeof v === "object" && !Array.isArray(v) ? (v[lang] ?? v.hr ?? "") : (v ?? "");

const MONTHS = {
  hr: ["sij", "velj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

// "2023-05" -> "svi 2023." / "May 2023"; "2024" -> "2024."
export function fmtDate(s, lang) {
  if (!s) return null;
  const [y, m] = s.split("-");
  const dot = lang === "hr" ? "." : "";
  return m ? `${MONTHS[lang][+m - 1]} ${y}${dot}` : `${y}${dot}`;
}

export function fmtRange(start, end, lang, ui) {
  const a = fmtDate(start, lang);
  if (!end) return `${ui.since} ${a}`;
  const b = fmtDate(end, lang);
  return a === b ? a : `${a} – ${b}`;
}

// Length of a finished job in months, e.g. "4 mj." / "4 mo". Ongoing jobs get none
// because a static page would show a stale number.
export function duration(start, end, lang) {
  if (!end || !start.includes("-")) return "";
  const [ys, ms] = start.split("-").map(Number);
  const [ye, me] = end.split("-").map(Number);
  const months = (ye - ys) * 12 + (me - ms) + 1;
  return lang === "hr" ? `${months} mj.` : `${months} mo`;
}

export const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Relative prefix from a page at `dir` (e.g. "designs/cetina/en") back to the site root.
export const toRoot = (dir) => (dir ? dir.split("/").filter(Boolean).map(() => "..").join("/") + "/" : "");
