"use client"
// One place for everything about snippets: the list, and the "Add snippet" modal.
//   <SnippetsProvider> wraps the app once (see App.jsx).
//   useSnippets() gives any component below it:
//     snippets                the cards to show
//     modalOpen               is the snippet modal showing?
//     modalSnippet            the snippet being edited, or null when the modal is creating a new one
//     openModal(snippet?)     show the modal (pass a snippet to edit it) / closeModal hides it
//     addSnippet(data)        POST a new snippet, then add it to `snippets` (no reload needed)
//     editSnippet(id, data)   PATCH a snippet, then swap the updated one into `snippets`
//     refreshSnippets()       re-fetch the list from the server
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const SnippetsContext = createContext(null);

async function fetchSnippets() {
  const res = await fetch("/api/snippets");
  if (!res.ok) throw new Error(`Request failed (${res.status})`); // fetch doesn't throw on 4xx/5xx
  return res.json();
}

export function SnippetsProvider({ children }) {
  const [snippets, setSnippets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSnippet, setModalSnippet] = useState(null);
  const [languageFilter, setLanguageFilter] = useState("all");

  // Load the list once on mount.
  useEffect(() => {
    fetchSnippets().then(setSnippets).catch(console.error);
  }, []);

  // Re-fetch the whole list. For anything that changes snippets behind the context's back
  // (e.g. the chat, when Quax saves one).
  const refreshSnippets = useCallback(async () => {
    try {
      setSnippets(await fetchSnippets());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const openModal = useCallback((snippet = null) => {
    setModalSnippet(snippet);
    setModalOpen(true);
  }, []);
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

  // Resolves with the updated snippet; throws if the server rejects it.
  const editSnippet = useCallback(async (id, data) => {
    const res = await fetch(`/api/snippets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const updated = await res.json();
    setSnippets((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

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

  const filterLanguage = useCallback((lang) => {
    setLanguageFilter(lang);
  }, []);


  const value = useMemo(
    () => ({ snippets, modalOpen, modalSnippet, openModal, closeModal, addSnippet, editSnippet, deleteSnippet, refreshSnippets, languageFilter, filterLanguage}),
    [snippets, modalOpen, modalSnippet, openModal, closeModal, addSnippet, editSnippet, deleteSnippet, refreshSnippets, languageFilter, filterLanguage]
  );

  return <SnippetsContext.Provider value={value}>{children}</SnippetsContext.Provider>;
}

export function useSnippets() {
  const ctx = useContext(SnippetsContext);
  if (!ctx) throw new Error("useSnippets must be used inside <SnippetsProvider>");
  return ctx;
}
