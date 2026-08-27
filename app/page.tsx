"use client";

import { useState } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyKey() {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: key,
        }),
      });

      const data = await response.json();

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult("Request failed: " + String(error));
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 500,
          padding: 30,
          border: "1px solid #ddd",
          borderRadius: 12,
        }}
      >
        <h1>Test Key</h1>

        <input
          type="text"
          placeholder="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={verifyKey}
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            cursor: "pointer",
          }}
        >
          {loading ? "8" : "Enter"}
        </button>

        {result && (
          <pre
            style={{
              marginTop: 20,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}
