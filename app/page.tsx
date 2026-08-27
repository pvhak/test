"use client";

import { useState } from "react";

export default function Home() {
  const [key, skey] = useState("");
  const [result, sresult] = useState("");
  const [loading, sloading] = useState(false);

  async function requestshit() {
    sloading(true);
    sresult("");

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ key, }),
      });

      const data = await response.json();
      sresult(data.result);
    } catch {
      sresult("req failed");
    }
    sloading(false);
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
          width: 350,
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
          onChange={(e) => skey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { requestshit(); }
          }}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={requestshit} disabled={loading}
          style={{ width: "100%", padding: 10, cursor: loading ? "default" : "pointer", }}
        >
          {loading ? "Checking..." : "Enter"}
        </button>

        {result && (
          <p> {result} </p>
        )}
      </div>
    </main>
  );
}
