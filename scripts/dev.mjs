// Local preview: serves dist/ and runs the contact API like Vercel does.
//   npm run dev            -> http://localhost:3000
//   RESEND_API_KEY=... npm run dev   to test real sending
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { handleContact } from "../lib/contact.mjs";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = Number(process.env.PORT) || 3000;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".pdf": "application/pdf", ".xml": "application/xml", ".txt": "text/plain" };

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === "/api/contact") {
      const request = new Request(url, {
        method: req.method,
        headers: { ...req.headers, "x-forwarded-for": req.socket.remoteAddress },
        body: req.method === "GET" || req.method === "HEAD" ? undefined : Readable.toWeb(req),
        duplex: "half"
      });
      const response = await handleContact(request, process.env);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      return res.end(Buffer.from(await response.arrayBuffer()));
    }
    let file = normalize(join(DIST, decodeURIComponent(url.pathname)));
    if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}  (designs: /designs/)`));
