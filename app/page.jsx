"use client"

import Card from "./components/Card"
import styles from "./components/page.module.css"
import { useState, useEffect } from 'react';

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [refetch, setRefetch] = useState(false);


  useEffect(() => {
    fetch("/api/snippets")
      .then((data) => data.json())
      .then((data) => {
        setSnippets(data);
      });
  }, [refetch]);

  return (
    <div className={styles.cards}>
      {snippets.map((snippet) => (
        <Card key={snippet.id}  title={snippet.title} body={snippet.code} tags={snippet.tags} />
      ))}
    </div>
  );
}
