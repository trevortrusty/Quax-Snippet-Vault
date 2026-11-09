import { getDb, rowToSnippet } from "@/app/lib/db";
import { randomUUID } from "node:crypto";

function loadSnippets(db) {
  return db.prepare("SELECT * FROM snippets").all().map(rowToSnippet);
}

// GET /api/snippets
export async function GET() {
  return Response.json(loadSnippets(getDb()));
}


// POST /api/snippets
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title || typeof body.code !== "string" || typeof body.language !== "string") {
    return Response.json({ error: "title, language and code are required" }, { status: 400 });
  }
  const tags = Array.isArray(body.tags) ? body.tags : [];
  const id = randomUUID();
  const db = getDb();
  db.prepare("INSERT INTO snippets (id, title, language, tags, code) VALUES (?, ?, ?, ?, ?)")
    .run(id, title, body.language, JSON.stringify(tags), body.code);
  const row = db.prepare("SELECT * FROM snippets WHERE id = ?").get(id);
  return Response.json(rowToSnippet(row), { status: 201 });
}
