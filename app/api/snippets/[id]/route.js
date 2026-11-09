import { getDb, rowToSnippet } from "@/app/lib/db";

function findSnippet(db, id) {
  const row = db.prepare("SELECT * FROM snippets WHERE id = ?").get(id);
  return row ? rowToSnippet(row) : null;
}

// GET /api/snippets/[id]
export async function GET(request, { params }) {
  const { id } = await params;
  const snippet = findSnippet(getDb(), id);
  if (!snippet) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(snippet);
}

// PATCH /api/snippets/[id]  body: { "title": "Renamed" }
export async function PATCH(request, { params }) {
  const { id } = await params;
  const db = getDb();
  if (!findSnippet(db, id)) return Response.json({ error: "Not found" }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  if (typeof body?.title === "string" && body.title.trim()) {
    db.prepare("UPDATE snippets SET title = ? WHERE id = ?").run(body.title.trim(), id);
  }
  return Response.json(findSnippet(db, id));
}

// DELETE /api/snippets/[id]
export async function DELETE(request, { params }) {
  const { id } = await params;
  const { changes } = getDb().prepare("DELETE FROM snippets WHERE id = ?").run(id);
  if (changes === 0) return Response.json({ error: "Not found" }, { status: 404 });
  return new Response(null, { status: 204 });
}
