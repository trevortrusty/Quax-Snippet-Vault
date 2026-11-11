# TODO

- [x] Add a list endpoint for snippets (done as `GET /api/snippets`).
- [x] Add a `POST` endpoint to create snippets (done as `POST /api/snippets`).
- [ ] Integrate an LLM into the chat bar.
- [ ] Give the LLM initial instructions (system prompt), including that it should generate a snippet of code that fulfills the user's request, which the user can copy and paste into an existing code file. It should not write a whole code file unless the user's request implicitly or explicitly asks for one.
- [ ] Add a button to the snippet card that tells the LLM to turn the snippet into a completed code file. For example, a bare `std::cout << "hello world"` becomes a full file with the preprocessor includes, the `main` function, etc.
- [ ] Add a language filter drop-down that filters the snippets by language
- [ ] Add a favorites section and a star button to cards
