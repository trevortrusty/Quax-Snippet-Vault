"use client"
import styles from "./CodeInput.module.css"
import fonts from "./Fonts.module.css"

// Just the code box. The parent owns the value (and the title, language and submitting).
export default function CodeInput({ value, onChange, disabled = false }) {
  return (
    <textarea
      id={"code"}
      name={"code"}
      className={`${styles.textarea} ${fonts.dmSans300}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={"Type your code here"}
      aria-label={"Code"}
      rows={10}
      disabled={disabled}
    />
  );
}
