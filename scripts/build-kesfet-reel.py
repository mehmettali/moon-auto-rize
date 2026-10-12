#!/usr/bin/env python3
"""Build a 9:16 Instagram Explore reel from gallery stills with ffmpeg.
Text is rendered to transparent PNGs with Pillow (ffmpeg here lacks drawtext)."""
import os, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC = "/Users/mehmetalikose/mustafakaradag/tmp-upload/reel"
OUT_DIR = SRC
FONT_B = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_H = "/System/Library/Fonts/Supplemental/Impact.ttf"
W, H, FPS = 1080, 1920, 30

SCENES = [
    ("01-vitrin-porsche.jpg",             2.2, "RİZE'DE BU ARABAYI\nBÖYLE TESLİM ETTİK", 0.14, "in",  96),
    ("36-audi-detay.jpg",                 1.4, None,                     0.70, "in",  84),
    ("02-seramik-isik-tuneli.jpg",        1.6, "SERAMİK KAPLAMA",        0.72, "in",  84),
    ("03-siyah-sedan-isik-tuneli.jpg",    1.3, None,                     0.70, "out", 84),
    ("29-mercedes-isik-tuneli-on.jpg",    1.3, "AYNA GİBİ YÜZEY",        0.72, "in",  84),
    ("35-kirmizi-tucson-boya-koruma.jpg", 1.6, "PPF BOYA KORUMA",        0.72, "in",  84),
    ("10-kaplama-uygulama.jpg",           1.3, None,                     0.70, "out", 84),
    ("04-pasta-cila-uygulama.jpg",        1.6, "PASTA CİLA",             0.72, "in",  84),
    ("30-klasik-mercedes-detay.jpg",      1.6, "DETAYLAR\nFARK YARATIR", 0.68, "in",  84),
    ("18-ig-bmw-vitrin.jpg",              1.3, None,                     0.70, "out", 84),
    ("33-vitrin-gece-detailing.jpg",      1.8, "MOON AUTO · RİZE",       0.72, "in",  84),
]
END_CARD = ("08-premium-yikama-passat.jpg", 2.4)

tmp = tempfile.mkdtemp(prefix="reel_")
clips = []

def text_png(lines, size, font_path, y_frac, box=True, color=(255, 255, 255, 255)):
    """Render multi-line centered text onto a transparent 1080x1920 PNG."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    font = ImageFont.truetype(font_path, size)
    spacing = int(size * 0.18)
    widths, heights = [], []
    for ln in lines:
        bb = d.textbbox((0, 0), ln, font=font)
        widths.append(bb[2] - bb[0]); heights.append(bb[3] - bb[1])
    total_h = sum(heights) + spacing * (len(lines) - 1)
    y = int(H * y_frac)
    pad = 28
    if box:
        bw = max(widths) + pad * 2
        box_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        bd = ImageDraw.Draw(box_img)
        bd.rounded_rectangle([(W - bw) // 2, y - pad, (W + bw) // 2, y + total_h + pad],
                             radius=18, fill=(0, 0, 0, 135))
        img = Image.alpha_composite(img, box_img)
        d = ImageDraw.Draw(img)
    # shadow
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    yy = y
    for ln, wdt, hgt in zip(lines, widths, heights):
        bb = d.textbbox((0, 0), ln, font=font)
        x = (W - wdt) // 2 - bb[0]
        sd.text((x + 4, yy + 4 - bb[1]), ln, font=font, fill=(0, 0, 0, 200))
        yy += hgt + spacing
    sh = sh.filter(ImageFilter.GaussianBlur(3))
    img = Image.alpha_composite(img, sh)
    d = ImageDraw.Draw(img)
    yy = y
    for ln, wdt, hgt in zip(lines, widths, heights):
        bb = d.textbbox((0, 0), ln, font=font)
        x = (W - wdt) // 2 - bb[0]
        d.text((x, yy - bb[1]), ln, font=font, fill=color)
        yy += hgt + spacing
    p = os.path.join(tmp, f"txt{len(os.listdir(tmp))}.png")
    img.save(p)
    return p

def watermark_png():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT_B, 34)
    d.text((50, 78), "MOON AUTO", font=font, fill=(0, 0, 0, 170))
    d.text((48, 76), "MOON AUTO", font=font, fill=(255, 255, 255, 225))
    p = os.path.join(tmp, "wm.png"); img.save(p); return p

WM = watermark_png()

def dims(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0",
                                   "-show_entries", "stream=width,height", "-of", "csv=p=0", path]).decode().strip()
    w, h = out.split(","); return int(w), int(h)

def build_clip(path, secs, caption, y_frac, zoom, size, out, end=False):
    w, h = dims(path)
    frames = int(secs * FPS)
    portrait = h / w >= 1.6
    inputs = ["-i", path, "-loop", "1", "-i", WM]
    if end:
        base = (f"[0:v]scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
                f"boxblur=30:6,eq=brightness=-0.45[comp]")
    elif portrait:
        base = f"[0:v]scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2}[comp]"
    else:
        base = (f"[0:v]scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
                f"boxblur=40:8,eq=brightness=-0.18[bg];[0:v]scale={W*2}:-2[fg];"
                f"[bg][fg]overlay=(W-w)/2:(H-h)/2[comp]")
    z = "min(1+0.0022*on\\,1.16)" if zoom == "in" else "max(1.16-0.0022*on\\,1.0)"
    zp = (f"[comp]zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
          f":d={frames}:s={W}x{H}:fps={FPS}[zp]")
    chain = f"[zp][1:v]overlay=0:0[a]"
    last = "a"
    pngs = []
    if end:
        pngs = [(text_png(["MOON AUTO"], 150, FONT_H, 0.33, box=False), 0.0),
                (text_png(["DETAILING · RİZE"], 56, FONT_B, 0.43, box=False), 0.0),
                (text_png(["Kaydet & paylaş"], 66, FONT_B, 0.60, box=False), 0.5),
                (text_png(["@moonautodetailingrize"], 58, FONT_B, 0.68, box=False,
                          color=(255, 215, 90, 255)), 0.8)]
    elif caption:
        pngs = [(text_png(caption.split("\n"), size, FONT_H, y_frac), 0.0)]
    for i, (png, start) in enumerate(pngs):
        inputs += ["-loop", "1", "-i", png]
        idx = 2 + i
        nxt = f"o{i}"
        chain += (f";[{idx}:v]format=rgba,fade=t=in:st={start}:d=0.25:alpha=1[t{i}];"
                  f"[{last}][t{i}]overlay=0:0:enable='gte(t\\,{start})'[{nxt}]")
        last = nxt
    chain += f";[{last}]format=yuv420p[v]"
    fc = base + ";" + zp + ";" + chain
    cmd = ["ffmpeg", "-y", "-v", "error"] + inputs + ["-filter_complex", fc, "-map", "[v]",
           "-t", f"{secs:.2f}", "-r", str(FPS), "-c:v", "libx264", "-preset", "medium",
           "-crf", "18", "-pix_fmt", "yuv420p", out]
    subprocess.run(cmd, check=True)

for i, (f, secs, cap, yf, zoom, size) in enumerate(SCENES):
    out = os.path.join(tmp, f"clip{i:02d}.mp4")
    build_clip(os.path.join(SRC, f), secs, cap, yf, zoom, size, out)
    clips.append(out); print("clip", i, f, "ok", flush=True)

eout = os.path.join(tmp, "clip_end.mp4")
build_clip(os.path.join(SRC, END_CARD[0]), END_CARD[1], None, 0, "in", 0, eout, end=True)
clips.append(eout); print("end card ok", flush=True)

lst = os.path.join(tmp, "list.txt")
open(lst, "w").write("".join(f"file '{c}'\n" for c in clips))
final = os.path.join(OUT_DIR, "moonauto-kesfet-reel-1.mp4")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst,
                "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
                "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "96k", "-shortest", "-movflags", "+faststart", final], check=True)
print("FINAL", final)
