"use client";

type Props = {
  rooms: string[];
  currentRoom: string;
  onSelectRoom: (room: string) => void;
};

export default function RoomList({
  rooms,
  currentRoom,
  onSelectRoom,
}: Props) {
  return (
    <aside
      style={{
        width: "220px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
      }}
    >
      <h3>Chat Rooms</h3>

      {rooms.map((room) => (
        <button
          key={room}
          onClick={() => onSelectRoom(room)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background:
              room === currentRoom
                ? "#2563eb"
                : "#f3f4f6",
            color:
              room === currentRoom
                ? "#fff"
                : "#000",
          }}
        >
          #{room}
        </button>
      ))}
    </aside>
  );
}