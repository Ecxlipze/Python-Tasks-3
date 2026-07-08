"use client";

import { useEffect, useRef, useState } from "react";

type Presence = {
  id: number;
  username: string;
  online: boolean;
  last_seen: string;
};

type Props = {
  workspaceId: number;
};

export default function WorkspacePresence({
  workspaceId,
}: Props) {
  const socket = useRef<WebSocket | null>(null);

  const [users, setUsers] = useState<Presence[]>([]);

  useEffect(() => {
    loadPresence();

    const token = localStorage.getItem("access");

    socket.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/workspaces/${workspaceId}/?token=${token}`
    );

    socket.current.onopen = () => {
      console.log("✅ Workspace Presence Connected");
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type !== "presence") return;

      setUsers(data.users);
    };

    socket.current.onclose = (event) => {
      console.log(
        `❌ Workspace Presence Disconnected (Code: ${event.code})`
      );
    };

    socket.current.onerror = (event) => {
      console.error("Workspace Presence Error:", event);
    };

    return () => {
      if (socket.current) {
        socket.current.onopen = null;
        socket.current.onmessage = null;
        socket.current.onerror = null;
        socket.current.onclose = null;

        if (
          socket.current.readyState === WebSocket.OPEN ||
          socket.current.readyState === WebSocket.CONNECTING
        ) {
          socket.current.close();
        }
      }
    };
  }, [workspaceId]);

  async function loadPresence() {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/${workspaceId}/presence/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load workspace presence");
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h3>Workspace Members</h3>

      {users.length === 0 ? (
        <p>No members found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <span>{user.online ? "🟢" : "⚪"}</span>

            <span>{user.username}</span>
          </div>
        ))
      )}
    </div>
  );
}