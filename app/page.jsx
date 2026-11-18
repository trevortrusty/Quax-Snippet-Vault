"use client"

import Card from "./components/Card"
import styles from "./page.module.css"
import { useSnippets } from "./components/SnippetsContext";
import { useState } from "react";

// The list itself is loaded and kept up to date by <SnippetsProvider>.
export default function Home() {
  const { snippets, languageFilter } = useSnippets();
  const [filter, setFilter] = useState("jsx");

  return (
    <div className={styles.cards}>
      {
        languageFilter === "all" ?
        snippets
        .map((snippet) => (
          <Card key={snippet.id} id={snippet.id} title={snippet.title} body={snippet.code} language={snippet.language} tags={snippet.tags} />
        ))
          :
        snippets
        .filter((snippet) => snippet.language === languageFilter)
        .map((snippet) => (
          <Card key={snippet.id} id={snippet.id} title={snippet.title} body={snippet.code} language={snippet.language} tags={snippet.tags} />
        ))
      }

    </div>
  );
}
