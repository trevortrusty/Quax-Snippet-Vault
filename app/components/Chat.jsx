"use client"
import { useState, useEffect } from "react"
import styles from "./Chat.module.css"
import MessageBubble from "./MessageBubble";
import SendInput from "./SendInput";
import { useSnippets } from "./SnippetsContext";
import markdown from "./Markdown.module.css"
import { Parser } from 'commonmark';

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const [messageID, setMessageID] = useState(0);
  const [loading, setLoading] = useState(false);
  const { refreshSnippets } = useSnippets();

  const parser = new Parser();

  const markdownToJSX = (input) => {
    const ast = parser.parse(input);
    const walker = ast.walker();
    let event;
    let key = 0;
    const stack = [[]];
    while ((event = walker.next())) {
      const { node, entering } = event;

      switch (node.type) {
        case "heading":
          if (entering) {
            stack.push([]);
          } else {
            const Tag = `h${ node.level }`;
            const children = stack.pop();
            stack[stack.length - 1].push(
              <Tag key={key++} className={markdown[`heading${node.level}`]} > {children}</Tag>
            );
          }
          break;

        case "paragraph":
          if (entering) {
            stack.push([]);
          } else {
            const children = stack.pop();
            stack[stack.length - 1].push(
              <p key={key++} className={markdown.plain}>{children}</p>
            );
          }
          break;

        case "strong":
          if (entering) {
            stack.push([]);
          } else {
            const children = stack.pop();
            stack[stack.length - 1].push(
              <strong key={key++} className={markdown.bold}>{children}</strong>
            );
          }
          break;

        case "emph":
          if (entering) {
            stack.push([]);
          } else {
            const children = stack.pop();
            stack[stack.length - 1].push(
              <em key={key++} className={markdown.bold}>{children}</em>
            );
          }
          break;

        case "text":
          // node.literal holds the text
          stack[stack.length - 1].push(node.literal);
          break;

        case "code":
          // inline `code`, node.literal holds the contents
          stack[stack.length - 1].push(
            <code key={key++} className={markdown.codeInline}>{node.literal}</code>
          );
          break;

        case "code_block":
          // node.literal is the code, node.info is the language (e.g. "cpp")
          stack[stack.length - 1].push(
            <div key={key++} className={markdown.codeBlock}><pre className={markdown.pre}>{node.literal}</pre></div>
          );
          break;

        case "link":
          // node.destination is the URL, node.title is the title
          // TODO
          if (entering) {
            stack.push([]);
          } else {
            const children = stack.pop();
            stack[stack.length - 1].push(
              <a key={key++} className={markdown.link} href={node.destination} title={ node.title }>{ children }</a>
            );
          }
          break;

        case "list":
          if (entering) {
            stack.push([]);
          } else {
            const children = stack.pop();
            const Tag = node.listType === "bullet" ? `ul` : `ol`
            const Class = node.listType === "bullet" ? markdown.unorderedList : markdown.orderedList;

            stack[stack.length - 1].push(
              <Tag className={ Class } key={key++}>
                {children}
              </Tag>
            );
          }
          break;

          case "item":
            if (entering) {
              stack.push([]);
            } else {
              const children = stack.pop();
              stack[stack.length - 1].push(
                <li className={markdown.listItem} key={key++}>
                  {children}
                </li>
              );
            }
            break;

        case "softbreak":
          stack[stack.length - 1].push(" ");
          break;

        case "linebreak":
          stack[stack.length - 1].push(<br key={ key++ } />);
          break;

        default:
          break;
      }
    }
    return stack[0];
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
          >
          {markdownToJSX(message.content)}
          </MessageBubble>
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
