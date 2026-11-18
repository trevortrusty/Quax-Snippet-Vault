# Render Tree

How Quax's React components nest on screen, and who renders what. Components are in `app/components/` unless a path is given.

## The tree

```
RootLayout                      app/layout.jsx            (server component)
└─ <html><body>
   └─ App                       App.jsx
      └─ SnippetsProvider       SnippetsContext.jsx       (context: snippets + modal state)
         └─ div.shell
            ├─ aside.sidebar
            │  ├─ RubberDuck
            │  └─ Chat                                    (client)
            │     ├─ MessageBubble  (one per message)
            │     └─ SendInput
            ├─ div.right
            │  ├─ Navbar                                  (client; language filter + "+" button)
            │  └─ main
            │     └─ {children} = Home   app/page.jsx     (client)
            │        └─ Card  (one per snippet)
            │           └─ CodeBlock
            └─ UpdateCardModal                            (client; add / edit snippet)
               └─ SnippetForm
                  └─ CodeInput
```

## Who renders what

- **`RootLayout`** is the Next.js root layout. It wraps every page and renders `<App>{children}</App>`.
- **`Home`** (`app/page.jsx`) is never imported or called by our code. Next.js maps `app/page.jsx` to the `/` route and passes its default export to the layout as `children`. It appears wherever `App` places `{children}`, inside `<main>`.
- **`App`** is the screen frame: the sidebar on the left, and the navbar plus the current page on the right. It renders once.
- **`SnippetsProvider`** wraps everything inside `App`, so `Chat`, `Navbar`, `Home`, `Card` and `UpdateCardModal` can all call `useSnippets()`. Because it sits above all of them, the list of snippets and the modal's open/closed state are shared.
- **`UpdateCardModal`** is always mounted as a sibling of the sidebar and main area. It shows or hides itself based on `modalOpen` from the context, and `Navbar` and `Card` open it via `openModal()`.
- **Language filter:** `Navbar` sets `languageFilter` in the context, and `Home` reads it to decide which `Card`s to render.

## How data moves

```
Chat ──POST /api/chat──▶ Claude ──tools──▶ /api/snippets ──▶ SQLite
  │                                                            ▲
  └─ refreshSnippets() when snippetsChanged ──▶ SnippetsProvider ─┘ (GET /api/snippets)
                                                   │
                                                   ▼
                                    Home ▶ Card ▶ CodeBlock
```

- Snippets are fetched once by `SnippetsProvider` on mount.
- `Card` (edit, delete), `UpdateCardModal` (add, edit) and `Chat` (via `refreshSnippets`) all change snippets through the context, and `Home` re-renders with the new list.

## Adding another page

A file at `app/<route>/page.jsx` becomes that route and renders inside the same `RootLayout` and `App`, so the sidebar and navbar stay in place. To give a route its own wrapper, add a `layout.jsx` in that folder. It sits between `App` and the page.
