import fs from "fs";
import path from "path";
import https from "https";

const CARS_DIR = path.resolve("./public/cars");
if (!fs.existsSync(CARS_DIR)) {
  fs.mkdirSync(CARS_DIR, { recursive: true });
}

const CAR_IMAGES = [
  {
    id: "m2",
    url: "https://pngimg.com/uploads/bmw/bmw_PNG99539.png",
  },
  {
    id: "m3",
    url: "https://pngimg.com/uploads/bmw/bmw_PNG99540.png",
  },
  {
    id: "m4",
    url: "https://pngimg.com/uploads/bmw/bmw_PNG99546.png",
  },
  {
    id: "m5",
    url: "https://pngimg.com/uploads/bmw/bmw_PNG99553.png",
  },
  {
    id: "m6",
    url: "https://pngimg.com/uploads/bmw/bmw_PNG99548.png",
  },
  {
    id: "m8",
    url: "https://pngimg.com/uploads/bmw/bmw_PNG99555.png",
  },
];

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const car of CAR_IMAGES) {
    const dest = path.join(CARS_DIR, `${car.id}.png`);
    try {
      console.log(`Downloading ${car.id}...`);
      await downloadFile(car.url, dest);
      console.log(`Saved ${car.id}.png`);
    } catch (e) {
      console.error(`Error for ${car.id}:`, e.message);
    }
  }
}

run();
