# Quax 🦆

> Your rubber-duck coding assistant, without the "vibe-coding" hype.

Quax keeps a personal library of reusable code snippets. Ask for the code you need, get a snippet card, and build up a collection you can search and reuse across projects.

## Why Quax?

Before the future hit us like a quack-ton of bricks, getting boilerplate meant googling, scrolling through w3schools or HowToGeek, and copying snippets into your project. Quax makes that loop obsolete.

Need a CSS class that turns a `<div>` into a modal? Ask Quax for the code. It generates a snippet card and saves it to a grid alongside everything else you've requested. Templates and boilerplate you reuse across projects are always at your fingertips.

Launch Quax, unload your troubles onto your rubber duck, and profit. When you need a concept you've used before, filter your collection by language, search for the snippet, and copy it into your IDE.

## Project Status

🚧 **Early development.** Snippets can be added, listed and deleted. Click-to-copy and the AI chat are the main missing pieces.

### Done

- [x] Snippet grid of cards, each with a single-language tag
- [x] "Add Snippet" modal with multi-line code input
- [x] Delete button on snippet cards
- [x] REST API for snippets (`GET`/`POST` `/api/snippets`, `GET`/`PATCH`/`DELETE` `/api/snippets/:id`)
- [x] SQLite persistence with seed and reset scripts
- [x] Postman collection covering the Snippets API

### In Progress / Planned

- [ ] Click-to-copy on snippet cards
- [ ] Integrate an LLM into the chat bar *(the chat panel currently only echoes submitted messages)*
- [ ] System prompt so the LLM returns focused snippets, not whole files, unless asked
- [ ] "Turn into a full file" button on snippet cards
- [ ] Language filter drop-down
- [ ] Favorites section and star button on cards

The full list is tracked in [TODO.md](TODO.md).

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- Tailwind CSS 4 and CSS Modules
- SQLite for storage (`data/quax.db`)
- [lucide-react](https://lucide.dev) icons

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://127.0.0.1:3000](http://127.0.0.1:3000). The dev server binds to `127.0.0.1` only.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Lint the code |
| `npm run db:seed` | Add any missing seed snippets (non-destructive) |
| `npm run db:reset -- --yes` | **Delete all snippets**, then re-seed |

Set `QUAX_DB_PATH` to use a different database file.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/snippets` | List all snippets |
| `POST` | `/api/snippets` | Create a snippet (`title`, `language` and `code` are required) |
| `GET` | `/api/snippets/:id` | Get one snippet |
| `PATCH` | `/api/snippets/:id` | Rename a snippet |
| `DELETE` | `/api/snippets/:id` | Delete a snippet |

A Postman collection with tests for these endpoints lives in [`postman/collections/Quax Snippets API`](postman/collections/Quax%20Snippets%20API).

## Project Structure

```
app/
  api/snippets/   REST routes
  components/     UI (cards, chat, modal, navbar)
  lib/            database helpers
data/             SQLite database
scripts/          database maintenance
postman/          API collection and tests
```
