"use client"

import { useEffect } from "react";
import styles from "./AddSnippetModal.module.css";
import CodeInput from "./CodeInput";
import { useSnippets } from "./SnippetsContext";

export default function AddSnippetModal() {
  const { modalOpen: open, closeModal: onClose, addSnippet } = useSnippets();

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

  // Close only once the server accepted it; on failure the modal stays open.
  const handleSnippetCreation = async (data) => {
    try {
      await addSnippet(data);
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
        aria-label="Create New Snippet!"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Create New Snippet!</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <CodeInput onSend={ handleSnippetCreation } />
      </div>

    </div>
  );
}
