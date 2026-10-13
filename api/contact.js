// Vercel Function: POST /api/contact
import { handleContact } from "../lib/contact.mjs";

export function POST(request) {
  return handleContact(request, process.env);
}

export function GET(request) {
  return handleContact(request, process.env);
}
