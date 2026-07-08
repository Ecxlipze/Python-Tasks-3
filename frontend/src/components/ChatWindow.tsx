"use client";

import { useEffect, useRef, useState } from "react";

export type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

type Props = {
  room: string;
};

export default function ChatWindow({
  room,
}: Props) {
  const socket = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadMessages(room);

    const token = localStorage.getItem("access");

    socket.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${room}/?token=${token}`
    );

    socket.current.onopen = () => {
      console.log(`✅ Connected to ${room}`);
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
      console.log(`❌ Left ${room}`);
    };

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

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        height: "450px",
        overflowY: "auto",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      {messages.length === 0 ? (
        <p>No messages yet...</p>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: "12px",
            }}
          >
            <strong>{message.sender}</strong>

            <div>{message.content}</div>
          </div>
        ))
      )}
    </div>
  );
}