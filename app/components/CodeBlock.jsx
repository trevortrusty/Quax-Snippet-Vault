// Usage: <CodeBlock language="js" code={`const a = 1;`} />
import styles from "./CodeBlock.module.css";

export default function CodeBlock({ code = "", language = "text" }) {
  return (
    <pre className={styles.pre}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
