import React from "react";
import styles from "./Card.module.css";
import CodeBlock from "./CodeBlock"
import fonts from "./Fonts.module.css"
import { Trash2 } from "lucide-react";
import { useSnippets } from "./SnippetsContext";

export default function Card({ id, title, body, language, tags = [] }) {
  const [tagA, tagB] = tags; // expects 2 tags
  const { deleteSnippet } = useSnippets();

  const handleSnippetDeletion = async (id) => {
    await deleteSnippet(id);
  }

  return (
    <div className={styles.card}>
      <div className={ styles.cardHeader }>
        <h3 className={`${fonts.dmSans800} ${fonts.textSize18} ${fonts.whiteText} ${styles.title}`}>{title}</h3>
        <div className={`${fonts.dmSans300} ${fonts.textSize14} ${fonts.grayText} ${styles.tags}`}>
          {tagA && <span className={styles.tag}>{language}</span>}
        </div>
      </div>
      <CodeBlock code={body} />
      {/* <p className={styles.body}>{body}</p>*/}
      <button className={styles.DeleteButton } onClick={() => handleSnippetDeletion(id)}><Trash2 size={16} /></button>
    </div>
  );
}
