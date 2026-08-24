import localFont from "next/font/local";

export const clusterFont = localFont({
  src: [
    { path: "../assets/bmw-type-global-pro-light.woff2", weight: "300", style: "normal" },
    { path: "../assets/bmw-type-global-pro-regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/bmw-type-global-pro-bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const CLUSTER_FONT = `${clusterFont.style.fontFamily}, "Helvetica Neue", Arial, sans-serif`;
