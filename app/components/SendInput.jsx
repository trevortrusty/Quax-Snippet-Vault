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

  const onKeyDown = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSubmit(event);
    }
  }

  return (
    <form className={`${styles.form} ${fonts.dmSans300}`} onSubmit={handleSubmit}>
      <textarea
        className={styles.input}
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
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
