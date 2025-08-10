import React from "react";

export default function Sidebar({ conversations, onSelect, selectedPhone }) {
  return (
    <div className="sidebar">
      <div className="header bg-[#25d366] text-white">WhatsApp Business</div>
      <div className="list">
        {conversations.map((c) => {
          const lastMsg = c.messages?.[0];
          return (
            <div
              key={c.contact.phone}
              className={
                "chat-item " +
                (selectedPhone === c.contact.phone ? "active" : "")
              }
              onClick={() => onSelect(c.contact.phone)}
            >
              <div className="avatar">{(c.contact.name || "U").charAt(0)}</div>
              <div className="meta">
                <div className="name">{c.contact.name}</div>
                <div className="last">{lastMsg?.text || ""}</div>
              </div>
              <div className="time">
                {lastMsg?.timestamp
                  ? new Date(lastMsg.timestamp * 1000).toLocaleTimeString()
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
