#!/usr/bin/env python3
"""Generate pixel art assets for Labyrinth of the Goblin King."""

from PIL import Image, ImageDraw
import random
import math

random.seed(42)

OUTPUT_DIR = "/home/daniel-bo/Desktop/pixel-art-benchmark/opus-4.6"

# ─── ASSET 1: Background (390x700) ───────────────────────────────────────────

def generate_background():
    W, H = 390, 700
    TILE = 32
    img = Image.new("RGBA", (W, H), (26, 26, 46, 255))  # #1a1a2e
    draw = ImageDraw.Draw(img)

    cols = W // TILE + 1
    rows = H // TILE + 1

    # Base colors
    wall_base = (58, 58, 74)    # #3a3a4a
    path_base = (42, 42, 58)    # #2a2a3a
    dark_bg = (26, 26, 46)      # #1a1a2e

    for r in range(rows):
        for c in range(cols):
            x0 = c * TILE
            y0 = r * TILE
            x1 = min(x0 + TILE, W)
            y1 = min(y0 + TILE, H)

            # Alternate between wall-ish and path-ish tiles with some randomness
            is_wall = random.random() < 0.4
            if is_wall:
                base = wall_base
                # Slightly raised look with beveled edges
                rv = random.randint(-8, 8)
                color = (base[0] + rv, base[1] + rv, base[2] + rv, 255)
                draw.rectangle([x0, y0, x1 - 1, y1 - 1], fill=color)

                # Bevel highlight (top-left edges)
                highlight = (base[0] + 20, base[1] + 20, base[2] + 20, 255)
                draw.line([(x0, y0), (x1 - 1, y0)], fill=highlight)
                draw.line([(x0, y0), (x0, y1 - 1)], fill=highlight)

                # Bevel shadow (bottom-right edges)
                shadow = (base[0] - 15, base[1] - 15, base[2] - 15, 255)
                draw.line([(x0, y1 - 1), (x1 - 1, y1 - 1)], fill=shadow)
                draw.line([(x1 - 1, y0), (x1 - 1, y1 - 1)], fill=shadow)
            else:
                # Path tile - worn flat stone
                rv = random.randint(-6, 6)
                color = (path_base[0] + rv, path_base[1] + rv, path_base[2] + rv, 255)
                draw.rectangle([x0, y0, x1 - 1, y1 - 1], fill=color)

                # Subtle grid lines
                grid_color = (dark_bg[0] + 5, dark_bg[1] + 5, dark_bg[2] + 5, 255)
                draw.line([(x0, y0), (x1 - 1, y0)], fill=grid_color)
                draw.line([(x0, y0), (x0, y1 - 1)], fill=grid_color)

            # Random cracks
            if random.random() < 0.15:
                cx = random.randint(x0 + 4, max(x0 + 5, x1 - 4))
                cy = random.randint(y0 + 4, max(y0 + 5, y1 - 4))
                crack_len = random.randint(6, 14)
                angle = random.uniform(0, math.pi * 2)
                ex = int(cx + crack_len * math.cos(angle))
                ey = int(cy + crack_len * math.sin(angle))
                draw.line([(cx, cy), (ex, ey)], fill=(20, 20, 35, 255), width=1)

            # Moss patches
            if random.random() < 0.08:
                mx = random.randint(x0 + 2, max(x0 + 3, x1 - 6))
                my = random.randint(y0 + 2, max(y0 + 3, y1 - 6))
                moss_color = (30 + random.randint(0, 15), 55 + random.randint(0, 20), 30 + random.randint(0, 10), 120)
                for _ in range(random.randint(3, 8)):
                    px = mx + random.randint(-3, 3)
                    py = my + random.randint(-3, 3)
                    if x0 <= px < x1 and y0 <= py < y1:
                        draw.point((px, py), fill=moss_color)

    # Torch glow pools in corners/scattered
    glow_positions = [
        (45, 60), (340, 90), (60, 350), (320, 400), (180, 200),
        (100, 550), (300, 620), (200, 680), (50, 150), (350, 280)
    ]
    for gx, gy in glow_positions:
        for radius in range(40, 0, -1):
            alpha = int(8 * (1 - radius / 40.0))
            for dx in range(-radius, radius + 1, 2):
                for dy in range(-radius, radius + 1, 2):
                    if dx * dx + dy * dy <= radius * radius:
                        px, py = gx + dx, gy + dy
                        if 0 <= px < W and 0 <= py < H:
                            existing = img.getpixel((px, py))
                            nr = min(255, existing[0] + alpha)
                            ng = min(255, existing[1] + int(alpha * 0.5))
                            img.putpixel((px, py), (nr, ng, existing[2], 255))

    # Edge darkness vignette
    for y in range(H):
        for x in range(W):
            # Distance from edges
            dx = min(x, W - 1 - x) / (W * 0.3)
            dy = min(y, H - 1 - y) / (H * 0.15)
            d = min(dx, dy)
            if d < 1.0:
                factor = d * d  # quadratic falloff
                existing = img.getpixel((x, y))
                img.putpixel((x, y), (
                    int(existing[0] * factor),
                    int(existing[1] * factor),
                    int(existing[2] * factor),
                    255
                ))

    img.save(f"{OUTPUT_DIR}/background.png")
    print("Generated background.png")


# ─── ASSET 2: Hero Knight Sprite Sheet (192x192, 3x3 grid of 64x64) ─────────

def draw_knight_frame(img, ox, oy, direction, frame):
    """Draw a top-down knight at offset (ox, oy) in a 64x64 cell."""
    draw = ImageDraw.Draw(img)
    cx, cy = ox + 32, oy + 32  # center of cell

    # Colors
    silver = (192, 200, 210, 255)
    silver_light = (220, 225, 235, 255)
    silver_dark = (140, 148, 158, 255)
    blue_tabard = (60, 80, 160, 255)
    blue_dark = (40, 55, 120, 255)
    blue_cape = (50, 70, 140, 255)
    skin = (210, 180, 150, 255)
    sword_blade = (200, 210, 220, 255)
    sword_hilt = (139, 90, 43, 255)
    shield_face = (170, 178, 190, 255)
    shield_rim = (140, 148, 158, 255)
    helmet_crest = (180, 40, 40, 255)
    eye_color = (40, 40, 60, 255)
    outline = (30, 30, 50, 255)

    # Animation offset
    wobble = 0
    if frame == 1:
        wobble = -1
    elif frame == 2:
        wobble = 1

    # Body rotation based on direction
    # direction: 'down', 'left', 'right', 'up'

    # Shadow under character
    for sx in range(-10, 11):
        for sy in range(-3, 4):
            if sx * sx / 100 + sy * sy / 9 <= 1:
                draw.point((cx + sx, cy + 14 + sy), fill=(0, 0, 0, 60))

    if direction == 'down':
        # Cape/tabard behind
        draw.rectangle([cx - 8, cy - 4, cx + 8, cy + 10], fill=blue_cape)
        # Body (armor)
        draw.ellipse([cx - 10, cy - 12, cx + 10, cy + 8], fill=silver, outline=outline)
        # Tabard front
        draw.rectangle([cx - 5, cy - 6, cx + 5, cy + 6], fill=blue_tabard)
        draw.rectangle([cx - 4, cy - 5, cx + 4, cy + 5], fill=blue_dark)
        # Cross on tabard
        draw.line([(cx, cy - 4), (cx, cy + 4)], fill=(200, 200, 60, 255))
        draw.line([(cx - 3, cy), (cx + 3, cy)], fill=(200, 200, 60, 255))
        # Helmet
        draw.ellipse([cx - 9, cy - 16, cx + 9, cy - 2], fill=silver_light, outline=outline)
        # Helmet visor slit
        draw.line([(cx - 4, cy - 8), (cx + 4, cy - 8)], fill=(20, 20, 40, 255), width=2)
        # Eyes through visor
        draw.point((cx - 3, cy - 8), fill=eye_color)
        draw.point((cx + 3, cy - 8), fill=eye_color)
        # Helmet crest
        draw.line([(cx, cy - 17), (cx, cy - 13)], fill=helmet_crest, width=2)
        # Shield (left arm)
        draw.ellipse([cx - 16 + wobble, cy - 8, cx - 8 + wobble, cy + 4], fill=shield_face, outline=shield_rim)
        draw.line([(cx - 13 + wobble, cy - 5), (cx - 11 + wobble, cy + 1)], fill=blue_tabard)
        # Sword (right arm)
        draw.line([(cx + 12 - wobble, cy - 2), (cx + 12 - wobble, cy + 14)], fill=sword_blade, width=2)
        draw.rectangle([cx + 10 - wobble, cy - 3, cx + 14 - wobble, cy - 1], fill=sword_hilt)

    elif direction == 'up':
        # Cape flowing behind (visible from back)
        draw.rectangle([cx - 9, cy - 2, cx + 9, cy + 12], fill=blue_cape)
        # Cape bottom edge detail
        for i in range(-8, 9, 3):
            draw.line([(cx + i, cy + 10), (cx + i + wobble, cy + 13)], fill=blue_dark)
        # Body (armor back)
        draw.ellipse([cx - 10, cy - 12, cx + 10, cy + 8], fill=silver_dark, outline=outline)
        # Helmet from back
        draw.ellipse([cx - 9, cy - 16, cx + 9, cy - 2], fill=silver, outline=outline)
        # Crest from back
        draw.line([(cx, cy - 17), (cx, cy - 13)], fill=helmet_crest, width=2)
        # Shield (left arm, partially visible)
        draw.ellipse([cx - 15 + wobble, cy - 6, cx - 7 + wobble, cy + 4], fill=shield_rim, outline=outline)
        # Sword (right arm)
        draw.line([(cx + 11 - wobble, cy - 6), (cx + 11 - wobble, cy + 10)], fill=sword_blade, width=2)
        draw.rectangle([cx + 9 - wobble, cy - 7, cx + 13 - wobble, cy - 5], fill=sword_hilt)

    elif direction == 'left':
        # Cape trailing right
        draw.rectangle([cx + 2, cy - 4, cx + 14 + wobble, cy + 8], fill=blue_cape)
        # Body
        draw.ellipse([cx - 8, cy - 12, cx + 8, cy + 8], fill=silver, outline=outline)
        # Tabard side view
        draw.rectangle([cx - 4, cy - 6, cx + 2, cy + 6], fill=blue_tabard)
        # Helmet
        draw.ellipse([cx - 8, cy - 16, cx + 7, cy - 2], fill=silver_light, outline=outline)
        # Visor
        draw.line([(cx - 6, cy - 8), (cx - 1, cy - 8)], fill=(20, 20, 40, 255), width=2)
        draw.point((cx - 5, cy - 8), fill=eye_color)
        # Crest
        draw.line([(cx, cy - 17), (cx, cy - 13)], fill=helmet_crest, width=2)
        # Shield (facing left, prominent)
        draw.ellipse([cx - 16, cy - 10, cx - 6, cy + 4], fill=shield_face, outline=shield_rim)
        draw.line([(cx - 12, cy - 7), (cx - 10, cy + 1)], fill=blue_tabard)
        # Sword behind
        draw.line([(cx + 6, cy - 4 + wobble), (cx + 6, cy + 12 + wobble)], fill=sword_blade, width=2)

    elif direction == 'right':
        # Cape trailing left
        draw.rectangle([cx - 14 - wobble, cy - 4, cx - 2, cy + 8], fill=blue_cape)
        # Body
        draw.ellipse([cx - 8, cy - 12, cx + 8, cy + 8], fill=silver, outline=outline)
        # Tabard side view
        draw.rectangle([cx - 2, cy - 6, cx + 4, cy + 6], fill=blue_tabard)
        # Helmet
        draw.ellipse([cx - 7, cy - 16, cx + 8, cy - 2], fill=silver_light, outline=outline)
        # Visor
        draw.line([(cx + 1, cy - 8), (cx + 6, cy - 8)], fill=(20, 20, 40, 255), width=2)
        draw.point((cx + 5, cy - 8), fill=eye_color)
        # Crest
        draw.line([(cx, cy - 17), (cx, cy - 13)], fill=helmet_crest, width=2)
        # Sword (facing right, prominent)
        draw.line([(cx + 12, cy - 4 + wobble), (cx + 12, cy + 12 + wobble)], fill=sword_blade, width=2)
        draw.rectangle([cx + 10, cy - 5 + wobble, cx + 14, cy - 3 + wobble], fill=sword_hilt)
        # Shield behind
        draw.ellipse([cx + 6, cy - 10, cx + 16, cy + 4], fill=shield_rim, outline=outline)


def generate_hero():
    img = Image.new("RGBA", (192, 192), (0, 0, 0, 0))

    # Row 0: down (idle, walk1, walk2)
    draw_knight_frame(img, 0, 0, 'down', 0)    # Idle
    draw_knight_frame(img, 64, 0, 'down', 1)   # Walk frame 1
    draw_knight_frame(img, 128, 0, 'down', 2)  # Walk frame 2

    # Row 1: left (walk1, walk2), right (walk1)
    draw_knight_frame(img, 0, 64, 'left', 1)
    draw_knight_frame(img, 64, 64, 'left', 2)
    draw_knight_frame(img, 128, 64, 'right', 1)

    # Row 2: right (walk2), up (walk1, walk2)
    draw_knight_frame(img, 0, 128, 'right', 2)
    draw_knight_frame(img, 64, 128, 'up', 1)
    draw_knight_frame(img, 128, 128, 'up', 2)

    img.save(f"{OUTPUT_DIR}/hero-3x3-sheet.png")
    print("Generated hero-3x3-sheet.png")


# ─── ASSET 3: Goblin Guard Sprite Sheet (192x192, 3x3 grid of 64x64) ────────

def draw_goblin_frame(img, ox, oy, direction, frame, special=None):
    """Draw a top-down goblin at offset (ox, oy) in a 64x64 cell."""
    draw = ImageDraw.Draw(img)
    cx, cy = ox + 32, oy + 32

    # Colors
    green_skin = (74, 140, 74, 255)       # #4a8c4a
    green_dark = (50, 100, 50, 255)
    green_light = (90, 160, 90, 255)
    leather = (100, 70, 40, 255)
    leather_dark = (70, 50, 30, 255)
    eye_red = (220, 60, 30, 255)
    eye_yellow = (240, 200, 40, 255)
    rusty_weapon = (160, 100, 60, 255)
    rusty_dark = (120, 75, 45, 255)
    outline = (30, 40, 30, 255)
    ear_inner = (60, 110, 60, 255)

    wobble = 0
    if frame == 1:
        wobble = -1
    elif frame == 2:
        wobble = 1

    # Shadow
    for sx in range(-8, 9):
        for sy in range(-3, 4):
            if sx * sx / 64 + sy * sy / 9 <= 1:
                draw.point((cx + sx, cy + 12 + sy), fill=(0, 0, 0, 50))

    if special == 'stunned':
        # Stunned/fleeing - hunched, arms up, dizzy
        draw.ellipse([cx - 9, cy - 10, cx + 9, cy + 8], fill=green_skin, outline=outline)
        draw.ellipse([cx - 8, cy - 14, cx + 8, cy - 1], fill=green_skin, outline=outline)
        # Dizzy eyes (X X)
        draw.line([(cx - 5, cy - 9), (cx - 2, cy - 6)], fill=eye_yellow)
        draw.line([(cx - 5, cy - 6), (cx - 2, cy - 9)], fill=eye_yellow)
        draw.line([(cx + 2, cy - 9), (cx + 5, cy - 6)], fill=eye_yellow)
        draw.line([(cx + 2, cy - 6), (cx + 5, cy - 9)], fill=eye_yellow)
        # Leather cap askew
        draw.arc([cx - 9, cy - 16, cx + 5, cy - 6], 180, 360, fill=leather, width=2)
        # Stars around head
        for angle_deg in [0, 90, 180, 270]:
            angle = math.radians(angle_deg + wobble * 30)
            sx = cx + int(12 * math.cos(angle))
            sy = cy - 8 + int(8 * math.sin(angle))
            draw.point((sx, sy), fill=(255, 255, 100, 255))
            draw.point((sx + 1, sy), fill=(255, 255, 100, 200))
        # Ears drooping
        draw.polygon([(cx - 10, cy - 8), (cx - 16, cy - 4), (cx - 10, cy - 3)], fill=green_light, outline=outline)
        draw.polygon([(cx + 10, cy - 8), (cx + 16, cy - 4), (cx + 10, cy - 3)], fill=green_light, outline=outline)
        return

    if special == 'alert':
        # Alert - facing down, eyes wide, weapon raised
        draw.ellipse([cx - 9, cy - 10, cx + 9, cy + 8], fill=green_skin, outline=outline)
        draw.ellipse([cx - 8, cy - 14, cx + 8, cy - 1], fill=green_skin, outline=outline)
        # Big alert eyes
        draw.ellipse([cx - 6, cy - 10, cx - 1, cy - 5], fill=(255, 255, 200, 255), outline=outline)
        draw.ellipse([cx + 1, cy - 10, cx + 6, cy - 5], fill=(255, 255, 200, 255), outline=outline)
        draw.ellipse([cx - 4, cy - 9, cx - 2, cy - 6], fill=eye_red)
        draw.ellipse([cx + 2, cy - 9, cx + 4, cy - 6], fill=eye_red)
        # Leather cap
        draw.arc([cx - 9, cy - 16, cx + 9, cy - 6], 180, 360, fill=leather, width=3)
        # Pointed ears up (alert)
        draw.polygon([(cx - 9, cy - 10), (cx - 17, cy - 14), (cx - 9, cy - 6)], fill=green_light, outline=outline)
        draw.polygon([(cx + 9, cy - 10), (cx + 17, cy - 14), (cx + 9, cy - 6)], fill=green_light, outline=outline)
        # Exclamation mark
        draw.line([(cx, cy - 22), (cx, cy - 18)], fill=(255, 60, 60, 255), width=2)
        draw.point((cx, cy - 16), fill=(255, 60, 60, 255))
        # Weapon raised
        draw.line([(cx + 10, cy - 14), (cx + 14, cy - 20)], fill=rusty_weapon, width=2)
        draw.rectangle([cx + 8, cy - 4, cx + 12, cy - 2], fill=rusty_dark)
        return

    # Normal directional poses
    if direction == 'down':
        # Body - hunched
        draw.ellipse([cx - 9, cy - 8, cx + 9, cy + 10], fill=green_skin, outline=outline)
        # Leather vest
        draw.rectangle([cx - 5, cy - 4, cx + 5, cy + 6], fill=leather)
        draw.rectangle([cx - 4, cy - 3, cx + 4, cy + 5], fill=leather_dark)
        # Head
        draw.ellipse([cx - 8, cy - 14, cx + 8, cy - 1], fill=green_skin, outline=outline)
        # Leather cap
        draw.arc([cx - 8, cy - 16, cx + 8, cy - 6], 180, 360, fill=leather, width=3)
        # Beady eyes (glowing)
        draw.ellipse([cx - 5, cy - 9, cx - 2, cy - 6], fill=eye_yellow, outline=eye_red)
        draw.ellipse([cx + 2, cy - 9, cx + 5, cy - 6], fill=eye_yellow, outline=eye_red)
        # Pointy ears
        draw.polygon([(cx - 9, cy - 8), (cx - 16, cy - 10), (cx - 9, cy - 4)], fill=green_light, outline=outline)
        draw.polygon([(cx + 9, cy - 8), (cx + 16, cy - 10), (cx + 9, cy - 4)], fill=green_light, outline=outline)
        # Inner ear
        draw.line([(cx - 13, cy - 9), (cx - 10, cy - 7)], fill=ear_inner)
        draw.line([(cx + 13, cy - 9), (cx + 10, cy - 7)], fill=ear_inner)
        # Mouth/nose
        draw.point((cx, cy - 4), fill=green_dark)
        draw.line([(cx - 2, cy - 2), (cx + 2, cy - 2)], fill=(40, 70, 40, 255))
        # Weapon (right hand)
        draw.line([(cx + 10 - wobble, cy + 0), (cx + 10 - wobble, cy + 14)], fill=rusty_weapon, width=2)
        draw.rectangle([cx + 8 - wobble, cy - 1, cx + 12 - wobble, cy + 1], fill=rusty_dark)
        # Left arm
        draw.line([(cx - 10 + wobble, cy + 0), (cx - 12 + wobble, cy + 6)], fill=green_dark, width=2)

    elif direction == 'up':
        # Body from back
        draw.ellipse([cx - 9, cy - 8, cx + 9, cy + 10], fill=green_dark, outline=outline)
        draw.rectangle([cx - 5, cy - 4, cx + 5, cy + 6], fill=leather_dark)
        # Head from back
        draw.ellipse([cx - 8, cy - 14, cx + 8, cy - 1], fill=green_dark, outline=outline)
        # Cap
        draw.arc([cx - 8, cy - 16, cx + 8, cy - 6], 180, 360, fill=leather, width=3)
        # Ears from back
        draw.polygon([(cx - 9, cy - 8), (cx - 16, cy - 10), (cx - 9, cy - 4)], fill=green_skin, outline=outline)
        draw.polygon([(cx + 9, cy - 8), (cx + 16, cy - 10), (cx + 9, cy - 4)], fill=green_skin, outline=outline)
        # Weapon
        draw.line([(cx + 9 - wobble, cy - 4), (cx + 9 - wobble, cy + 10)], fill=rusty_weapon, width=2)
        # Left arm
        draw.line([(cx - 10 + wobble, cy + 0), (cx - 12 + wobble, cy + 6)], fill=green_dark, width=2)

    elif direction == 'left':
        # Body
        draw.ellipse([cx - 7, cy - 8, cx + 7, cy + 10], fill=green_skin, outline=outline)
        draw.rectangle([cx - 4, cy - 4, cx + 3, cy + 6], fill=leather)
        # Head
        draw.ellipse([cx - 7, cy - 14, cx + 7, cy - 1], fill=green_skin, outline=outline)
        # Cap
        draw.arc([cx - 7, cy - 16, cx + 7, cy - 6], 180, 360, fill=leather, width=3)
        # Eye (one visible)
        draw.ellipse([cx - 5, cy - 9, cx - 2, cy - 6], fill=eye_yellow, outline=eye_red)
        # Ear (left side, prominent)
        draw.polygon([(cx - 8, cy - 8), (cx - 17, cy - 10), (cx - 8, cy - 4)], fill=green_light, outline=outline)
        # Nose/snout
        draw.point((cx - 6, cy - 4), fill=green_dark)
        # Weapon
        draw.line([(cx + 5, cy - 2 + wobble), (cx + 5, cy + 12 + wobble)], fill=rusty_weapon, width=2)
        # Arms
        draw.line([(cx - 6 + wobble, cy + 2), (cx - 9 + wobble, cy + 8)], fill=green_dark, width=2)

    elif direction == 'right':
        # Body
        draw.ellipse([cx - 7, cy - 8, cx + 7, cy + 10], fill=green_skin, outline=outline)
        draw.rectangle([cx - 3, cy - 4, cx + 4, cy + 6], fill=leather)
        # Head
        draw.ellipse([cx - 7, cy - 14, cx + 7, cy - 1], fill=green_skin, outline=outline)
        # Cap
        draw.arc([cx - 7, cy - 16, cx + 7, cy - 6], 180, 360, fill=leather, width=3)
        # Eye (one visible)
        draw.ellipse([cx + 2, cy - 9, cx + 5, cy - 6], fill=eye_yellow, outline=eye_red)
        # Ear (right side)
        draw.polygon([(cx + 8, cy - 8), (cx + 17, cy - 10), (cx + 8, cy - 4)], fill=green_light, outline=outline)
        # Nose
        draw.point((cx + 6, cy - 4), fill=green_dark)
        # Weapon
        draw.line([(cx + 8, cy - 2 + wobble), (cx + 8, cy + 12 + wobble)], fill=rusty_weapon, width=2)
        # Arms
        draw.line([(cx + 6 - wobble, cy + 2), (cx + 9 - wobble, cy + 8)], fill=green_dark, width=2)


def generate_goblin():
    img = Image.new("RGBA", (192, 192), (0, 0, 0, 0))

    # Row 0: down (idle, walk1, walk2)
    draw_goblin_frame(img, 0, 0, 'down', 0)
    draw_goblin_frame(img, 64, 0, 'down', 1)
    draw_goblin_frame(img, 128, 0, 'down', 2)

    # Row 1: left (walk1, walk2), right (walk1)
    draw_goblin_frame(img, 0, 64, 'left', 1)
    draw_goblin_frame(img, 64, 64, 'left', 2)
    draw_goblin_frame(img, 128, 64, 'right', 1)

    # Row 2: right (walk2), stunned, alert
    draw_goblin_frame(img, 0, 128, 'right', 2)
    draw_goblin_frame(img, 64, 128, 'down', 0, special='stunned')
    draw_goblin_frame(img, 128, 128, 'down', 0, special='alert')

    img.save(f"{OUTPUT_DIR}/goblin-3x3-sheet.png")
    print("Generated goblin-3x3-sheet.png")


# ─── ASSET 4: Word Orb Sheet (144x48, 1 row x 3 cols of 48x48) ──────────────

def draw_orb(img, ox, oy, color_name):
    """Draw a magical floating orb in a 48x48 cell."""
    draw = ImageDraw.Draw(img)
    cx, cy = ox + 24, oy + 24

    if color_name == 'gold':
        core = (255, 230, 100, 255)
        mid = (255, 215, 0, 200)
        outer = (255, 200, 0, 80)
        glow = (255, 215, 0, 40)
        highlight = (255, 255, 200, 255)
    elif color_name == 'blue':
        core = (130, 180, 255, 255)
        mid = (74, 144, 217, 200)
        outer = (74, 144, 217, 80)
        glow = (74, 144, 217, 40)
        highlight = (200, 220, 255, 255)
    else:  # purple
        core = (180, 130, 220, 255)
        mid = (155, 89, 182, 200)
        outer = (155, 89, 182, 80)
        glow = (155, 89, 182, 40)
        highlight = (220, 200, 255, 255)

    # Outer glow
    for r in range(18, 0, -1):
        alpha = int(glow[3] * (1 - r / 18.0))
        g_color = (glow[0], glow[1], glow[2], alpha)
        draw.ellipse([cx - r, cy - r - 2, cx + r, cy + r - 2], fill=g_color)

    # Shadow beneath (floating effect)
    draw.ellipse([cx - 6, cy + 10, cx + 6, cy + 14], fill=(0, 0, 0, 40))
    draw.ellipse([cx - 4, cy + 11, cx + 4, cy + 13], fill=(0, 0, 0, 60))

    # Main orb body (shifted up slightly for floating)
    orb_cy = cy - 2
    draw.ellipse([cx - 10, orb_cy - 10, cx + 10, orb_cy + 10], fill=mid)
    draw.ellipse([cx - 8, orb_cy - 8, cx + 8, orb_cy + 8], fill=core)

    # Inner highlight (upper left)
    draw.ellipse([cx - 6, orb_cy - 7, cx - 1, orb_cy - 2], fill=highlight)
    # Small specular highlight
    draw.point((cx - 4, orb_cy - 5), fill=(255, 255, 255, 255))
    draw.point((cx - 3, orb_cy - 5), fill=(255, 255, 255, 255))
    draw.point((cx - 4, orb_cy - 4), fill=(255, 255, 255, 200))

    # Outer rim
    draw.arc([cx - 10, orb_cy - 10, cx + 10, orb_cy + 10], 0, 360, fill=outer, width=1)

    # Sparkle points around orb
    sparkle_positions = [(cx - 12, orb_cy - 8), (cx + 11, orb_cy - 5),
                         (cx - 8, orb_cy + 10), (cx + 9, orb_cy + 8)]
    for sx, sy in sparkle_positions:
        if 0 <= sx - ox < 48 and 0 <= sy - oy < 48:
            draw.point((sx, sy), fill=(255, 255, 255, 180))


def generate_orbs():
    img = Image.new("RGBA", (144, 48), (0, 0, 0, 0))

    draw_orb(img, 0, 0, 'gold')
    draw_orb(img, 48, 0, 'blue')
    draw_orb(img, 96, 0, 'purple')

    img.save(f"{OUTPUT_DIR}/orb-sheet.png")
    print("Generated orb-sheet.png")


# ─── Generate all assets ─────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Generating pixel art assets...")
    generate_background()
    generate_hero()
    generate_goblin()
    generate_orbs()
    print("Done! All assets saved to", OUTPUT_DIR)
