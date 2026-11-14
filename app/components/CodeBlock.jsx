// Usage: <CodeBlock language="js" code={`const a = 1;`} />
import styles from "./CodeBlock.module.css";

export default function CodeBlock({ code = "", language = "text" }) {

  const handleClickToCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    }
    catch (err) {
      console.error("Copy operation unsuccessful", err);
    }
  }

  return (
    <div className={styles.clickToCopyField}>
      <pre
        onClick={handleClickToCopy}
        className={styles.pre}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
