"use client"
import styles from "./MessageBubble.module.css"

export default function MessageBubble({type, contents}) {
  return (
    <>
      {
        type == "sender" ?
          <div className={`${styles.Sender} ${styles.Bubble}`}>
            <p>{contents}</p>
          </div>
          :
          <div className={`${styles.Receiver} ${styles.Bubble}`}>
            <p>{contents}</p>
          </div>
      }

    </>
  )
}
