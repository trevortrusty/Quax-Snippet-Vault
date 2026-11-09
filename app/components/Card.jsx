import React from "react";
import styles from "./Card.module.css";
import CodeBlock from "./CodeBlock"
import fonts from "./Fonts.module.css"

export default function Card({ title, body, tags = [] }) {
  const [tagA, tagB] = tags; // expects 2 tags

  return (
    <div className={styles.card}>
      <div className={ styles.cardHeader }>
        <h3 className={`${fonts.dmSans800} ${fonts.textSize18} ${fonts.whiteText} ${styles.title}`}>{title}</h3>
        <div className={`${fonts.dmSans300} ${fonts.textSize14} ${fonts.grayText} ${styles.tags}`}>
          {tagA && <span className={styles.tag}>{tagA}</span>}
          {tagB && <span className={styles.tag}>{tagB}</span>}
        </div>
      </div>
      <CodeBlock code={body} />
      {/* <p className={styles.body}>{body}</p>*/}

    </div>
  );
}
