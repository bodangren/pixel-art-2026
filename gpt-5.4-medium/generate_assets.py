#!/usr/bin/env python3
"""
Generate pixel-art benchmark assets for Labyrinth of the Goblin King.
Outputs directly into the gpt-5.4-medium directory.
"""

from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math
import random


OUTPUT_DIR = Path("/home/daniel-bo/Desktop/pixel-art-benchmark/gpt-5.4-medium")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

random.seed(54)

COLORS = {
    "void": (8, 8, 14),
    "charcoal": (26, 26, 46),
    "stone_a": (42, 42, 58),
    "stone_b": (58, 58, 74),
    "stone_c": (68, 68, 86),
    "grout": (18, 18, 28),
    "moss_dark": (46, 72, 48),
    "moss_light": (88, 118, 84),
    "crack": (20, 20, 32),
    "blood": (92, 34, 34),
    "torch": (238, 149, 72),
    "torch_hot": (255, 205, 128),
    "shadow": (10, 10, 18, 180),
    "outline": (18, 12, 20, 255),
    "silver_light": (214, 220, 232, 255),
    "silver_mid": (162, 170, 185, 255),
    "silver_dark": (95, 103, 120, 255),
    "blue_light": (86, 132, 208, 255),
    "blue_mid": (46, 94, 176, 255),
    "blue_dark": (24, 54, 110, 255),
    "leather": (112, 82, 48, 255),
    "gold": (226, 192, 72, 255),
    "skin": (225, 188, 154, 255),
    "goblin_light": (98, 164, 94, 255),
    "goblin_mid": (74, 140, 74, 255),
    "goblin_dark": (46, 96, 46, 255),
    "goblin_ear": (132, 180, 74, 255),
    "eye_red": (232, 98, 74, 255),
    "eye_yellow": (238, 214, 108, 255),
    "club": (116, 82, 52, 255),
    "rust": (148, 86, 52, 255),
    "orb_gold": (255, 215, 64, 255),
    "orb_gold2": (255, 246, 164, 255),
    "orb_blue": (74, 144, 217, 255),
    "orb_blue2": (170, 220, 255, 255),
    "orb_purple": (155, 89, 182, 255),
    "orb_purple2": (220, 180, 255, 255),
    "white": (255, 255, 255, 255),
    "transparent": (0, 0, 0, 0),
}


def clamp(v: int) -> int:
    return max(0, min(255, v))


def blend_rgb(base: tuple[int, int, int], tint: tuple[int, int, int], alpha: float) -> tuple[int, int, int]:
    return tuple(clamp(int(base[i] * (1.0 - alpha) + tint[i] * alpha)) for i in range(3))


def rgba(rgb: tuple[int, int, int], alpha: int = 255) -> tuple[int, int, int, int]:
    return rgb + (alpha,)


def rect(draw: ImageDraw.ImageDraw, ox: int, oy: int, x: int, y: int, w: int, h: int, fill):
    draw.rectangle([ox + x, oy + y, ox + x + w - 1, oy + y + h - 1], fill=fill)


def line(draw: ImageDraw.ImageDraw, ox: int, oy: int, points: list[tuple[int, int]], fill, width: int = 1):
    shifted = [(ox + x, oy + y) for x, y in points]
    draw.line(shifted, fill=fill, width=width)


def ellipse(draw: ImageDraw.ImageDraw, ox: int, oy: int, x0: int, y0: int, x1: int, y1: int, fill, outline=None):
    draw.ellipse([ox + x0, oy + y0, ox + x1, oy + y1], fill=fill, outline=outline)


def put(img: Image.Image, x: int, y: int, color):
    if 0 <= x < img.width and 0 <= y < img.height:
        img.putpixel((x, y), color)


def create_background() -> None:
    width, height, tile = 390, 700, 32
    img = Image.new("RGB", (width, height), COLORS["charcoal"])
    px = img.load()

    cols = math.ceil(width / tile)
    rows = math.ceil(height / tile)

    torch_centers = [(54, 78), (336, 140), (88, 348), (320, 504), (186, 620)]

    for row in range(rows):
        for col in range(cols):
            x0 = col * tile
            y0 = row * tile
            x1 = min(x0 + tile, width)
            y1 = min(y0 + tile, height)

            is_wall = (row + col) % 2 == 0
            base = COLORS["stone_b"] if is_wall else COLORS["stone_a"]
            noise_bias = random.randint(-5, 5)

            for y in range(y0, y1):
                for x in range(x0, x1):
                    n = ((x * 17 + y * 11 + row * 13 + col * 7) % 9) - 4 + noise_bias
                    c = tuple(clamp(ch + n) for ch in base)
                    px[x, y] = c

            for x in range(x0, x1):
                px[x, y0] = blend_rgb(px[x, y0], COLORS["stone_c"], 0.45)
                px[x, y1 - 1] = COLORS["grout"]
            for y in range(y0, y1):
                px[x0, y] = blend_rgb(px[x0, y], COLORS["stone_c"], 0.35)
                px[x1 - 1, y] = COLORS["grout"]

            if is_wall:
                for x in range(x0 + 2, min(x0 + 10, x1)):
                    px[x, min(y0 + 2, y1 - 1)] = blend_rgb(px[x, min(y0 + 2, y1 - 1)], COLORS["stone_c"], 0.4)
                for y in range(y0 + 2, min(y0 + 10, y1)):
                    px[min(x0 + 2, x1 - 1), y] = blend_rgb(px[min(x0 + 2, x1 - 1), y], COLORS["stone_c"], 0.4)

            if (row * 3 + col * 5) % 7 == 0:
                center_x = x0 + 8 + (col * 5 + row * 3) % 16
                center_y = y0 + 7 + (row * 4 + col * 2) % 16
                for dy in range(-5, 6):
                    for dx in range(-5, 6):
                        if dx * dx + dy * dy > 24:
                            continue
                        xx = center_x + dx
                        yy = center_y + dy
                        if 0 <= xx < width and 0 <= yy < height:
                            amt = max(0.0, 1.0 - (dx * dx + dy * dy) / 24.0)
                            px[xx, yy] = blend_rgb(px[xx, yy], COLORS["moss_light" if (dx + dy) % 2 else "moss_dark"], amt * 0.55)

            if (row * 11 + col * 13) % 19 == 0:
                start_x = x0 + 4 + (col * 3) % 20
                start_y = y0 + 5 + (row * 2) % 19
                for step in range(8):
                    xx = start_x + step
                    yy = start_y + (step % 3) - 1
                    put(img, xx, yy, COLORS["crack"])
                    if step % 3 == 0:
                        put(img, xx, yy + 1, blend_rgb(COLORS["crack"], COLORS["stone_a"], 0.3))

            if (row * 17 + col * 19) % 43 == 0:
                stain_x = x0 + 8 + (row + col) % 10
                stain_y = y0 + 10 + (row * 2) % 8
                for dy in range(-3, 4):
                    for dx in range(-4, 5):
                        if dx * dx + dy * dy > 14:
                            continue
                        xx = stain_x + dx
                        yy = stain_y + dy
                        if 0 <= xx < width and 0 <= yy < height:
                            px[xx, yy] = blend_rgb(px[xx, yy], COLORS["blood"], 0.35)

    glow = Image.new("RGBA", (width, height), COLORS["transparent"])
    glow_draw = ImageDraw.Draw(glow)
    for cx, cy in torch_centers:
        for radius, alpha in ((48, 32), (32, 48), (16, 90)):
            glow_draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=rgba(COLORS["torch"], alpha))
        glow_draw.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=rgba(COLORS["torch_hot"], 160))

    glow = glow.filter(ImageFilter.GaussianBlur(radius=10))
    base_rgba = img.convert("RGBA")
    base_rgba.alpha_composite(glow)

    vignette = Image.new("RGBA", (width, height), COLORS["transparent"])
    vpx = vignette.load()
    for y in range(height):
        for x in range(width):
            edge = min(x, y, width - 1 - x, height - 1 - y)
            darkness = max(0.0, 1.0 - edge / 46.0)
            if darkness > 0:
                alpha = clamp(int((darkness ** 1.6) * 210))
                vpx[x, y] = (0, 0, 0, alpha)
    base_rgba.alpha_composite(vignette)

    base_rgba.convert("RGB").save(OUTPUT_DIR / "background.png")


def draw_knight_frame(draw: ImageDraw.ImageDraw, ox: int, oy: int, direction: str, frame: int) -> None:
    bob = -1 if frame == 1 else 1 if frame == 2 else 0
    step_left = -2 if frame == 1 else 2 if frame == 2 else 0
    step_right = -step_left
    arm = -1 if frame == 1 else 1 if frame == 2 else 0

    ellipse(draw, ox, oy, 20, 47, 43, 57, rgba((0, 0, 0), 90))

    if direction == "down":
        rect(draw, ox, oy, 26 + step_left, 41, 5, 12, COLORS["silver_dark"])
        rect(draw, ox, oy, 33 + step_right, 41, 5, 12, COLORS["silver_dark"])
        rect(draw, ox, oy, 23, 24 + arm, 7, 15, COLORS["silver_mid"])
        rect(draw, ox, oy, 34, 23 - arm, 7, 15, COLORS["silver_mid"])
        rect(draw, ox, oy, 24, 17, 16, 18, COLORS["silver_mid"])
        rect(draw, ox, oy, 25, 19, 14, 7, COLORS["silver_light"])
        rect(draw, ox, oy, 26, 29, 12, 11, COLORS["blue_mid"])
        rect(draw, ox, oy, 28, 31, 8, 7, COLORS["blue_light"])
        ellipse(draw, ox, oy, 23, 6, 40, 23, COLORS["silver_mid"], COLORS["outline"])
        rect(draw, ox, oy, 26, 9, 12, 7, COLORS["silver_light"])
        rect(draw, ox, oy, 28, 11, 8, 2, COLORS["outline"])
        rect(draw, ox, oy, 30, 4, 4, 3, COLORS["gold"])
        ellipse(draw, ox, oy, 16, 24 + arm, 26, 36 + arm, COLORS["blue_mid"], COLORS["outline"])
        rect(draw, ox, oy, 39, 16 - arm, 2, 22, COLORS["silver_light"])
        rect(draw, ox, oy, 37, 24 - arm, 6, 2, COLORS["gold"])
        rect(draw, ox, oy, 39, 38 - arm, 2, 5, COLORS["silver_dark"])

    elif direction == "left":
        rect(draw, ox, oy, 27 + step_left, 42, 5, 11, COLORS["silver_dark"])
        rect(draw, ox, oy, 33 + step_right, 41, 5, 12, COLORS["silver_dark"])
        rect(draw, ox, oy, 22, 26, 7, 14, COLORS["silver_mid"])
        rect(draw, ox, oy, 34, 23, 7, 15, COLORS["silver_mid"])
        rect(draw, ox, oy, 24, 19, 15, 18, COLORS["silver_mid"])
        rect(draw, ox, oy, 24, 27, 11, 10, COLORS["blue_mid"])
        rect(draw, ox, oy, 25, 29, 8, 6, COLORS["blue_light"])
        ellipse(draw, ox, oy, 21, 8, 38, 24, COLORS["silver_mid"], COLORS["outline"])
        rect(draw, ox, oy, 22, 10, 8, 8, COLORS["silver_light"])
        rect(draw, ox, oy, 21, 13, 5, 2, COLORS["outline"])
        rect(draw, ox, oy, 29, 6, 4, 3, COLORS["gold"])
        ellipse(draw, ox, oy, 14, 22, 24, 33, COLORS["blue_mid"], COLORS["outline"])
        line(draw, ox, oy, [(38, 20), (44, 16), (48, 12)], COLORS["silver_light"], 2)
        rect(draw, ox, oy, 39, 18, 5, 2, COLORS["gold"])

    elif direction == "right":
        rect(draw, ox, oy, 27 + step_left, 41, 5, 12, COLORS["silver_dark"])
        rect(draw, ox, oy, 33 + step_right, 42, 5, 11, COLORS["silver_dark"])
        rect(draw, ox, oy, 23, 23, 7, 15, COLORS["silver_mid"])
        rect(draw, ox, oy, 35, 26, 7, 14, COLORS["silver_mid"])
        rect(draw, ox, oy, 25, 19, 15, 18, COLORS["silver_mid"])
        rect(draw, ox, oy, 29, 27, 11, 10, COLORS["blue_mid"])
        rect(draw, ox, oy, 31, 29, 8, 6, COLORS["blue_light"])
        ellipse(draw, ox, oy, 25, 8, 42, 24, COLORS["silver_mid"], COLORS["outline"])
        rect(draw, ox, oy, 34, 10, 8, 8, COLORS["silver_light"])
        rect(draw, ox, oy, 38, 13, 5, 2, COLORS["outline"])
        rect(draw, ox, oy, 31, 6, 4, 3, COLORS["gold"])
        ellipse(draw, ox, oy, 40, 22, 50, 33, COLORS["blue_mid"], COLORS["outline"])
        line(draw, ox, oy, [(25, 20), (19, 16), (15, 12)], COLORS["silver_light"], 2)
        rect(draw, ox, oy, 20, 18, 5, 2, COLORS["gold"])

    else:  # up
        rect(draw, ox, oy, 26 + step_left, 41, 5, 12, COLORS["silver_dark"])
        rect(draw, ox, oy, 33 + step_right, 41, 5, 12, COLORS["silver_dark"])
        rect(draw, ox, oy, 23, 23 + arm, 7, 14, COLORS["silver_light"])
        rect(draw, ox, oy, 34, 24 - arm, 7, 14, COLORS["silver_light"])
        rect(draw, ox, oy, 24, 18, 16, 18, COLORS["silver_mid"])
        rect(draw, ox, oy, 26, 27, 12, 11, COLORS["blue_dark"])
        rect(draw, ox, oy, 28, 29, 8, 7, COLORS["blue_mid"])
        ellipse(draw, ox, oy, 23, 6, 40, 23, COLORS["silver_light"], COLORS["outline"])
        rect(draw, ox, oy, 27, 8, 10, 8, COLORS["silver_mid"])
        rect(draw, ox, oy, 31, 4, 3, 3, COLORS["gold"])
        rect(draw, ox, oy, 25, 22, 14, 2, COLORS["silver_dark"])
        rect(draw, ox, oy, 39, 10, 2, 11, COLORS["gold"])
        rect(draw, ox, oy, 39, 21, 2, 12, COLORS["silver_light"])
        rect(draw, ox, oy, 37, 19, 6, 2, COLORS["gold"])

    rect(draw, ox, oy, 24, 18, 1, 16, COLORS["outline"])
    rect(draw, ox, oy, 39, 18, 1, 16, COLORS["outline"])
    rect(draw, ox, oy, 24, 35, 16, 1, COLORS["outline"])


def create_hero_sheet() -> None:
    img = Image.new("RGBA", (192, 192), COLORS["transparent"])
    draw = ImageDraw.Draw(img)
    frames = [
        ("down", 0),
        ("down", 1),
        ("down", 2),
        ("left", 1),
        ("left", 2),
        ("right", 1),
        ("right", 2),
        ("up", 1),
        ("up", 2),
    ]
    for idx, (direction, frame) in enumerate(frames):
        ox = (idx % 3) * 64
        oy = (idx // 3) * 64
        draw_knight_frame(draw, ox, oy, direction, frame)
    img.save(OUTPUT_DIR / "hero-3x3-sheet.png")


def draw_goblin_frame(draw: ImageDraw.ImageDraw, ox: int, oy: int, pose: str, frame: int) -> None:
    step = -2 if frame == 1 else 2 if frame == 2 else 0
    ellipse(draw, ox, oy, 19, 46, 42, 56, rgba((0, 0, 0), 90))

    rect(draw, ox, oy, 25 + step, 41, 5, 10, COLORS["goblin_dark"])
    rect(draw, ox, oy, 33 - step, 41, 5, 10, COLORS["goblin_dark"])
    rect(draw, ox, oy, 23, 26, 8, 13, COLORS["goblin_mid"])
    rect(draw, ox, oy, 33, 24, 8, 14, COLORS["goblin_mid"])
    rect(draw, ox, oy, 24, 20, 16, 17, COLORS["goblin_mid"])
    rect(draw, ox, oy, 25, 27, 14, 8, COLORS["goblin_dark"])
    ellipse(draw, ox, oy, 21, 9, 42, 27, COLORS["goblin_mid"], COLORS["outline"])
    rect(draw, ox, oy, 19, 15, 5, 5, COLORS["goblin_ear"])
    rect(draw, ox, oy, 39, 15, 5, 5, COLORS["goblin_ear"])
    rect(draw, ox, oy, 24, 12, 16, 8, COLORS["goblin_light"])
    rect(draw, ox, oy, 26, 14, 4, 3, COLORS["eye_red"])
    rect(draw, ox, oy, 34, 14, 4, 3, COLORS["eye_yellow"])
    rect(draw, ox, oy, 29, 18, 6, 2, COLORS["outline"])
    rect(draw, ox, oy, 25, 8, 14, 4, COLORS["leather"])
    rect(draw, ox, oy, 26, 9, 12, 1, COLORS["rust"])
    rect(draw, ox, oy, 37, 25, 2, 15, COLORS["club"])
    rect(draw, ox, oy, 35, 37, 6, 4, COLORS["rust"])

    if pose == "left":
        line(draw, ox, oy, [(23, 26), (16, 23), (12, 21)], COLORS["club"], 2)
        rect(draw, ox, oy, 10, 20, 4, 4, COLORS["rust"])
    elif pose == "right":
        line(draw, ox, oy, [(41, 26), (48, 23), (52, 21)], COLORS["club"], 2)
        rect(draw, ox, oy, 50, 20, 4, 4, COLORS["rust"])
    elif pose == "stunned":
        rect(draw, ox, oy, 24, 12, 16, 8, COLORS["goblin_light"])
        rect(draw, ox, oy, 28, 14, 3, 3, COLORS["eye_yellow"])
        rect(draw, ox, oy, 33, 14, 3, 3, COLORS["eye_yellow"])
        line(draw, ox, oy, [(18, 8), (22, 4), (26, 8)], COLORS["orb_blue2"], 1)
        line(draw, ox, oy, [(30, 5), (32, 2), (34, 5)], COLORS["orb_blue2"], 1)
        line(draw, ox, oy, [(38, 8), (42, 4), (46, 8)], COLORS["orb_blue2"], 1)
    elif pose == "alert":
        rect(draw, ox, oy, 26, 13, 4, 4, COLORS["eye_red"])
        rect(draw, ox, oy, 34, 13, 4, 4, COLORS["eye_red"])
        rect(draw, ox, oy, 28, 19, 8, 2, COLORS["blood"])
        line(draw, ox, oy, [(32, 4), (32, 0)], COLORS["eye_yellow"], 2)
        rect(draw, ox, oy, 29, 0, 6, 3, COLORS["eye_yellow"])

    rect(draw, ox, oy, 24, 20, 1, 16, COLORS["outline"])
    rect(draw, ox, oy, 39, 20, 1, 16, COLORS["outline"])
    rect(draw, ox, oy, 24, 36, 16, 1, COLORS["outline"])


def create_goblin_sheet() -> None:
    img = Image.new("RGBA", (192, 192), COLORS["transparent"])
    draw = ImageDraw.Draw(img)
    frames = [
        ("down", 0),
        ("down", 1),
        ("down", 2),
        ("left", 1),
        ("left", 2),
        ("right", 1),
        ("right", 2),
        ("stunned", 0),
        ("alert", 0),
    ]
    for idx, (pose, frame) in enumerate(frames):
        ox = (idx % 3) * 64
        oy = (idx // 3) * 64
        draw_goblin_frame(draw, ox, oy, pose, frame)
    img.save(OUTPUT_DIR / "goblin-3x3-sheet.png")


def draw_orb_frame(draw: ImageDraw.ImageDraw, ox: int, core, mid, glow) -> None:
    ellipse(draw, ox, 0, 12, 34, 35, 41, rgba((0, 0, 0), 90))
    for x0, y0, x1, y1, alpha in ((4, 8, 44, 44, 18), (8, 10, 40, 40, 26), (11, 12, 37, 38, 38)):
        ellipse(draw, ox, 0, x0, y0, x1, y1, glow[:-1] + (alpha,))
    ellipse(draw, ox, 0, 12, 13, 35, 36, mid, rgba((22, 16, 28), 220))
    ellipse(draw, ox, 0, 16, 17, 31, 32, core)
    ellipse(draw, ox, 0, 18, 18, 24, 24, rgba((255, 255, 255), 120))
    rect(draw, ox, 0, 19, 19, 10, 10, rgba((255, 255, 255), 22))
    line(draw, ox, 0, [(17, 35), (15, 39), (14, 43)], glow, 1)
    line(draw, ox, 0, [(30, 35), (33, 39), (34, 43)], glow, 1)


def create_orb_sheet() -> None:
    img = Image.new("RGBA", (144, 48), COLORS["transparent"])
    draw = ImageDraw.Draw(img)
    draw_orb_frame(draw, 0, COLORS["orb_gold2"], COLORS["orb_gold"], rgba(COLORS["orb_gold"][:3], 255))
    draw_orb_frame(draw, 48, COLORS["orb_blue2"], COLORS["orb_blue"], rgba(COLORS["orb_blue"][:3], 255))
    draw_orb_frame(draw, 96, COLORS["orb_purple2"], COLORS["orb_purple"], rgba(COLORS["orb_purple"][:3], 255))
    img.save(OUTPUT_DIR / "orb-sheet.png")


def main() -> None:
    create_background()
    create_hero_sheet()
    create_goblin_sheet()
    create_orb_sheet()
    print(f"Generated assets in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
