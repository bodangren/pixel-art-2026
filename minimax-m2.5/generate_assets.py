#!/usr/bin/env python3
"""Optimized Pixel Art Generator for Labyrinth of the Goblin King"""

from PIL import Image, ImageDraw
import os
import random

OUTPUT_DIR = "public/games/sentence/labyrinth-goblin-king"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Palette
DARK_CHARCOAL = (26, 26, 46)
SLATE_GRAY = (42, 42, 58)
SLATE_LIGHT = (58, 58, 74)
MOSS_GREEN = (60, 80, 50)
TORCH_ORANGE = (255, 150, 50)
SILVER = (180, 180, 200)
BLUE_TABARD = (60, 80, 180)
SKIN = (230, 180, 140)
RED_EYES = (200, 50, 50)
GOBLIN_GREEN = (74, 140, 74)
GOBLIN_DARK = (50, 100, 50)
LEATHER_BROWN = (100, 70, 40)
RUSTY = (120, 80, 40)
GOLD_ORB = (255, 215, 0)
BLUE_ORB = (74, 144, 217)
PURPLE_ORB = (155, 89, 182)
ORB_GLOW = (255, 255, 200)

def create_background():
    print("Creating background...")
    img = Image.new('RGBA', (390, 700), DARK_CHARCOAL)
    draw = ImageDraw.Draw(img)

    # Draw tile grid using rectangles (much faster than per-pixel)
    for row in range(22):
        for col in range(11):
            x1 = col * 32
            y1 = row * 32
            x2 = x1 + 31
            y2 = y1 + 31
            is_wall = (row + col) % 2 == 0
            color = SLATE_LIGHT if is_wall else SLATE_GRAY
            draw.rectangle([x1, y1, x2, y2], fill=color)

    # Add moss and cracks with small rectangles (sparse, so fast enough)
    random.seed(42)
    for _ in range(200):
        x = random.randint(0, 10) * 32 + random.randint(2, 29)
        y = random.randint(0, 21) * 32 + random.randint(2, 29)
        if (y // 32 + x // 32) % 2 != 0:  # path tile
            draw.point((x, y), fill=MOSS_GREEN)

    # Torch glow pools
    for gx, gy in [(50, 50), (340, 50), (50, 650), (340, 650)]:
        for r in range(30, 0, -1):
            alpha = int(40 * (1 - r/30))
            draw.ellipse([gx-r, gy-r, gx+r, gy+r],
                       fill=TORCH_ORANGE[:3] + (alpha,))

    img.save(os.path.join(OUTPUT_DIR, "background.png"))
    print("  Saved background.png")

def create_hero():
    print("Creating hero spritesheet...")
    img = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    scale = 2

    def draw_knight(cx, cy, direction, frame):
        ox = 0 if frame == 0 else (1 if frame == 1 else -1)

        # Body
        draw.ellipse([cx+20*scale, cy+16*scale, cx+44*scale, cy+48*scale], fill=BLUE_TABARD)
        # Shoulders
        draw.ellipse([cx+16*scale, cy+12*scale, cx+24*scale, cy+20*scale], fill=SILVER)
        draw.ellipse([cx+40*scale, cy+12*scale, cx+48*scale, cy+20*scale], fill=SILVER)
        # Helmet
        draw.ellipse([cx+24*scale, cy+8*scale, cx+40*scale, cy+20*scale], fill=SILVER)
        # Crest
        draw.ellipse([cx+28*scale, cy+4*scale, cx+36*scale, cy+10*scale], fill=RED_EYES)
        # Face
        draw.ellipse([cx+26*scale, cy+20*scale, cx+38*scale, cy+28*scale], fill=SKIN)
        # Shield
        draw.ellipse([cx+12*scale, cy+28*scale, cx+20*scale, cy+44*scale], fill=SILVER)
        # Sword
        draw.rectangle([cx+44*scale, cy+(24+ox)*scale, cx+48*scale, cy+(40+ox)*scale], fill=LEATHER_BROWN)
        draw.rectangle([cx+46*scale, cy+(16+ox)*scale, cx+50*scale, cy+(28+ox)*scale], fill=SILVER)
        # Legs
        lo = 2 if frame > 0 else 0
        draw.ellipse([cx+(24-lo)*scale, cy+44*scale, cx+(28-lo)*scale, cy+56*scale], fill=SLATE_GRAY)
        draw.ellipse([cx+(36+lo)*scale, cy+44*scale, cx+(40+lo)*scale, cy+56*scale], fill=SLATE_GRAY)
        # Cape
        if direction in (0, 3):
            draw.ellipse([cx+20*scale, cy+28*scale, cx+44*scale, cy+40*scale], fill=BLUE_TABARD)

    draw_knight(0, 0, 0, 0)
    draw_knight(64, 0, 0, 1)
    draw_knight(128, 0, 0, 2)
    draw_knight(0, 64, 1, 1)
    draw_knight(64, 64, 1, 2)
    draw_knight(128, 64, 2, 1)
    draw_knight(0, 128, 2, 2)
    draw_knight(64, 128, 3, 1)
    draw_knight(128, 128, 3, 2)

    img.save(os.path.join(OUTPUT_DIR, "hero-3x3-sheet.png"))
    print("  Saved hero-3x3-sheet.png")

def create_goblin():
    print("Creating goblin spritesheet...")
    img = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    scale = 2

    def draw_goblin(cx, cy, state):
        # Body
        draw.ellipse([cx+16*scale, cy+24*scale, cx+48*scale, cy+52*scale], fill=GOBLIN_GREEN)
        # Cap
        draw.ellipse([cx+20*scale, cy+12*scale, cx+44*scale, cy+24*scale], fill=LEATHER_BROWN)
        # Ears
        draw.ellipse([cx+8*scale, cy+8*scale, cx+16*scale, cy+16*scale], fill=GOBLIN_DARK)
        draw.ellipse([cx+48*scale, cy+8*scale, cx+56*scale, cy+16*scale], fill=GOBLIN_DARK)
        # Eyes
        eye = (220, 180, 50) if state != 4 else (255, 50, 50)
        draw.ellipse([cx+26*scale, cy+24*scale, cx+30*scale, cy+28*scale], fill=eye)
        draw.ellipse([cx+34*scale, cy+24*scale, cx+38*scale, cy+28*scale], fill=eye)
        # Weapon
        draw.rectangle([cx+44*scale, cy+32*scale, cx+48*scale, cy+48*scale], fill=RUSTY)
        draw.rectangle([cx+44*scale, cy+28*scale, cx+48*scale, cy+34*scale], fill=LEATHER_BROWN)
        # Legs
        draw.ellipse([cx+20*scale, cy+52*scale, cx+28*scale, cy+60*scale], fill=GOBLIN_DARK)
        draw.ellipse([cx+36*scale, cy+52*scale, cx+44*scale, cy+60*scale], fill=GOBLIN_DARK)
        # State effects
        if state == 3:
            for sx, sy in [(24, 16), (32, 12), (36, 16)]:
                draw.ellipse([cx+sx*scale, cy+sy*scale, cx+(sx+4)*scale, cy+(sy+4)*scale], fill=(255, 255, 0))
        elif state == 4:
            draw.ellipse([cx+24*scale, cy+20*scale, cx+40*scale, cy+28*scale], fill=(255, 255, 255))

    draw_goblin(0, 0, 0)
    draw_goblin(64, 0, 1)
    draw_goblin(128, 0, 2)
    draw_goblin(0, 64, 1)
    draw_goblin(64, 64, 2)
    draw_goblin(128, 64, 1)
    draw_goblin(0, 128, 2)
    draw_goblin(64, 128, 3)
    draw_goblin(128, 128, 4)

    img.save(os.path.join(OUTPUT_DIR, "goblin-3x3-sheet.png"))
    print("  Saved goblin-3x3-sheet.png")

def create_orbs():
    print("Creating orb spritesheet...")
    img = Image.new('RGBA', (144, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    def draw_orb(cx, color, glow):
        # Glow
        draw.ellipse([cx+4, 4, cx+44, 44], fill=glow[:3] + (60,))
        # Body
        draw.ellipse([cx+14, 14, cx+34, 34], fill=color)
        # Core
        draw.ellipse([cx+19, 19, cx+29, 29], fill=ORB_GLOW)
        # Highlight
        draw.ellipse([cx+16, 10, cx+22, 16], fill=(255, 255, 255, 200))
        # Shadow
        draw.ellipse([cx+18, 36, cx+30, 44], fill=(0, 0, 0, 80))

    draw_orb(0, GOLD_ORB, GOLD_ORB)
    draw_orb(48, BLUE_ORB, BLUE_ORB)
    draw_orb(96, PURPLE_ORB, PURPLE_ORB)

    img.save(os.path.join(OUTPUT_DIR, "orb-sheet.png"))
    print("  Saved orb-sheet.png")

if __name__ == "__main__":
    create_background()
    create_hero()
    create_goblin()
    create_orbs()
    print("\nAll assets created successfully!")
    print(f"Output directory: {OUTPUT_DIR}")