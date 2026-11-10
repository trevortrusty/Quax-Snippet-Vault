"use client"
// One place for everything about snippets: the list, and the "Add snippet" modal.
//   <SnippetsProvider> wraps the app once (see App.jsx).
//   useSnippets() gives any component below it:
//     snippets                the cards to show
//     modalOpen               is the Add Snippet modal showing?
//     openModal/closeModal    show / hide the modal
//     addSnippet(data)        POST a new snippet, then add it to `snippets` (no reload needed)
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const SnippetsContext = createContext(null);

export function SnippetsProvider({ children }) {
  const [snippets, setSnippets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Load the list once on mount.
  useEffect(() => {
    fetch("/api/snippets")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`); // fetch doesn't throw on 4xx/5xx
        return res.json();
      })
      .then(setSnippets)
      .catch(console.error);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  // Resolves with the created snippet; throws if the server rejects it.
  const addSnippet = useCallback(async (data) => {
    const res = await fetch("/api/snippets", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // without this the server can't read the JSON body
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const created = await res.json();
    setSnippets((prev) => [...prev, created]);
    return created;
  }, []);

  // Resolves with the created snippet; throws if the server rejects it.
  const deleteSnippet = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });

      // fetch doesn't throw on 404/500, so check res.ok yourself
      if (!res.ok) {
        const data = await res.json().catch(() => null);   // error body may be empty
        throw new Error(data?.error || `Delete failed (${res.status})`);
      }
      // A successful DELETE often returns 204 (no body), so don't call res.json() on success.

      setSnippets((prev) => prev.filter((item) => item.id !== id));   // remove it from the screen
    } catch (err) {
      console.error(err);   // or show the message in the UI
    }
  }, []);

  const value = useMemo(
    () => ({ snippets, modalOpen, openModal, closeModal, addSnippet, deleteSnippet }),
    [snippets, modalOpen, openModal, closeModal, addSnippet, deleteSnippet]
  );

  return <SnippetsContext.Provider value={value}>{children}</SnippetsContext.Provider>;
}

export function useSnippets() {
  const ctx = useContext(SnippetsContext);
  if (!ctx) throw new Error("useSnippets must be used inside <SnippetsProvider>");
  return ctx;
}
