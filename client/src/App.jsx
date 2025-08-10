import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { fetchConversations } from "./api";
import "./App.css";

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function loadConversations() {
    const data = await fetchConversations();
    setConversations(data);
  }

  useEffect(() => {
    loadConversations();
  }, []);

  const selectedContact = conversations.find(
    (c) => c.contact.phone === selectedPhone
  );

  return (
    <div className="app flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isMobileView ? (selectedPhone ? "hidden" : "flex") : "flex"
        } w-full md:w-[320px] `}
      >
        <Sidebar
          conversations={conversations}
          onSelect={(phone) => setSelectedPhone(phone)}
          selectedPhone={selectedPhone}
        />
      </div>

      {/* ChatWindow */}
      <div
        className={`${
          isMobileView ? (selectedPhone ? "flex" : "hidden") : "flex"
        } flex-1`}
      >
        {selectedPhone ? (
          <ChatWindow
            phone={selectedPhone}
            contactName={selectedContact?.contact.name || ""}
            onBack={() => setSelectedPhone(null)}
          />
        ) : (
          <div className="flex items-center justify-center w-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
