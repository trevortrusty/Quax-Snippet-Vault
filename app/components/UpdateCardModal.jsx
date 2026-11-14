"use client"

import { useEffect, useState } from "react";
import styles from "./UpdateCardModal.module.css";
import fonts from "./Fonts.module.css";
import CodeInput from "./CodeInput";
import { useSnippets } from "./SnippetsContext";

// One modal for both jobs: with no snippet selected it creates a new one,
// with a snippet selected (modalSnippet) it patches that snippet.
export default function UpdateCardModal() {
  const { modalOpen: open, modalSnippet, closeModal: onClose, addSnippet, editSnippet } = useSnippets();

  // Close on Escape while the modal is open
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey); // clean up when closed or unmounted
  }, [open, onClose]);

  if (!open) return null; // render nothing while closed

  const editing = Boolean(modalSnippet);
  const heading = editing ? "Edit Snippet" : "Create New Snippet!";

  // Close only once the server accepted it; on failure the modal stays open.
  const handleSubmit = async (data) => {
    try {
      if (editing) await editSnippet(modalSnippet.id, data);
      else await addSnippet(data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // Clicking the dark backdrop closes it
    <div className={styles.backdrop} onClick={onClose}>
      {/* stopPropagation: clicks inside the box must not reach the backdrop */}
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{heading}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        {/* Remounted per snippet, so the fields start from that snippet's values */}
        <SnippetForm key={modalSnippet?.id ?? "new"} snippet={modalSnippet} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

function SnippetForm({ snippet, onSubmit }) {
  const [title, setTitle] = useState(snippet?.title ?? "");
  const [language, setLanguage] = useState(snippet?.language ?? "");
  const [code, setCode] = useState(snippet?.code ?? "");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { title: title.trim(), language: language.trim(), code: code.trim() };
    if (!data.title || !data.language || !data.code || busy) return;
    setBusy(true);
    await onSubmit(data);
    setBusy(false);
  };

  return (
    <form className={`${styles.form} ${fonts.dmSans300}`} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Snippet Title"
        aria-label="Snippet Title"
        disabled={busy}
      />
      <input
        className={styles.input}
        type="text"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        placeholder="Language"
        aria-label="Language"
        disabled={busy}
      />
      <CodeInput value={code} onChange={setCode} disabled={busy} />
      <button className={styles.button} type="submit" disabled={busy}>
        {snippet ? "Save" : "Send"}
      </button>
    </form>
  );
}
