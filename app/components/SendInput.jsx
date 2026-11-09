"use client"
import { useState } from "react";
import styles from "./SendInput.module.css"
import fonts from "./Fonts.module.css"

export default function SendInput({ onSend, placeholder = "Type here...", disabled = false }) {
  const [text, setText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || disabled) return;
    setText("");
    await onSend?.(value);
  };

  return (
    <form className={`${styles.form} ${fonts.dmSans300}`} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={disabled}
      />
      <button className={styles.button} type="submit" disabled={disabled || !text.trim()}>
        Send
      </button>
    </form>
  );

}
