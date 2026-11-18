"use client"
import { useState } from "react";
import styles from "./SendInput.module.css"
import fonts from "./Fonts.module.css"

export default function SendInput({ onSend, placeholder = "Type here...", disabled = false }) {
  const [text, setText] = useState("");

  const handleSubmit = async (event) => {
    // Prevent submission if user is in the middle of an unclosed fenced code block
    // let codeBlockToken = "```";
    // let occurrences = text.split(codeBlockToken).length - 1;
    // let openCodeBlock = occurrences % 2 != 0;

    // if (!openCodeBlock) {
      // Handle submission by button press, or enter press
      event.preventDefault();
      const value = text.trim();
      if (!value || disabled) return;
      setText("");
      await onSend?.(value);
    // }

  };

  const onKeyDown = async (event) => {
    // if (event.key === "`") {
    //   if (backtickCount < 3) {
    //     incBacktickCount();
    //   }
    // }
    //
    // Check if user is writing a code block, and hasn't typed a closing fence
    // If there's an odd number of fences, user has an unfinished code block.
    // Unfinished close block = don't submit on "Enter" press.
    let fenceToken = "```";
    let occurrences = text.split(fenceToken).length - 1;
    let openCodeBlock = (occurrences % 2) !== 0;

    // TODO: add openCodeBlock condition to below if statement
    if (event.key === "Enter" && !event.shiftKey && !openCodeBlock) {
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
