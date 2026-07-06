"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { isAuthenticated, logout } from "@/lib/auth";

type User = {
  id: number;
  username: string;
  email: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  useEffect(() => {
    async function loadProfile() {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      const response = await apiFetch("/api/profile/");
      const data = await response.json();

      setUser(data);
    }

    loadProfile();
  }, [router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Profile</h1>

      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}