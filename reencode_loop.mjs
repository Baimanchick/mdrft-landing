import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

const ffmpeg = path.resolve("./ffmpeg.exe");
const input = path.resolve("./for 2 block.mov");
const outputMp4 = path.resolve("./public/videos/block2.mp4");
const outputMov = path.resolve("./public/videos/block2.mov");

console.log("Re-encoding video using filter_complex for seamless frame-accurate loop...");

// Single-pass filter_complex:
// 1. Take first 9 seconds [fwd]
// 2. Reverse first 9 seconds [rev]
// 3. Concat [fwd] + [rev] into continuous video stream with proper PTS
// 4. Output with -movflags +faststart and -pix_fmt yuv420p for flawless browser looping
const args = [
  "-y",
  "-i", input,
  "-filter_complex",
  "[0:v]trim=duration=9,setpts=PTS-STARTPTS[fwd];[0:v]trim=duration=9,setpts=PTS-STARTPTS,reverse[rev];[fwd][rev]concat=n=2:v=1:a=0,format=yuv420p[v]",
  "-map", "[v]",
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "18",
  "-movflags", "+faststart",
  "-an",
  outputMp4
];

console.log("Running ffmpeg...");
const res = spawnSync(ffmpeg, args, { stdio: "inherit" });
if (res.status !== 0) {
  throw new Error(`ffmpeg failed with code ${res.status}`);
}

// Also copy to .mov
fs.copyFileSync(outputMp4, outputMov);

console.log("SUCCESS: Re-encoded seamless 18s loop with faststart & continuous PTS!");
