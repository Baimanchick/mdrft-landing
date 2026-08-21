import { spawnSync } from "child_process";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";

const input = path.resolve("./for 2 block.mov");
const outputTrimmed = path.resolve("./public/videos/block2_trimmed.mp4");
const outputReversed = path.resolve("./public/videos/block2_reversed.mp4");
const outputFinal = path.resolve("./public/videos/block2.mp4");
const outputMov = path.resolve("./public/videos/block2.mov");

console.log("Using ffmpeg at:", ffmpegPath);

function runFfmpeg(args) {
  console.log("Running ffmpeg with args:", args.join(" "));
  const result = spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed with code ${result.status}`);
  }
}

// Step 1: Trim to 9 seconds and encode to h264 mp4
console.log("Step 1: Trimming to 9 seconds...");
runFfmpeg(["-y", "-i", input, "-t", "9", "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-an", outputTrimmed]);
console.log("Trimmed video created.");

// Step 2: Reverse the 9 second video
console.log("Step 2: Reversing 9-second video...");
runFfmpeg(["-y", "-i", outputTrimmed, "-vf", "reverse", "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-an", outputReversed]);
console.log("Reversed video created.");

// Step 3: Concatenate forward + reverse
console.log("Step 3: Concatenating forward + reverse...");
const listFile = path.resolve("./concat_list.txt");
fs.writeFileSync(listFile, `file '${outputTrimmed.replace(/\\/g, "/")}'\nfile '${outputReversed.replace(/\\/g, "/")}'\n`);

runFfmpeg(["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outputFinal]);
runFfmpeg(["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outputMov]);

if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
if (fs.existsSync(outputTrimmed)) fs.unlinkSync(outputTrimmed);
if (fs.existsSync(outputReversed)) fs.unlinkSync(outputReversed);

console.log("SUCCESS: 9s forward + 9s reverse video created!");
