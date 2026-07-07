"use client";
import { useEffect, useRef, useState } from "react";
type Note = {
  id: number;
  title: string;
  content: string;
  workspace: number;
  workspace_name: string;
};
export default function NotesPage() {
  const socket = useRef<WebSocket | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isEditing = useRef(false);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNote();
  }, []);

  useEffect(() => {
    if (!note) return;

    socket.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/notes/${note.workspace}/`
    );

    socket.current.onopen = () => {
      console.log("✅ Connected");
    };

    socket.current.onmessage = (event) => {
      if (isEditing.current) return;
      const data = JSON.parse(event.data);

      setNote((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          title: data.title,
          content: data.content,
        };
      });
    };
    socket.current.onclose = () => {
      console.log("❌ Disconnected");
    };

    return () => socket.current?.close();
  }, [note?.workspace]);

  async function loadNote() {
    const token = localStorage.getItem("access");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notes/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (data.length > 0) {
      setNote(data[0]);
    }

    setLoading(false);
  }

  async function saveNote(updatedNote: Note) {
    try {
      setSaving(true);
      const token = localStorage.getItem("access");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notes/${updatedNote.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: updatedNote.title,
            content: updatedNote.content,
            workspace: updatedNote.workspace,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);

      setTimeout(() => {
        isEditing.current = false;
      }, 200);
    }
  }

  function debounceSave(updatedNote: Note) {
    isEditing.current = true;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      saveNote(updatedNote);
    }, 500);
  }

  function updateTitle(value: string) {
    if (!note) return;

    const updatedNote = {
      ...note,
      title: value,
    };

    setNote(updatedNote);
    debounceSave(updatedNote);
  }

  function updateContent(value: string) {
    if (!note) return;

    const updatedNote = {
      ...note,
      content: value,
    };

    setNote(updatedNote);
    debounceSave(updatedNote);
  }

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>No notes found.</p>;

  return (
    <main style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>Shared Notes</h1>
      <p>
        <strong>Workspace:</strong> {note.workspace_name}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {saving ? "Saving..." : "✅ All changes saved"}
      </p>
      <input
        value={note.title}
        onChange={(e) => updateTitle(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 20,
          fontSize: 18,
        }}
      />
      <textarea
        value={note.content}
        onChange={(e) => updateContent(e.target.value)}
        style={{
          width: "100%",
          height: 300,
          padding: 10,
          fontSize: 16,
        }}
      />
      <br />
      <br />
      <button onClick={() => saveNote(note)}>
        Save Now
      </button>
    </main>
  );
}