# TODO

- [x] Add a list endpoint for snippets (done as `GET /api/snippets`).
- [x] Add a `POST` endpoint to create snippets (done as `POST /api/snippets`).
- [x] Connect the chat bar to a local Claude Code installation (via the Claude Agent SDK).
- [x] Give Claude initial instructions (system prompt), including that it should generate a snippet of code that fulfills the user's request, which the user can copy and paste into an existing code file. It should not write a whole code file unless the user's request implicitly or explicitly asks for one.
- [ ] Add a button to the snippet card that tells Claude to turn the snippet into a completed code file. For example, a bare `std::cout << "hello world"` becomes a full file with the preprocessor includes, the `main` function, etc.
- [x] Add a language filter drop-down that filters the snippets by language
- [ ] Add a favorites section and a star button to cards
- [x] Add click-to-copy to snippet cards
- [x] Add an edit button to snippet cards
- [x] Parse markdown in AI chat messages
- [ ] Add a typing indicator while waiting for the AI response
- [ ] Show a placeholder card with a spinner while the AI is working on the prompt
