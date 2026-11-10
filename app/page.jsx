"use client"

import Card from "./components/Card"
import styles from "./page.module.css"
import { useSnippets } from "./components/SnippetsContext";

// The list itself is loaded and kept up to date by <SnippetsProvider>.
export default function Home() {
  const { snippets } = useSnippets();

  return (
    <div className={styles.cards}>
      {snippets.map((snippet) => (
        <Card key={snippet.id}  title={snippet.title} body={snippet.code} tags={snippet.tags} />
      ))}
    </div>
  );
}
