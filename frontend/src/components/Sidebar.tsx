"use client";
import { useState } from "react";
import Link from "next/link";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <aside>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide Sidebar" : "Show Sidebar"}
      </button>
      {isOpen && (
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
      )}
    </aside>
  );
}