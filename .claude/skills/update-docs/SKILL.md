---
name: update-docs
description: Bring Quax's documentation (README.md, TODO.md, docs/REFERENCE.md, docs/RENDER_TREE.md) in line with the code after the user has made changes. Use whenever the user says "update the docs", "update the readme", "update documentation based on my changes", "sync the docs", "reflect my changes in the docs", or asks to mark a feature done, add a TODO item, or refresh the component tree or API reference, even if they only name one of the files. Also use after finishing a feature when the docs may now be stale.
---

# Update Quax docs

The user edits code by hand between sessions, so the docs drift. The job is to find what changed in the code, then update only the docs it affects, without inventing anything the code doesn't do.

## 1. Find what changed

Docs can be stale against uncommitted work **and** against commits made since the docs were last touched, so check both:

```bash
git status --short
git diff HEAD -- app prompts scripts package.json   # uncommitted code changes
git log --oneline -8                                # recent commits
git log -3 --format=%h -- README.md docs TODO.md     # when the docs last changed
git diff <that-hash>..HEAD --stat -- app prompts scripts package.json
```

Read the changed files themselves, not just the diff. A diff doesn't show how a component fits into the tree, and half-finished code (TODO comments, commented-out blocks) should not be documented as working.

## 2. Decide which docs are affected

| File | Update when |
|---|---|
| `README.md` | A feature is finished or newly planned (Project Status lists), the stack changes (new dependency), an API route is added or changed, or the project structure gains a folder. |
| `TODO.md` | A TODO item is completed (check it off) or the user names new work (add it). Keep the user's wording for new items. |
| `docs/REFERENCE.md` | A component's props or behavior change, `useSnippets()` gains or loses fields, the data model changes. Also fix the "Known limitations" list: remove limits that no longer apply and add real new ones. |
| `docs/RENDER_TREE.md` | A component is added, removed, moved, or rendered somewhere new, or data flows differently. |

Touch only the files the changes affect. If nothing in the code changed that a doc mentions, say so instead of rewriting for the sake of it.

## 3. Write the updates

- **Describe what the code does today.** Verify each claim against the source. If a feature is partial (hard-coded options, a TODO in the code, an unhandled error), say so in the docs, usually under Known limitations in `docs/REFERENCE.md`, rather than overstating it.
- **Match the existing style** of each file: the README uses checklists, `REFERENCE.md` uses tables for props and context fields, `RENDER_TREE.md` uses the ASCII tree.
- **Keep the four files consistent.** A finished feature should be checked off in `TODO.md`, moved to Done in the README, and described in `REFERENCE.md`.
- **Say Claude, not "an LLM".** Quax connects to a local Claude Code installation through the Claude Agent SDK. It is not model-agnostic, so don't write "any AI model", "the LLM", or "AI provider". Use "Claude" or "the local Claude Code installation".
- Use an editing script or targeted edits, and confirm each replacement actually matched. A silent no-op replace leaves the docs stale without anyone noticing.

## 4. Report back

Don't commit unless asked. Finish with a short summary grouped by file, saying what changed and why. Mention anything you could not confirm, such as behavior you did not run, and any bugs or gaps you noticed in the code while reading it (for example a hard-coded list that should come from data). Flag these, but don't fix code the user didn't ask you to touch.
