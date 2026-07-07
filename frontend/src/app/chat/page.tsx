"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

export default function ChatPage() {
  const socket = useRef<WebSocket | null>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function loadMessages() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/`
      );

      const data = await response.json();

      setMessages(data);
    }

    loadMessages();

    socket.current = new WebSocket(
      "ws://127.0.0.1:8000/ws/chat/general/"
    );

    socket.current.onopen = () => {
      console.log("✅ Connected to General Room");
    };

    socket.current.onclose = () => {
      console.log("❌ Disconnected");
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  function sendMessage() {
    if (
      socket.current &&
      socket.current.readyState === WebSocket.OPEN &&
      message.trim() !== ""
    ) {
      socket.current.send(
        JSON.stringify({
          message: message,
        })
      );

      setMessage("");
    }
  }

  return (
    <main style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>Team Chat</h1>

      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet...</p>
        ) : (
          messages.map((msg) => (
            <p key={msg.id}>
              <strong>{msg.sender}:</strong> {msg.content}
            </p>
          ))
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          style={{ flex: 1 }}
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage((e.target as HTMLInputElement).value)}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  );
}