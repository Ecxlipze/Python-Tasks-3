import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import MessageList from "@/components/MessageList";
export default function Home() {
  const messages = [
    "Welcome to the Team Chat!",
    "Workbook 3 Started!",
    "Django Backend Coming Soon!",
    "WebSockets Coming Next!",
  ];
  return (
    <main>
      <h1>Real-Time Collaboration Platform</h1>
    <Sidebar />
      <hr />
      <MessageList messages={messages} />
      <hr />
      <nav>
        <Link href="/login">Login</Link>
        <br />
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </main>
  );
}