// Manual database maintenance. Never runs automatically.
//   npm run db:seed            add any missing seed snippets (non-destructive)
//   npm run db:reset -- --yes  DELETE ALL snippets, then re-seed
// Set QUAX_DB_PATH to target a different database file.
import { seedDb, resetDb } from "../app/lib/db.js";

const [cmd, ...flags] = process.argv.slice(2);

if (cmd === "seed") {
  console.log(`Added ${seedDb()} missing seed snippet(s). Existing rows untouched.`);
} else if (cmd === "reset") {
  if (!flags.includes("--yes")) {
    console.error("Refusing to reset: this deletes ALL snippets. Re-run with: npm run db:reset -- --yes");
    process.exit(1);
  }
  console.log(`Reset complete. ${resetDb()} snippet(s) now in the database.`);
} else {
  console.error("Usage: node scripts/db.mjs <seed | reset --yes>");
  process.exit(1);
}
