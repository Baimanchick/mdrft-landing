import { ImageResponse } from "next/og";

import { siteConfig } from "@/shared/config/site";

export const alt = "M Drift School — Pure control. Bavarian character.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          color: "#f2f2f0",
          background: "#050505",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-40px",
            bottom: "-220px",
            display: "flex",
            color: "#151515",
            fontSize: "660px",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          M
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "25px",
            fontWeight: 800,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "52px",
              height: "52px",
              alignItems: "center",
              justifyContent: "center",
              color: "#050505",
              background: "#f5ff00",
              fontSize: "31px",
            }}
          >
            M
          </div>
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: "980px",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div
            style={{
              color: "#f5ff00",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "5px",
              textTransform: "uppercase",
            }}
          >
            Drift · Control · BMW M
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "78px",
              fontWeight: 900,
              letterSpacing: "-5px",
              lineHeight: 0.94,
              textTransform: "uppercase",
            }}
          >
            Pure control. Bavarian character.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
