import { test } from "node:test";
import assert from "node:assert/strict";
import { validate, isSpam, createRateLimiter, handleContact } from "../lib/contact.mjs";

const NOW = 1_800_000_000_000;
const good = { name: "Ana Anić", email: "ana@primjer.hr", message: "Bok, imamo praksu za tebe.", lang: "hr", t: String(NOW - 10_000) };
const post = (body, { type = "application/json", accept = "application/json", ip = "1.1.1.1" } = {}) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": type, accept, "x-forwarded-for": ip },
    body: type.includes("json") ? JSON.stringify(body) : new URLSearchParams(body).toString()
  });
const env = { RESEND_API_KEY: "test" };
const deps = (over = {}) => ({ now: NOW, rateLimit: () => true, send: async () => {}, ...over });

test("validate accepts a normal message and trims fields", () => {
  const r = validate({ ...good, name: "  Ana Anić \r\n" });
  assert.equal(r.ok, true);
  assert.equal(r.data.name, "Ana Anić");
});

test("validate reports every bad field", () => {
  const r = validate({ name: "A", email: "nije-adresa", message: "kratko" });
  assert.deepEqual(Object.keys(r.errors).sort(), ["email", "message", "name"]);
});

test("validate strips line breaks from the name (header injection)", () => {
  assert.equal(validate({ ...good, name: "Ana\r\nBcc: x@y.z" }).data.name, "Ana Bcc: x@y.z");
});

test("isSpam catches the honeypot and instant submits", () => {
  assert.equal(isSpam({ ...good, website: "http://spam" }, NOW), true);
  assert.equal(isSpam({ ...good, t: String(NOW - 500) }, NOW), true);
  assert.equal(isSpam(good, NOW), false);
  assert.equal(isSpam({ ...good, t: "" }, NOW), false); // no JS: no timestamp
});

test("rate limiter allows max hits per window", () => {
  const allow = createRateLimiter({ max: 2, windowMs: 1000 });
  assert.equal(allow("a", 0), true);
  assert.equal(allow("a", 10), true);
  assert.equal(allow("a", 20), false);
  assert.equal(allow("b", 20), true);
  assert.equal(allow("a", 1500), true);
});

test("sends a valid JSON submission", async () => {
  let sent;
  const res = await handleContact(post(good), env, deps({ send: async (d) => { sent = d; } }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(sent.email, "ana@primjer.hr");
});

test("returns field errors as 422", async () => {
  const res = await handleContact(post({ ...good, email: "ana@primjer" }), env, deps());
  assert.equal(res.status, 422);
  assert.deepEqual((await res.json()).errors, { email: "format" });
});

test("pretends success for spam without sending", async () => {
  let called = false;
  const res = await handleContact(post({ ...good, website: "x" }), env, deps({ send: async () => { called = true; } }));
  assert.equal(res.status, 200);
  assert.equal(called, false);
});

test("503 when the email service isn't configured", async () => {
  const res = await handleContact(post(good), {}, deps());
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, "not_configured");
});

test("502 when the email service fails", async () => {
  const orig = console.error; console.error = () => {};
  const res = await handleContact(post(good), env, deps({ send: async () => { throw new Error("down"); } }));
  console.error = orig;
  assert.equal(res.status, 502);
});

test("429 when rate limited", async () => {
  const res = await handleContact(post(good), env, deps({ rateLimit: () => false }));
  assert.equal(res.status, 429);
});

test("plain HTML form post gets an HTML answer", async () => {
  const res = await handleContact(post({ ...good, t: "" }, { type: "application/x-www-form-urlencoded", accept: "text/html" }), env, deps());
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/html/);
  assert.match(await res.text(), /Poruka je poslana/);
});

test("rejects other methods and content types", async () => {
  assert.equal((await handleContact(new Request("http://x/api/contact"), env, deps())).status, 405);
  const res = await handleContact(new Request("http://x/api/contact", { method: "POST", headers: { "content-type": "text/plain" }, body: "hi" }), env, deps());
  assert.equal(res.status, 415);
});

test("malformed JSON is a 400", async () => {
  const req = new Request("http://x/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "{nope" });
  assert.equal((await handleContact(req, env, deps())).status, 400);
});
