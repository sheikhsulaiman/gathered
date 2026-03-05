"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [error, setError] = useState("");

  const validate = () => {
    if (!userName.trim()) {
      setError("Please enter your name.");
      return false;
    }
    setError("");
    return true;
  };

  const createRoom = async () => {
    if (!validate()) return;
    const { nanoid } = await import("nanoid");
    const roomId = nanoid(10);
    router.push(`/room/${roomId}?name=${encodeURIComponent(userName.trim())}`);
  };

  const joinRoom = () => {
    if (!validate()) return;
    if (!roomIdInput.trim()) {
      setError("Please enter a room code.");
      return;
    }
    router.push(
      `/room/${roomIdInput.trim()}?name=${encodeURIComponent(userName.trim())}`,
    );
  };

  return (
    <main className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary-content"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Gathered</h1>
          <p className="text-base-content/60 mt-2 text-sm">
            Simple, fast group video calls
          </p>
        </div>

        {/* Card */}
        <div className="card bg-base-200 shadow-xl border border-base-300">
          <div className="card-body gap-4">
            {/* Name input */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">
                  Your Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter your display name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && mode === "join"
                    ? joinRoom()
                    : mode === "create"
                      ? createRoom()
                      : null
                }
                className="input input-bordered w-full bg-base-100"
                maxLength={30}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error py-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Mode selection */}
            {!mode && (
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => setMode("create")}
                  className="btn btn-primary w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create a Room
                </button>
                <div className="divider text-xs text-base-content/40 my-0">
                  OR
                </div>
                <button
                  onClick={() => setMode("join")}
                  className="btn btn-outline w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                  </svg>
                  Join a Room
                </button>
              </div>
            )}

            {/* Create mode */}
            {mode === "create" && (
              <div className="flex flex-col gap-3 mt-2">
                <button onClick={createRoom} className="btn btn-primary w-full">
                  Start Meeting
                </button>
                <button
                  onClick={() => {
                    setMode(null);
                    setError("");
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Join mode */}
            {mode === "join" && (
              <div className="flex flex-col gap-3 mt-2">
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm">
                      Room Code
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Paste room code here"
                    value={roomIdInput}
                    onChange={(e) => {
                      setRoomIdInput(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                    className="input input-bordered w-full bg-base-100 font-mono"
                  />
                </div>
                <button onClick={joinRoom} className="btn btn-primary w-full">
                  Join Meeting
                </button>
                <button
                  onClick={() => {
                    setMode(null);
                    setError("");
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-base-content/30 mt-6">
          No account needed · End-to-end WebRTC · Up to 8 participants
        </p>
      </div>
    </main>
  );
}
