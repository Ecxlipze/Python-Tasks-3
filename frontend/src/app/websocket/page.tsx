"use client";
import { useEffect, useRef, useState } from "react";
export default function WebSocketTestPage() {
  const socket = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState("");

  useEffect(() => {
    socket.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/");
    socket.current.onopen = () => {
      console.log("✅ Connected to Django WebSocket");
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);
      setReceived(data.message);
    };

    socket.current.onclose = () => {
      console.log("❌ Disconnected");
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
    return () => {
      socket.current?.close();
    };
  }, []);

  function sendMessage() {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          message: message,
        })
      );
      setMessage("");
    } else {
      console.log("WebSocket is not connected.");
    }
  }
  return (
    <main>
      <h1>WebSocket Broadcast Test</h1>
      <input
        type="text"
        placeholder="Enter message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <h3>Server Response:</h3>
      <p>{received}</p>
    </main>
  );
}