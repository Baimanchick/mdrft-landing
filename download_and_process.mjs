import https from "https";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Download a self-contained ffmpeg.exe from a direct raw binary source
const url = "https://github.com/eugeneware/ffmpeg-static/releases/download/b5.0.1/win32-x64";
const dest = path.resolve("./ffmpeg.exe");

console.log("Downloading ffmpeg binary to ./ffmpeg.exe...");

function download(url, dest) {
  const file = fs.createWriteStream(dest);
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      return download(res.headers.location, dest);
    }
    res.pipe(file);
    file.on("finish", () => {
      file.close(() => {
        console.log("ffmpeg.exe downloaded successfully!");
        processVideo();
      });
    });
  }).on("error", (e) => {
    console.error("Download error:", e);
  });
}

function processVideo() {
  const ffmpeg = path.resolve("./ffmpeg.exe");
  const input = path.resolve("./for 2 block.mov");
  const outputTrimmed = path.resolve("./public/videos/block2_9s.mp4");
  const outputReversed = path.resolve("./public/videos/block2_rev.mp4");
  const outputFinal = path.resolve("./public/videos/block2.mp4");
  const outputMov = path.resolve("./public/videos/block2.mov");

  console.log("1. Trimming to 9s...");
  execSync(`"${ffmpeg}" -y -i "${input}" -t 9 -c:v libx264 -preset fast -crf 22 -an "${outputTrimmed}"`);

  console.log("2. Reversing 9s...");
  execSync(`"${ffmpeg}" -y -i "${outputTrimmed}" -vf reverse -c:v libx264 -preset fast -crf 22 -an "${outputReversed}"`);

  console.log("3. Concatenating forward + reverse...");
  const listFile = path.resolve("./concat.txt");
  fs.writeFileSync(listFile, `file '${outputTrimmed.replace(/\\/g, "/")}'\nfile '${outputReversed.replace(/\\/g, "/")}'\n`);

  execSync(`"${ffmpeg}" -y -f concat -safe 0 -i "${listFile}" -c copy "${outputFinal}"`);
  execSync(`"${ffmpeg}" -y -f concat -safe 0 -i "${listFile}" -c copy "${outputMov}"`);

  if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
  if (fs.existsSync(outputTrimmed)) fs.unlinkSync(outputTrimmed);
  if (fs.existsSync(outputReversed)) fs.unlinkSync(outputReversed);

  console.log("ALL COMPLETE! 9s forward + 9s reverse video ready in public/videos/block2.mp4 and block2.mov");
}

download(url, dest);
