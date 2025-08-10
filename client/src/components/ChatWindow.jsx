import React, { useState, useEffect, useRef } from "react";
import { fetchMessages, sendMessage } from "../api";
import { Check, CheckCheck, Clock, ArrowLeft } from "lucide-react";

export default function ChatWindow({ phone, contactName, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    if (!phone) return;

    setMessages([]);

    (async () => {
      const msgs = await fetchMessages(phone);
      setMessages(msgs);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    })();
  }, [phone]);

  async function onSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const newMsg = await sendMessage(phone, text);

  
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });

    setText("");
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-4 h-4 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center">
          <div>
              <button
          onClick={onBack}
          className="md:hidden mr-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
           <ArrowLeft className="w-6 h-6" />
        </button>
           
          </div>

          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {(contactName || "U").charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{contactName}</h2>
            <p className="text-sm text-gray-500">{phone}</p>
          </div>
        </div>
      </div>
      <div className="messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={"bubble " + (m.type === "outgoing" ? "me" : "them")}
          >
            <div className="text">{m.text}</div>
            <div className="meta flex justify-end">
              <span className="time">
                {new Date(m.timestamp * 1000).toLocaleString()}
              </span>
              {m.type === "outgoing" && m.status && (
                // <span className="status"> • {m.status}</span>
                <span className="status ms-1"> {getStatusIcon(m.status)}</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="composer" onSubmit={onSend}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
