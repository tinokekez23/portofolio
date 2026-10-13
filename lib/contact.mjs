// Contact form backend. Pure Web-standard Request -> Response so it runs the same on
// Vercel, in the local dev server and in tests.
//
// Environment:
//   RESEND_API_KEY      API key from resend.com (required to actually send)
//   CONTACT_TO_EMAIL    where messages go (default: the address on the site)
//   CONTACT_FROM_EMAIL  verified sender, e.g. "Portfolio <poruke@tvoja-domena.hr>"
//                       (default: Resend's test sender, which only delivers to your own account email)

const LIMITS = { name: [2, 100], email: [3, 200], message: [10, 5000] };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 2500; // humans don't fill three fields in under 2.5 s
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };
const DEFAULT_TO = "tinokekez23@gmail.com";

export function validate(input) {
  const data = {
    name: String(input.name ?? "").replace(/[\r\n]+/g, " ").trim(),
    email: String(input.email ?? "").trim(),
    message: String(input.message ?? "").trim(),
    lang: input.lang === "en" ? "en" : "hr"
  };
  const errors = {};
  for (const [k, [min, max]] of Object.entries(LIMITS)) {
    if (data[k].length < min || data[k].length > max) errors[k] = "length";
  }
  if (!errors.email && !EMAIL_RE.test(data.email)) errors.email = "format";
  return { data, errors, ok: Object.keys(errors).length === 0 };
}

export function isSpam(input, now = Date.now()) {
  if (String(input.website ?? "").trim()) return true; // honeypot filled
  const t = Number(input.t);
  return Boolean(t) && now - t < MIN_FILL_MS;
}

export function createRateLimiter({ max, windowMs } = RATE) {
  const hits = new Map();
  return (key, now = Date.now()) => {
    const recent = (hits.get(key) || []).filter((ts) => now - ts < windowMs);
    if (recent.length >= max) { hits.set(key, recent); return false; }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear(); // keep a long-lived instance from growing forever
    return true;
  };
}

// Best effort: each serverless instance has its own memory, which is enough to stop
// one visitor hammering the button. Use a shared store if this ever gets real abuse.
const allow = createRateLimiter();

export async function sendEmail(data, env, fetchImpl = fetch) {
  const res = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL || DEFAULT_TO],
      reply_to: data.email,
      subject: `Portfolio: poruka od ${data.name}`,
      text: `${data.message}\n\n--\n${data.name} <${data.email}>\nJezik stranice: ${data.lang}`
    })
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text().catch(() => "")}`);
}

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

// Answer for browsers without JavaScript, which post the form directly.
function htmlPage(status, lang, ok, invalid) {
  const hr = lang !== "en";
  const title = ok ? (hr ? "Poruka je poslana" : "Message sent") : (hr ? "Poruka nije poslana" : "Message not sent");
  const text = ok
    ? (hr ? "Hvala! Odgovorit ću ti na adresu koju si upisao." : "Thanks! I'll reply to the address you entered.")
    : invalid
      ? (hr ? "Ime, ispravna adresa e-pošte i poruka od barem 10 znakova su obavezni. Vrati se i ispravi obrazac." : "A name, a valid email address and a message of at least 10 characters are required. Go back and fix the form.")
      : (hr ? `Slanje trenutno ne radi. Piši izravno na ${DEFAULT_TO}.` : `Sending isn't working right now. Email ${DEFAULT_TO} directly.`);
  const back = hr ? "Natrag na stranicu" : "Back to the site";
  return new Response(
    `<!doctype html><html lang="${hr ? "hr" : "en"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>` +
      `<body style="font:1.1rem/1.6 system-ui,sans-serif;max-width:34rem;margin:15vh auto;padding:0 1rem"><h1>${title}</h1><p>${text}</p><p><a href="/${hr ? "" : "en/"}#kontakt">${back}</a></p>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

export async function handleContact(request, env = {}, deps = {}) {
  const { send = sendEmail, rateLimit = allow, now = Date.now() } = deps;
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" });

  const type = request.headers.get("content-type") || "";
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  let input;
  try {
    if (type.includes("application/json")) input = await request.json();
    else if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) input = Object.fromEntries(await request.formData());
    else return json(415, { error: "unsupported_media_type" });
  } catch {
    return json(400, { error: "bad_request" });
  }
  if (!input || typeof input !== "object") return json(400, { error: "bad_request" });

  const lang = input.lang === "en" ? "en" : "hr";
  const reply = (status, body) => (wantsJson ? json(status, body) : htmlPage(status, lang, status < 300, status === 422));

  // Bots get a normal-looking success so they don't learn to adapt.
  if (isSpam(input, now)) return reply(200, { ok: true });

  const { ok, data, errors } = validate(input);
  if (!ok) return reply(422, { error: "invalid", errors });

  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  if (!rateLimit(ip, now)) return reply(429, { error: "rate_limited" });

  if (!env.RESEND_API_KEY) return reply(503, { error: "not_configured" });
  try {
    await send(data, env);
  } catch (err) {
    console.error("contact: send failed", err);
    return reply(502, { error: "send_failed" });
  }
  return reply(200, { ok: true });
}
