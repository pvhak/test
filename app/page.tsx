"use client";

import { useState } from "react";

export default function Home() {
  const [key, skey] = useState("");
  const [result, sresult] = useState("");
  const [loading, sloading] = useState(false);

  async function fetchhdata() {
    sloading(true);
    sresult("");

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ key: key, }),
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
        fontFamily: "Cascadia Mono",
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
        <input
          type="text"
          placeholder="ENTER NOWWWWWWWWWWWWWWWWW"
          value={key}
          onChange={(e) => skey(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10, boxSizing: "border-box", }}
        />
        <button
          onClick={fetchhdata}
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            cursor: "pointer",
          }}
        >
          {loading ? "1 sec" : "Enter"}
        </button>

        {result && (
          <p> <strong>{result}</strong> </p>
        )}
      </div>
    </main>
  );
}
