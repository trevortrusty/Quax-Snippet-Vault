"use client"
import { useState, useEffect } from "react"
import styles from "./Chat.module.css"
import MessageBubble from "./MessageBubble";
import SendInput from "./SendInput";

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const [messageID, setMessageID] = useState(0);

  const incrementID = () => {
    setMessageID(messageID + 1);
  }

  const userSendMessage = (text) => {
    console.log(text);
    const msg = {
      "content": text,
      "author": "sender",
      "id": messageID
    }
    const a = messages;
    a.push(msg);
    setMessages(a);
    incrementID();
  }

  const aiSendMessage = () => {

  }

  const handleSend = (text) => {
    userSendMessage(text);
  }



  return (
    <>
      <div className={styles.ChatHistory}>
        {/* <MessageBubble type={"sender"} />
        <MessageBubble type={"receiver"}/>
        <MessageBubble type={"sender"} />
        <MessageBubble type={"receiver"} />
        <MessageBubble type={"sender"} />
        <MessageBubble type={"receiver"} />
        <MessageBubble type={"sender"} />
        <MessageBubble type={"receiver"}/>*/}

        {messages.map((message) => (
          // key: required, and must be unique and stable per item.
          // Use a real id from your data. Don't use the array index if the list can be
          // reordered, filtered or edited, or React will mix up the items.
          // It goes on the outermost element returned inside map().
          <MessageBubble
            key={message.id}
            type={message.author}
            contents={message.content}
          />
          // ...or spread every field at once (the key must still be set separately):
          // <Item key={item.id} {...item} />
        ))}
      </div>
      <div className={styles.SendBox}>
        <SendInput placeholder="Type a message" onSend={(text) => handleSend(text)} />
      </div>
    </>
  )
};
