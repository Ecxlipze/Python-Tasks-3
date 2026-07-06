type MessageListProps = {
  messages: string[];
};
export default function MessageList({ messages }: MessageListProps) {
  return (
    <div>
      <h2>Messages</h2>
    <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}