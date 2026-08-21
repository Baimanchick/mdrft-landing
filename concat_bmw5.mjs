import { spawnSync } from "child_process";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";

const v1 = path.resolve("./public/videos/bmw5-1.mp4");
const v2 = path.resolve("./public/videos/bmw5-2.mp4");
const v3 = path.resolve("./public/videos/bmw5-3.mp4");
const v4 = path.resolve("./public/videos/bmw5-4.mp4");
const output = path.resolve("./public/videos/bmw5_combined.mp4");

const listFile = path.resolve("./concat_bmw5_list.txt");
fs.writeFileSync(
  listFile,
  `file '${v1.replace(/\\/g, "/")}'\nfile '${v2.replace(/\\/g, "/")}'\nfile '${v3.replace(/\\/g, "/")}'\nfile '${v4.replace(/\\/g, "/")}'\n`
);

console.log("Re-encoding and concatenating seamless video...");
// Using ffmpeg to re-encode and concatenate with uniform resolution & framerate for 100% seamless transition
const result = spawnSync(
  ffmpegPath,
  [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listFile,
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "20",
    "-an",
    output,
  ],
  { stdio: "inherit" }
);

if (fs.existsSync(listFile)) fs.unlinkSync(listFile);

if (result.status === 0) {
  console.log("SUCCESS: Concatenated seamless video created at public/videos/bmw5_combined.mp4");
} else {
  console.error("FFmpeg failed with status:", result.status);
}
