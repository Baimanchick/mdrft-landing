import os
import sys
import subprocess
import imageio_ffmpeg

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using ffmpeg: {ffmpeg_exe}")

videos_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "videos"))
print(f"Target videos directory: {videos_dir}")

for file in sorted(os.listdir(videos_dir)):
    ext = os.path.splitext(file)[1].lower()
    if ext in [".mp4", ".mov", ".m4v"]:
        base_name = os.path.splitext(file)[0]
        src_path = os.path.join(videos_dir, file)
        dest_path = os.path.join(videos_dir, f"{base_name}.webm")
        
        print(f"\n[Converting] {file} -> {base_name}.webm ...")
        cmd = [
            ffmpeg_exe,
            "-y",
            "-i", src_path,
            "-c:v", "libvpx-vp9",
            "-crf", "26",
            "-b:v", "0",
            "-cpu-used", "4",
            "-row-mt", "1",
            "-threads", "8",
            "-c:a", "libopus",
            "-b:a", "128k",
            dest_path
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode == 0:
            print(f"[OK] Converted: {base_name}.webm ({os.path.getsize(dest_path)} bytes)")
        else:
            print(f"[ERROR] Failed {file}: {res.stderr.decode('utf-8', errors='ignore')[-300:]}")

print("\nAll videos successfully converted to WebM!")
