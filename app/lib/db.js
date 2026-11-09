import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.QUAX_DB_PATH ?? path.join(process.cwd(), "data", "quax.db");
const SEED_PATH = path.join(process.cwd(), "public", "SnippetData", "data.json");

function open() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS snippets (
      id       TEXT PRIMARY KEY,
      title    TEXT NOT NULL,
      language TEXT NOT NULL,
      tags     TEXT NOT NULL DEFAULT '[]',
      code     TEXT NOT NULL
    )
  `);

  return db;
}

// Insert any seed rows from public/SnippetData/data.json that are missing.
// Never overwrites or deletes existing rows. Only called by `npm run db:seed`.
export function seedDb() {
  const db = getDb();
  const { snippets } = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
  const insert = db.prepare(
    "INSERT OR IGNORE INTO snippets (id, title, language, tags, code) VALUES (?, ?, ?, ?, ?)"
  );
  let added = 0;
  for (const s of snippets ?? []) {
    const { changes } = insert.run(String(s.id), s.title, s.language, JSON.stringify(s.tags ?? []), s.code);
    added += Number(changes);
  }
  return added;
}

// DESTRUCTIVE: delete every snippet, then re-seed. Only called by `npm run db:reset`.
export function resetDb() {
  const db = getDb();
  db.exec("BEGIN");
  try {
    db.exec("DELETE FROM snippets");
    seedDb();
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return db.prepare("SELECT COUNT(*) AS n FROM snippets").get().n;
}

// Cache on globalThis so dev HMR doesn't reopen the database on every reload.
export function getDb() {
  globalThis.__quaxDb ??= open();
  return globalThis.__quaxDb;
}

// Take a row from DB and return as an object
export function rowToSnippet(row) {
  return { ...row, tags: JSON.parse(row.tags) };
}
