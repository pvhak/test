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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
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
        background: "#000",
        color: "#fff",
        fontFamily: '"Cascadia Mono", monospace',
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "16px",
          boxSizing: "border-box",

          background: "#111",
          border: "1px solid #333",
          borderRadius: "14px",

          display: "flex",
          gap: "10px",

          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        }}
      >
        <input
          type="text"
          placeholder="enter here baka"
          value={key}
          onChange={(e) => skey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { requestshit(); }
          }}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "12px 14px",
            boxSizing: "border-box",

            background: "#000",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "8px",

            outline: "none",
            fontFamily: '"Cascadia Mono", monospace',
            fontSize: "14px",
          }}
        />

        <button
          onClick={requestshit}
          disabled={loading}
          style={{
            padding: "12px 18px",

            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",

            fontFamily: '"Cascadia Mono", monospace',
            fontSize: "14px",

            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </div>

      {}
      <div
        style={{
          flex: 1,
          minHeight: 0,

          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",

          overflowY: "auto",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          padding: "40px",
          boxSizing: "border-box",

          border: "1px solid #1c1c1c",
          borderRadius: "14px",

          background: "#050505",
        }}
      >
        {result && (
          <p
            style={{
              margin: 0,
              textAlign: "center",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            {result}
          </p>
        )}
      </div>
    </main>
  );
}
