#!/usr/bin/env python3
from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw


OUT = Path(__file__).resolve().parent

COLORS = {
    "dark_charcoal": (26, 26, 46),
    "path_base": (42, 42, 58),
    "wall_base": (58, 58, 74),
    "path_shadow": (34, 34, 48),
    "wall_shadow": (46, 46, 60),
    "path_highlight": (52, 52, 68),
    "wall_highlight": (72, 72, 90),
    "moss": (90, 130, 90),
    "blood": (100, 42, 44),
    "torch": (220, 140, 60),
    "silver": (196, 203, 215),
    "silver_dark": (130, 138, 152),
    "blue": (58, 100, 182),
    "gold": (255, 215, 0),
    "goblin": (74, 140, 74),
    "goblin_dark": (48, 98, 48),
    "leather": (112, 93, 73),
    "eye_red": (214, 95, 83),
    "eye_yellow": (242, 209, 66),
    "orb_gold": (255, 215, 0),
    "orb_blue": (74, 144, 217),
    "orb_purple": (155, 89, 182),
    "white": (255, 255, 255),
}


def clamp(v: int) -> int:
    return max(0, min(255, v))


def tint(rgb: tuple[int, int, int], delta: int) -> tuple[int, int, int]:
    return tuple(clamp(c + delta) for c in rgb)


def create_background() -> None:
    width, height, tile = 390, 700, 32
    rng = random.Random(5309)

    image = Image.new("RGB", (width, height), COLORS["dark_charcoal"])
    draw = ImageDraw.Draw(image)

    rows = (height + tile - 1) // tile
    cols = (width + tile - 1) // tile

    for r in range(rows):
        for c in range(cols):
            x0 = c * tile
            y0 = r * tile
            x1 = min(width - 1, x0 + tile - 1)
            y1 = min(height - 1, y0 + tile - 1)

            is_wall = ((r * 3 + c * 5 + (r // 2)) % 7) in (0, 1, 6)
            base = COLORS["wall_base"] if is_wall else COLORS["path_base"]
            shadow = COLORS["wall_shadow"] if is_wall else COLORS["path_shadow"]
            highlight = COLORS["wall_highlight"] if is_wall else COLORS["path_highlight"]
            base = tint(base, rng.randint(-4, 4))

            draw.rectangle([x0, y0, x1, y1], fill=base)
            draw.line([(x0, y0), (x1, y0)], fill=highlight)
            draw.line([(x0, y0), (x0, y1)], fill=highlight)
            draw.line([(x0, y1), (x1, y1)], fill=shadow)
            draw.line([(x1, y0), (x1, y1)], fill=shadow)

            if rng.random() < 0.25:
                for _ in range(rng.randint(5, 11)):
                    px = rng.randint(x0 + 2, min(x1 - 2, x0 + tile - 3))
                    py = rng.randint(y0 + 2, min(y1 - 2, y0 + tile - 3))
                    draw.point((px, py), fill=tint(base, rng.choice([-14, -10, 8])))

            tile_w = x1 - x0 + 1
            tile_h = y1 - y0 + 1

            if tile_w >= 10 and tile_h >= 10 and rng.random() < 0.12:
                mx, my = rng.randint(x0 + 4, x1 - 4), rng.randint(y0 + 4, y1 - 4)
                for dx in range(-2, 3):
                    for dy in range(-2, 3):
                        if abs(dx) + abs(dy) <= 3 and rng.random() < 0.75:
                            draw.point((mx + dx, my + dy), fill=tint(COLORS["moss"], rng.randint(-10, 12)))

            if tile_w >= 12 and tile_h >= 12 and rng.random() < 0.06:
                cx, cy = rng.randint(x0 + 5, x1 - 5), rng.randint(y0 + 5, y1 - 5)
                for step in range(rng.randint(4, 8)):
                    cx += rng.choice([-1, 0, 1])
                    cy += 1
                    if x0 + 1 <= cx <= x1 - 1 and y0 + 1 <= cy <= y1 - 1:
                        draw.point((cx, cy), fill=COLORS["dark_charcoal"])

            if tile_w >= 14 and tile_h >= 14 and rng.random() < 0.03:
                bx, by = rng.randint(x0 + 6, x1 - 6), rng.randint(y0 + 6, y1 - 6)
                for dx in range(-1, 2):
                    for dy in range(-1, 2):
                        if rng.random() < 0.9:
                            draw.point((bx + dx, by + dy), fill=tint(COLORS["blood"], rng.randint(-8, 8)))

    torch_spots = [(28, 24), (355, 72), (58, 648), (350, 652), (188, 354)]
    for gx, gy in torch_spots:
        for radius, alpha in ((86, 30), (62, 44), (40, 62), (24, 88)):
            glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            gd = ImageDraw.Draw(glow)
            gd.ellipse([gx - radius, gy - radius, gx + radius, gy + radius], fill=(*COLORS["torch"], alpha))
            image = Image.alpha_composite(image.convert("RGBA"), glow).convert("RGB")

    vignette = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    for i in range(72):
        alpha = int((i / 72) * 8)
        vd.rectangle([i, i, width - 1 - i, height - 1 - i], outline=(0, 0, 0, alpha))
    image = Image.alpha_composite(image.convert("RGBA"), vignette).convert("RGB")

    image.save(OUT / "background.png")


def _draw_knight(draw: ImageDraw.ImageDraw, ox: int, oy: int, pose: str) -> None:
    cx, cy = ox + 32, oy + 37
    swing = {"walk_down_1": -1, "walk_down_2": 1, "walk_left_1": -1, "walk_left_2": 1, "walk_right_1": -1, "walk_right_2": 1, "walk_up_1": -1, "walk_up_2": 1}.get(pose, 0)

    draw.ellipse([cx - 7, cy - 20, cx + 7, cy - 8], fill=COLORS["silver"], outline=COLORS["silver_dark"])
    draw.rectangle([cx - 2, cy - 24, cx + 2, cy - 21], fill=COLORS["gold"])
    draw.point((cx - 2, cy - 14), COLORS["white"])
    draw.point((cx + 2, cy - 14), COLORS["white"])

    draw.rectangle([cx - 8, cy - 7, cx + 8, cy + 9], fill=COLORS["silver"], outline=COLORS["silver_dark"])
    draw.polygon([(cx - 6, cy - 4), (cx + 6, cy - 4), (cx + 3, cy + 11), (cx - 3, cy + 11)], fill=COLORS["blue"])
    draw.rectangle([cx - 11, cy - 4, cx - 5, cy + 5], fill=COLORS["silver"], outline=COLORS["silver_dark"])

    if "left" in pose:
        draw.rectangle([cx - 17, cy - 4, cx - 13, cy + 3], fill=COLORS["silver_dark"])
    elif "right" in pose:
        draw.rectangle([cx + 13, cy - 4, cx + 17, cy + 3], fill=COLORS["silver_dark"])
    else:
        draw.rectangle([cx + 10, cy - 1, cx + 12, cy + 8], fill=COLORS["silver_dark"])
        draw.rectangle([cx + 11, cy - 5, cx + 11, cy - 2], fill=COLORS["gold"])

    if "up" in pose:
        draw.rectangle([cx - 4, cy + 10 - swing, cx - 1, cy + 19], fill=COLORS["silver_dark"])
        draw.rectangle([cx + 1, cy + 10 + swing, cx + 4, cy + 19], fill=COLORS["silver_dark"])
    elif "left" in pose:
        draw.rectangle([cx - 6 + swing, cy + 10, cx - 2 + swing, cy + 19], fill=COLORS["silver_dark"])
        draw.rectangle([cx + 1 - swing, cy + 10, cx + 5 - swing, cy + 19], fill=COLORS["silver_dark"])
    elif "right" in pose:
        draw.rectangle([cx - 5 - swing, cy + 10, cx - 1 - swing, cy + 19], fill=COLORS["silver_dark"])
        draw.rectangle([cx + 2 + swing, cy + 10, cx + 6 + swing, cy + 19], fill=COLORS["silver_dark"])
    else:
        draw.rectangle([cx - 4 + swing, cy + 10, cx - 1 + swing, cy + 19], fill=COLORS["silver_dark"])
        draw.rectangle([cx + 1 - swing, cy + 10, cx + 4 - swing, cy + 19], fill=COLORS["silver_dark"])


def create_hero_sheet() -> None:
    image = Image.new("RGBA", (192, 192), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    poses = [
        (0, 0, "idle_down"), (1, 0, "walk_down_1"), (2, 0, "walk_down_2"),
        (0, 1, "walk_left_1"), (1, 1, "walk_left_2"), (2, 1, "walk_right_1"),
        (0, 2, "walk_right_2"), (1, 2, "walk_up_1"), (2, 2, "walk_up_2"),
    ]
    for c, r, pose in poses:
        _draw_knight(draw, c * 64, r * 64, pose)
    image.save(OUT / "hero-3x3-sheet.png")


def _draw_goblin(draw: ImageDraw.ImageDraw, ox: int, oy: int, pose: str) -> None:
    cx, cy = ox + 32, oy + 39
    swing = {"walk_down_1": -2, "walk_down_2": 2, "walk_left_1": -2, "walk_left_2": 2, "walk_right_1": -2, "walk_right_2": 2}.get(pose, 0)
    alert = pose == "alert"
    stunned = pose == "stunned"

    draw.ellipse([cx - 7, cy - 20, cx + 7, cy - 8], fill=COLORS["leather"], outline=(70, 56, 44))
    draw.rectangle([cx - 6, cy - 15, cx + 6, cy - 7], fill=COLORS["goblin"], outline=COLORS["goblin_dark"])
    draw.point((cx - 2, cy - 12), COLORS["eye_yellow"] if alert else COLORS["eye_red"])
    draw.point((cx + 2, cy - 12), COLORS["eye_yellow"] if alert else COLORS["eye_red"])

    body_top = cy - 5 if not stunned else cy - 2
    draw.rectangle([cx - 7, body_top, cx + 7, cy + 10], fill=COLORS["goblin"], outline=COLORS["goblin_dark"])
    draw.polygon([(cx - 6, body_top), (cx + 6, body_top), (cx + 2, cy + 12), (cx - 4, cy + 10)], fill=COLORS["goblin_dark"])

    if not stunned:
        draw.rectangle([cx + 9, cy - 1, cx + 12, cy + 6], fill=COLORS["leather"])

    if stunned:
        draw.rectangle([cx - 2, cy + 11, cx + 2, cy + 19], fill=COLORS["goblin_dark"])
        draw.line([(cx - 5, cy - 22), (cx - 1, cy - 24)], fill=COLORS["eye_yellow"])
        draw.line([(cx + 1, cy - 24), (cx + 5, cy - 22)], fill=COLORS["eye_yellow"])
    elif "left" in pose:
        draw.rectangle([cx - 6 + swing, cy + 11, cx - 2 + swing, cy + 19], fill=COLORS["goblin_dark"])
        draw.rectangle([cx + 1 - swing, cy + 11, cx + 5 - swing, cy + 19], fill=COLORS["goblin_dark"])
    elif "right" in pose:
        draw.rectangle([cx - 5 - swing, cy + 11, cx - 1 - swing, cy + 19], fill=COLORS["goblin_dark"])
        draw.rectangle([cx + 2 + swing, cy + 11, cx + 6 + swing, cy + 19], fill=COLORS["goblin_dark"])
    else:
        draw.rectangle([cx - 4 + swing, cy + 11, cx - 1 + swing, cy + 19], fill=COLORS["goblin_dark"])
        draw.rectangle([cx + 1 - swing, cy + 11, cx + 4 - swing, cy + 19], fill=COLORS["goblin_dark"])

    if alert:
        draw.rectangle([cx - 1, cy - 25, cx + 1, cy - 20], fill=COLORS["eye_yellow"])


def create_goblin_sheet() -> None:
    image = Image.new("RGBA", (192, 192), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    poses = [
        (0, 0, "idle_down"), (1, 0, "walk_down_1"), (2, 0, "walk_down_2"),
        (0, 1, "walk_left_1"), (1, 1, "walk_left_2"), (2, 1, "walk_right_1"),
        (0, 2, "walk_right_2"), (1, 2, "stunned"), (2, 2, "alert"),
    ]
    for c, r, pose in poses:
        _draw_goblin(draw, c * 64, r * 64, pose)
    image.save(OUT / "goblin-3x3-sheet.png")


def _draw_orb(draw: ImageDraw.ImageDraw, ox: int, color: tuple[int, int, int]) -> None:
    cx, cy = ox + 24, 22
    for radius, alpha in ((15, 30), (12, 48), (9, 72)):
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(*color, alpha))
    draw.ellipse([cx - 7, cy - 7, cx + 7, cy + 7], fill=color, outline=COLORS["white"])
    draw.ellipse([cx - 3, cy - 4, cx + 1, cy - 1], fill=(*COLORS["white"], 210))
    draw.ellipse([cx - 6, cy + 11, cx + 6, cy + 13], fill=(color[0] // 3, color[1] // 3, color[2] // 3, 120))


def create_orb_sheet() -> None:
    image = Image.new("RGBA", (144, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image, "RGBA")
    _draw_orb(draw, 0, COLORS["orb_gold"])
    _draw_orb(draw, 48, COLORS["orb_blue"])
    _draw_orb(draw, 96, COLORS["orb_purple"])
    image.save(OUT / "orb-sheet.png")


def main() -> None:
    create_background()
    create_hero_sheet()
    create_goblin_sheet()
    create_orb_sheet()
    print("Generated: background.png, hero-3x3-sheet.png, goblin-3x3-sheet.png, orb-sheet.png")


if __name__ == "__main__":
    main()
