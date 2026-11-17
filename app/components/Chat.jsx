"use client"
import { useState, useEffect } from "react"
import styles from "./Chat.module.css"
import MessageBubble from "./MessageBubble";
import SendInput from "./SendInput";
import { useSnippets } from "./SnippetsContext";

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const [messageID, setMessageID] = useState(0);
  const [loading, setLoading] = useState(false);
  const { refreshSnippets } = useSnippets();

  const incrementID = () => {
    setMessageID(messageID + 1);
  }

  const userSendMessage = (text) => {
    setLoading(true);
    console.log(messageID);

    const msg = {
      "content": text,
      "role": "user",
      "id": messageID
    }
    const updated = [...messages, msg]; // new array: never mutate state in place
    setMessages(updated);
    // incrementID();
    getClaudeResponse(messageID + 1, updated);
    // await incrementID().then(() => aiSendMessage()).catch(console.error());
  }

  const getClaudeResponse = async (nextMessageID, updatedMessages) => {
    try {
        const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      if (!res.ok) throw new Error(`Chat request failed (${res.status})`);
      const data = await res.json();

      // const text = "Here's a reponse!";
      const msg = {
        "content": data.reply,
        "role": "assistant",
        "id": nextMessageID
      }
      // const a = messages;
      // a.push(msg);
      setMessages(prev => [...prev, msg]);
      setMessageID(nextMessageID + 1);
      if (data.snippetsChanged) await refreshSnippets(); // Quax saved or edited a snippet: show it
    }
    catch(err) {
      console.error('Oopsie!', err);
    }
    finally {
      setLoading(false);
    }
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
            type={message.role}
            contents={message.content}
          />
          // ...or spread every field at once (the key must still be set separately):
          // <Item key={item.id} {...item} />
        ))}
        <div className={styles.SendBox}>
          <SendInput placeholder="Type a message" onSend={(text) => handleSend(text)} />
        </div>
      </div>
    </>
  )
};
