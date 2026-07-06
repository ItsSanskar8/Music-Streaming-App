import { ImageResponse } from "next/og";

// Next App Router dynamic favicon — a glowing Nova "N" mark on deep black.
// Having this route means the browser stops requesting a missing /favicon.ico.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          color: "#050505",
          background: "linear-gradient(135deg, #245BFF 0%, #00F5D4 100%)",
          borderRadius: 8,
        }}
      >
        N
      </div>
    ),
    { ...size }
  );
}
