"use client"
import styles from "./App.module.css";
import fonts from "./Fonts.module.css";
import { useSnippets } from "./SnippetsContext";

// Top bar of the right-hand section. The button opens the Add Snippet modal.
export default function Navbar() {
  const { openModal } = useSnippets();

  return (
    <header className={styles.navbar}>
      <span className={`${fonts.dmSans800} ${fonts.textSize18} ${fonts.whiteText}`}>Snippet Vault</span>
      <button type="button" className={styles.button} onClick={openModal}>
        Add snippet
      </button>
    </header>
  );
}
