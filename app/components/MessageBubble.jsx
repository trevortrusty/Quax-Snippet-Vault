"use client"
import styles from "./MessageBubble.module.css"
import fonts from "./Fonts.module.css"

export default function MessageBubble({type, contents}) {
  return (
    <>
      {
        type == "sender" ?
          <div className={`${styles.Sender} ${styles.Bubble} ${fonts.dmSans300} `}>
            <p>{contents}</p>
          </div>
          :
          <div className={`${styles.Receiver} ${styles.Bubble} ${fonts.dmSans300}`}>
            <p>{contents}</p>
          </div>
      }

    </>
  )
}
