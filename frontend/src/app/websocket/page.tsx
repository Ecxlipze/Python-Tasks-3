"use client";

import { useEffect, useRef, useState } from "react";
export default function WebSocketTestPage() {
  const socket = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState("");

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080");
    socket.current.onopen = () => {
      console.log("Connected to WebSocket Server");
    };
    socket.current.onmessage = (event) => {
      console.log("Received:", event.data);
      setReceived(event.data);
    };
    socket.current.onclose = () => {
      console.log("Disconnected");
    };
    return () => {
      socket.current?.close();
    };
  }, []);

  function sendMessage() {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(message);
      setMessage("");
    }
  }
  return (
    <main>
      <h1>WebSocket Echo Test</h1>
      <input
        type="text"
        placeholder="Enter message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>
        Send
      </button>
      <h3>Server Response:</h3>
      <p>{received}</p>
    </main>
  );
}