import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

const ffmpeg = path.resolve("./ffmpeg.exe");
const input = path.resolve("./for 2 block.mov");
const outputTrimmed = path.resolve("./public/videos/block2_9s.mp4");
const outputReversed = path.resolve("./public/videos/block2_rev.mp4");
const outputFinal = path.resolve("./public/videos/block2.mp4");
const outputMov = path.resolve("./public/videos/block2.mov");

function run(args) {
  console.log("Running ffmpeg with args:", args.join(" "));
  const res = spawnSync(ffmpeg, args, { stdio: "inherit" });
  if (res.status !== 0) {
    throw new Error(`Failed with code ${res.status}`);
  }
}

console.log("1. Trimming input video to exactly 9 seconds...");
run(["-y", "-i", input, "-t", "9", "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-an", outputTrimmed]);

console.log("2. Creating reversed 9-second video...");
run(["-y", "-i", outputTrimmed, "-vf", "reverse", "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-an", outputReversed]);

console.log("3. Concatenating forward 9s + reversed 9s into seamless 18s loop...");
const listFile = path.resolve("./concat.txt");
fs.writeFileSync(listFile, `file '${outputTrimmed.replace(/\\/g, "/")}'\nfile '${outputReversed.replace(/\\/g, "/")}'\n`);

run(["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outputFinal]);
run(["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outputMov]);

if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
if (fs.existsSync(outputTrimmed)) fs.unlinkSync(outputTrimmed);
if (fs.existsSync(outputReversed)) fs.unlinkSync(outputReversed);

console.log("SUCCESS! Video processed: 9s forward + 9s reverse.");
