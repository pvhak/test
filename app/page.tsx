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
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #000;
        }
        * {
          box-sizing: border-box;
        }
        button, input {
          -webkit-tap-highlight-color: transparent;
        }
        input::placeholder {
          color: #666;
        }
      `}</style>
      <main
        style={{
          minHeight: "100vh",
          color: "#fff",
          fontFamily: '"Cascadia Mono", monospace',
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.97), rgba(0,0,0,0.55)), url('https://files.catbox.moe/60cmyv.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
            padding: "16px",
            boxSizing: "border-box",
            background: "rgba(17, 17, 17, 0.4)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
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
              if (e.key === "Enter") requestshit();
            }}
            style={{
              flex: 1,
              minWidth: 0,
              padding: "12px 14px",
              boxSizing: "border-box",
              background: "transparent",
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
              appearance: "none",
              WebkitAppearance: "none",
              padding: "12px 18px",
              background: "transparent",
              color: "#fff",
              border: "1px solid #444",
              outline: "none",
              boxShadow: "none",
              borderRadius: "8px",
              fontFamily: '"Cascadia Mono", monospace',
              fontSize: "14px",
              fontWeight: 500,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s ease, opacity 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "transparent";
            }}
          >
            {loading ? "Checking..." : "Enter"}
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            boxSizing: "border-box",
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
    </>
  );
}
