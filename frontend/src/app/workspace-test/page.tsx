"use client";

import { useEffect } from "react";

export default function WorkspaceTestPage() {
  useEffect(() => {
    const token = localStorage.getItem("access");

    console.log("JWT:", token);

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/workspaces/1/?token=${token}`
    );

    socket.onopen = () => {
      console.log("✅ Connected");
    };

    socket.onclose = () => {
      console.log("❌ Disconnected");
    };

    socket.onerror = (e) => {
      console.log("WebSocket Error", e);
    };

    return () => socket.close();
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Workspace Test</h1>
      <p>Open Django terminal and browser console.</p>
    </main>
  );
}