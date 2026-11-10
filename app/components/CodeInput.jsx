"use client"
import { useState } from "react";
import styles from "./CodeInput.module.css"
import fonts from "./Fonts.module.css"

export default function CodeInput({ onSend, placeholder = "Type here...", disabled = false }) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const s_title = title.trim();
    const s_code = code.trim();
    const s_lang = lang.trim();
    if (!s_title || !s_code ||!s_lang || disabled) return;
    setTitle("");
    setCode("");
    setLang("");
    const ret = {
      "title": s_title,
      "code": s_code,
      "language": s_lang
    }
    await onSend?.(ret);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <form className={`${styles.form} ${fonts.dmSans300}`} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={"Snippet Title"}
        aria-label={"Snippet Title"}
        disabled={disabled}
      />
      <input
        className={styles.input}
        type="text"
        value={lang}
        onChange={(event) => setLang(event.target.value)}
        placeholder={"Language"}
        aria-label={"Language"}
        disabled={disabled}
      />
      <textarea
        id={"code"}
        name={"code"}                 // the key used when the form is submitted
        className={styles.textarea}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"Type your code here"}
        rows={10}
        maxLength={100}       // the browser stops typing at this limit
      />
      <button className={styles.button} type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );

}
