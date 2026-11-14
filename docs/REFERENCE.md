# Quax Reference

Quax is a snippet vault built with Next.js (App Router), React and SQLite. This document covers the front-end structure, the components, the snippets context, and the HTTP API.

> The Next.js version in this repo (16.4.x) has breaking changes from older releases. Check `node_modules/next/dist/docs/` before changing routing or file conventions (see `AGENTS.md`).

## Contents

1. [Architecture](#architecture)
2. [Snippet data model](#snippet-data-model)
3. [Context: `SnippetsContext`](#context-snippetscontext)
4. [Components](#components)
5. [HTTP API](#http-api)
6. [Database](#database)
7. [Known limitations](#known-limitations)

---

## Architecture

```
app/layout.jsx            root <html>/<body>, renders <App>
└─ components/App.jsx     <SnippetsProvider> + screen frame
   ├─ aside (sidebar)     RubberDuck, Chat (SendInput, MessageBubble)
   ├─ right section       Navbar + <main>{page}</main>
   │   └─ app/page.jsx    list of <Card> (CodeBlock inside each)
   └─ UpdateCardModal     add/edit dialog (CodeInput inside the form)
```

- `App` wraps everything in `<SnippetsProvider>`, so any component can call `useSnippets()`.
- `app/page.jsx` is the only page. It reads `snippets` from the context and renders one `Card` per snippet.
- Snippet state lives in the browser (the context). The server is the source of truth: each mutation calls the API first, then updates local state with the server's response.
- Styling uses CSS Modules (`*.module.css`). Shared font and colour helper classes live in `Fonts.module.css`: `dmSans300`, `dmSans800`, `textSize14`, `textSize18`, `whiteText`, `grayText`.

---

## Snippet data model

```ts
type Snippet = {
  id: string;        // UUID for snippets created via the API; seed rows use the ids in data.json
  title: string;
  language: string;  // free text, e.g. "js", "cpp"
  tags: string[];    // stored as JSON in the DB; not editable from the UI yet
  code: string;
};
```

Note that `Card` receives the code as a prop named `body`, whereas the data and API call it `code`.

---

## Context: `SnippetsContext`

File: `app/components/SnippetsContext.jsx`

### `<SnippetsProvider>`

Wraps the app once (in `App.jsx`). On mount it fetches `GET /api/snippets` and stores the result in `snippets`. Fetch errors are logged to the console.

### `useSnippets()`

Returns the context value. Throws if called outside `<SnippetsProvider>`.

| Field | Type | Description |
|---|---|---|
| `snippets` | `Snippet[]` | The cards to show. |
| `modalOpen` | `boolean` | Whether the add/edit modal is showing. |
| `modalSnippet` | `Snippet \| null` | Snippet being edited. `null` means the modal is creating a new snippet. |
| `openModal(snippet?)` | `(Snippet \| null) => void` | Opens the modal. With no argument it opens in "create" mode; with a snippet it opens in "edit" mode. |
| `closeModal()` | `() => void` | Hides the modal. |
| `addSnippet(data)` | `async ({title, language, code}) => Snippet` | `POST /api/snippets`, appends the created snippet to `snippets`. Throws if the response is not OK. |
| `editSnippet(id, data)` | `async (string, Partial<{title, language, code}>) => Snippet` | `PATCH /api/snippets/:id`, replaces the matching snippet in `snippets`. Throws if the response is not OK. |
| `deleteSnippet(id)` | `async (string) => void` | `DELETE /api/snippets/:id`, then removes the snippet from `snippets`. Errors are caught and logged (it does not throw). |

Calling `openModal` from an event handler: wrap it (`onClick={() => openModal()}`). Passing it directly as `onClick={openModal}` would hand the click event in as the snippet.

---

## Components

All in `app/components/`. Files marked **client** start with `"use client"`.

### `App`

Screen frame: sidebar (title, `RubberDuck`, `Chat`) on the left; `Navbar` and the page content on the right; `UpdateCardModal` mounted once at the end. Renders `<SnippetsProvider>` around all of it.

| Prop | Type | Description |
|---|---|---|
| `children` | node | The current page (passed in by `layout.jsx`). |

### `Navbar` (client)

Top bar titled "Snippet Vault" with a **+** button that calls `openModal()` to start creating a snippet. No props.

### `Card`

One snippet. Shows the title, a language tag, the code (via `CodeBlock`), and two buttons:

- **Trash**: calls `deleteSnippet(id)`.
- **Pencil**: calls `openModal({ id, title, language, code: body })`, which opens `UpdateCardModal` in edit mode.

| Prop | Type | Description |
|---|---|---|
| `id` | string | Snippet id. |
| `title` | string | Heading. |
| `body` | string | The snippet's code. |
| `language` | string | Shown as the tag. |

### `CodeBlock`

Read-only code display. Clicking the code copies it to the clipboard (`navigator.clipboard.writeText`). Copy failures are logged, not shown to the user.

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | string | `""` | Text to show and copy. |
| `language` | string | `"text"` | Added as `language-<x>` class on `<code>` (for future highlighting). |

### `UpdateCardModal` (client)

The add/edit dialog, mounted once in `App`. No props; it reads everything from `useSnippets()`.

- **Create mode** (`modalSnippet === null`): heading "Create New Snippet!", submit button "Send", calls `addSnippet`.
- **Edit mode** (`modalSnippet` set): heading "Edit Snippet", submit button "Save", calls `editSnippet(modalSnippet.id, data)`.
- Renders nothing while `modalOpen` is false.
- Closes on Escape, on the × button, and on a backdrop click. It also closes after a successful save. If the request fails, it stays open and the error is logged.
- Owns the **title**, **language** and **code** fields and the submit logic. All three are trimmed and must be non-empty before it submits. While a request is running the fields and button are disabled.
- Internally renders `SnippetForm`, keyed by snippet id (or `"new"`), so the fields reset to the right starting values each time the modal opens for a different snippet.

### `CodeInput` (client)

Just the code textarea, controlled by its parent.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | string | | Current code. |
| `onChange` | `(code: string) => void` | | Called with the new text (not the event). |
| `disabled` | boolean | `false` | Disables the textarea. |

### `Chat` (client)

Sidebar chat: a history of `MessageBubble`s and a `SendInput` box. At the moment it only records the user's own messages (author `"sender"`); the LLM integration is not built yet (see `TODO.md`). No props.

### `SendInput` (client)

Single-line text input with a Send button. Trims the text, ignores blank input, clears itself after sending.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSend` | `(text: string) => void \| Promise<void>` | | Called with the trimmed text. |
| `placeholder` | string | `"Type here..."` | Placeholder and aria-label. |
| `disabled` | boolean | `false` | Disables input and button. |

### `MessageBubble` (client)

One chat message.

| Prop | Type | Description |
|---|---|---|
| `type` | `"sender" \| anything else` | `"sender"` is styled as the user's message; any other value is styled as the receiver. |
| `contents` | string | Message text. |

### `RubberDuck` (client)

A decorative WebGL rubber duck (generated with Randis UDS; keep its attribution). The canvas hides itself if WebGL is unavailable.

| Prop | Type | Default | Description |
|---|---|---|---|
| `height` | number | `175` | Canvas height in px. |
| `maxWidth` | number | `320` | Max width in px. |
| `quackRef` | `ref` | | Pass `useRef()`, then call `quackRef.current()` to make him quack. |

---

## HTTP API

Base path: `/api/snippets`. All bodies are JSON. Route handlers are in `app/api/snippets/route.js` and `app/api/snippets/[id]/route.js`. A Postman collection with tests is in `postman/collections/Quax Snippets API/`.

Errors are returned as `{ "error": "<message>" }`.

### `GET /api/snippets`

List all snippets.

- **200**: `Snippet[]`

### `POST /api/snippets`

Create a snippet.

Body:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Trimmed; must be non-blank. |
| `language` | string | yes | Must be a string. |
| `code` | string | yes | Must be a string. |
| `tags` | string[] | no | Defaults to `[]`. |

- **201**: the created `Snippet` (with a new UUID `id`)
- **400**: `{ "error": "title, language and code are required" }` (also returned for invalid JSON)

### `GET /api/snippets/:id`

- **200**: `Snippet`
- **404**: `{ "error": "Not found" }`

### `PATCH /api/snippets/:id`

Partially update a snippet. Send any of `title`, `language`, `code`. A field is updated only if it is a non-blank string (the value is trimmed); anything else is ignored, so a blank title leaves the title unchanged. `tags` cannot be changed through this endpoint.

```json
{ "title": "Renamed", "code": "console.log('hi')" }
```

- **200**: the updated `Snippet`. Invalid JSON is treated as an empty body, so the response is the unchanged snippet.
- **404**: `{ "error": "Not found" }`

### `DELETE /api/snippets/:id`

- **204**: deleted (no body)
- **404**: `{ "error": "Not found" }`

---

## Database

- SQLite via Node's built-in `node:sqlite` (`app/lib/db.js`).
- File: `data/quax.db` under the project root. Override with the `QUAX_DB_PATH` environment variable. The directory and table are created on first use.
- Table `snippets`: `id TEXT PRIMARY KEY`, `title TEXT`, `language TEXT`, `tags TEXT` (JSON array, default `'[]'`), `code TEXT`.
- Seed data: `public/SnippetData/data.json`.

Helpers exported from `db.js`:

| Function | Description |
|---|---|
| `getDb()` | Shared connection (cached on `globalThis` so dev hot-reload doesn't reopen it). |
| `rowToSnippet(row)` | Converts a DB row to a `Snippet` (parses `tags`). |
| `seedDb()` | Inserts any missing seed rows. Never overwrites or deletes. Returns the number added. |
| `resetDb()` | **Destructive**: deletes all snippets, then re-seeds. Returns the new row count. |

Maintenance scripts (never run automatically):

```sh
npm run db:seed              # add missing seed snippets
npm run db:reset -- --yes    # delete ALL snippets, then re-seed
```

---

## Known limitations

- `Chat` does not call an LLM yet, and it mutates its `messages` array in place instead of creating a new one, so it may not re-render reliably.
- `Card` does not pass `language` to `CodeBlock`, so the code is always tagged `language-text`.
- Tags are stored but are neither displayed nor editable.
- `POST /api/snippets` accepts an empty `code` or `language` string, while the modal does not allow it.
- Failed saves are only logged to the console; the user sees no error message.
