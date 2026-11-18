"use client"
import styles from "./MessageBubble.module.css"
import fonts from "./Fonts.module.css"

export default function MessageBubble({type, contents, children}) {
  return (
    <>
      {
        type == "user" ?
          <div className={`${styles.User} ${styles.Bubble} ${fonts.dmSans300} `}>
            <div>{children}</div>
          </div>
          :
          <div className={`${styles.Assistant} ${styles.Bubble} ${fonts.dmSans300}`}>
            <div>{children}</div>
          </div>
      }

    </>
  )
}
