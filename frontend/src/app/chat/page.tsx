"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

const ROOMS = ["general", "backend", "random"];

export default function ChatPage() {
  const socket = useRef<WebSocket | null>(null);
  const notificationSocket = useRef<WebSocket | null>(null);

  const [room, setRoom] = useState("general");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Notification socket (connect once)
  useEffect(() => {
    const token = localStorage.getItem("access");

    notificationSocket.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
    );

    notificationSocket.current.onopen = () => {
      console.log("🔔 Notification socket connected");
    };

    notificationSocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type !== "notification") return;

      alert(
        ` New message in #${data.room}\n\n${data.sender}: ${data.message}`
      );
    };

    notificationSocket.current.onclose = () => {
      console.log("Notification socket disconnected");
    };

    return () => {
      notificationSocket.current?.close();
    };
  }, []);

  // Chat socket (changes when room changes)
  useEffect(() => {
    connectToRoom(room);

    return () => {
      socket.current?.close();
    };
  }, [room]);

  async function loadMessages(selectedRoom: string) {
    const token = localStorage.getItem("access");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/messages/?room=${selectedRoom}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) return;

    const data = await response.json();

    setMessages(data.reverse());
  }

  function connectToRoom(selectedRoom: string) {
    socket.current?.close();

    loadMessages(selectedRoom);

    const token = localStorage.getItem("access");

    socket.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${selectedRoom}/?token=${token}`
    );

    socket.current.onopen = () => {
      console.log(`✅ Connected to ${selectedRoom}`);
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: data.sender,
          content: data.message,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    socket.current.onclose = () => {
      console.log(`❌ Disconnected from ${selectedRoom}`);
    };
  }

  function sendMessage() {
    if (
      socket.current &&
      socket.current.readyState === WebSocket.OPEN &&
      message.trim() !== ""
    ) {
      socket.current.send(
        JSON.stringify({
          message,
        })
      );

      setMessage("");
    }
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        display: "flex",
        gap: "20px",
      }}
    >
      <aside
        style={{
          width: "220px",
          border: "1px solid #ccc",
          padding: "15px",
        }}
      >
        <h3>Rooms</h3>

        {ROOMS.map((r) => (
          <button
            key={r}
            onClick={() => setRoom(r)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "10px",
              padding: "10px",
              background: room === r ? "#0070f3" : "#f5f5f5",
              color: room === r ? "white" : "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            #{r}
          </button>
        ))}
      </aside>

      <section style={{ flex: 1 }}>
        <h1>Team Chat</h1>

        <h3>Current Room: #{room}</h3>

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
                <strong>{msg.sender}</strong>: {msg.content}
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${room}`}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </section>
    </main>
  );
}