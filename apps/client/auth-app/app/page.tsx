"use client";
import { SignInForm } from "@robust-monorepo-yarn-nx-changesets/sign-in-form";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1234";

export default function Home() {
  const handleSubmit = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/signIn`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      alert("Sign in successful");
      return;
    }

    if (response.status === 422) {
      alert("Sign in failed: " + (await response.text()));
      return;
    }

    alert("Sign in failed");
  };

  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center">
      <SignInForm onSubmit={handleSubmit} />
    </div>
  );
}
