# Quax 🦆

> Your rubber-duck coding assistant, without the "vibe-coding" hype.

Quax keeps a personal library of reusable code snippets. Ask for the code you need, get a snippet card, and build up a collection you can search and reuse across projects.

## Why Quax?

Before the future hit us like a quack-ton of bricks, getting boilerplate meant googling, scrolling through w3schools or HowToGeek, and copying snippets into your project. Quax makes that loop obsolete.

Need a CSS class that turns a `<div>` into a modal? Ask Quax for the code. It generates a snippet card and saves it to a grid alongside everything else you've requested. Templates and boilerplate you reuse across projects are always at your fingertips.

Launch Quax, unload your troubles onto your rubber duck, and profit. When you need a concept you've used before, filter your collection by language, search for the snippet, and copy it into your IDE.

## Project Status

✅ **MVP reached.** You can chat with Quax to create and update snippets, and manage them from the card grid.

### Done

- [x] Snippet grid of cards, each with a single-language tag
- [x] "Add Snippet" modal with multi-line code input, reused as an edit modal for existing cards
- [x] Edit and delete buttons on snippet cards
- [x] Click-to-copy on snippet cards
- [x] REST API for snippets (`GET`/`POST` `/api/snippets`, `GET`/`PATCH`/`DELETE` `/api/snippets/:id`)
- [x] SQLite persistence with seed and reset scripts
- [x] Postman collection covering the Snippets API
- [x] Chat bar wired to a local Claude Code instance (via the Claude Agent SDK) that can list, create and update snippets
- [x] Language filter drop-down in the navbar
- [x] Markdown rendering in chat messages (headings, bold/italic, inline code, fenced code blocks, lists, links), and Enter inserts a newline while a fenced code block is still open
- [x] System prompt so Claude returns focused snippets, not whole files, unless asked ([`prompts/quax-system-prompt.md`](prompts/quax-system-prompt.md))

### Planned

- [ ] "Turn into a full file" button on snippet cards
- [ ] Typing indicator while waiting for Claude
- [ ] Placeholder card with a spinner while Claude is working
- [ ] Favorites section and star button on cards

The full list is tracked in [TODO.md](TODO.md).

## How the Chat Works

The chat bar posts the conversation to `/api/chat`, which runs a Claude Agent SDK session using the system prompt in `prompts/quax-system-prompt.md`. Quax has no file, shell or web access. Its only abilities are four snippet tools (`list_snippets`, `get_snippet`, `create_snippet`, `update_snippet`) that call the snippets API. There is deliberately no delete tool; use the trash button on a card. Code goes straight into the saved card rather than into the chat reply, and the grid refreshes after a change.

The prompt file is read on every request, so edits take effect without a restart. Because the SDK drives your local Claude Code install, you need Claude Code set up and signed in on the machine running Quax.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- Tailwind CSS 4 and CSS Modules
- SQLite for storage (`data/quax.db`)
- [commonmark](https://github.com/commonmark/commonmark.js) for parsing markdown in chat messages
- [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview) for the chat assistant, which runs on your local Claude Code installation
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
| `PATCH` | `/api/snippets/:id` | Update a snippet's `title`, `language` and/or `code` (blank values are ignored) |
| `DELETE` | `/api/snippets/:id` | Delete a snippet |
| `POST` | `/api/chat` | Send chat `messages`; returns `{ reply, snippetsChanged }` |

A Postman collection with tests for these endpoints lives in [`postman/collections/Quax Snippets API`](postman/collections/Quax%20Snippets%20API).

## Project Structure

```
app/
  api/snippets/   REST routes
  api/chat/       Claude chat route
  components/     UI (cards, chat, modal, navbar)
  lib/            database helpers, Claude snippet tools
data/             SQLite database
docs/             REFERENCE.md code reference, RENDER_TREE.md component tree
prompts/          chat system prompt
scripts/          database maintenance
postman/          API collection and tests
```
