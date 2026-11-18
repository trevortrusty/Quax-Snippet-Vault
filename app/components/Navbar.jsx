"use client"
import styles from "./App.module.css";
import fonts from "./Fonts.module.css";
import { Plus } from "lucide-react";
import { useSnippets } from "./SnippetsContext";
import { useState } from "react";
// Top bar of the right-hand section. The button opens the Add Snippet modal.
export default function Navbar() {
  const { openModal, languageFilter, filterLanguage } = useSnippets();
  // const [langChoice, setLangChoice] = useState("None");

  return (
    <header className={styles.navbar}>
      <span className={`${fonts.dmSans800} ${fonts.textSize18} ${fonts.whiteText}`}>Snippet Vault</span>

      <select value={languageFilter} onChange={(e) => filterLanguage(e.target.value)}>
        <option value="all">All Languages</option>
        <option value="jsx">JSX</option>
        <option value="cpp">cpp</option>
        <option value="tsx">TSX</option>
        <option value="css">CSS</option>
      </select>

      <button type="button" className={styles.button} onClick={() => openModal()}>
        <Plus size={25} className={styles.AddButton}/>
      </button>
    </header>
  );
}
