#!/usr/bin/env python3
"""
Pixel Art Benchmark Generator for Gemini-3-flash
Creates 4 game assets: background, hero sprite sheet, goblin sprite sheet, word orbs
"""

import os
from PIL import Image, ImageDraw
import random
import math

# Output directory is the root of Gemini-3-flash
OUTPUT_DIR = "."

# Color palette
COLORS = {
    "transparent": (0, 0, 0, 0),
    "dark_charcoal": (26, 26, 46),      # #1a1a2e
    "slate_dark": (42, 42, 58),         # #2a2a3a
    "slate_light": (58, 58, 74),        # #3a3a4a
    "moss_green": (74, 140, 74, 180),   # Desaturated green with some alpha
    "torch_orange": (255, 140, 0, 80),  # Warm torch glow (transparent)
    "blood_red": (140, 20, 20, 150),    # Dried bloodstains
    "silver": (192, 192, 192),          # Knight armor
    "blue_tabard": (30, 80, 180),       # Knight tabard
    "gold": (255, 215, 0),              # Gold crest/eyes
    "goblin_green": (74, 140, 74),      # #4a8c4a
    "goblin_dark": (42, 82, 42),        # Darker green for shading
    "goblin_red": (220, 40, 40),        # Red eyes
    "leather_brown": (139, 69, 19),     # Leather cap
    "gold_orb": (255, 215, 0),          # #ffd700
    "blue_orb": (74, 144, 217),         # #4a90d9
    "purple_orb": (155, 89, 182),       # #9b59b6
    "white": (255, 255, 255),
    "black": (0, 0, 0),
}

def create_background():
    """Create 390x700px dungeon background with 32px tile grid"""
    img = Image.new("RGBA", (390, 700), COLORS["dark_charcoal"])
    draw = ImageDraw.Draw(img)

    tile_size = 32
    cols = 390 // tile_size + 1
    rows = 700 // tile_size + 1

    random.seed(303) # Flashy seed

    # Draw tiles
    for row in range(rows):
        for col in range(cols):
            x = col * tile_size
            y = row * tile_size

            # Randomize path/wall slightly for generic dungeon texture
            # Wall tiles are slightly raised and beveled
            # Path tiles are worn flat
            is_wall = random.random() < 0.3
            base_color = COLORS["slate_light"] if is_wall else COLORS["slate_dark"]

            # Draw base tile
            draw.rectangle([x, y, x + tile_size - 1, y + tile_size - 1], fill=base_color)

            # Draw beveled edges for wall tiles
            if is_wall:
                # Top highlight
                draw.line([x, y, x + tile_size - 1, y], fill=(80, 80, 100), width=1)
                # Left highlight
                draw.line([x, y, x, y + tile_size - 1], fill=(80, 80, 100), width=1)
                # Bottom shadow
                draw.line([x, y + tile_size - 1, x + tile_size - 1, y + tile_size - 1], fill=(20, 20, 30), width=1)
                # Right shadow
                draw.line([x + tile_size - 1, y, x + tile_size - 1, y + tile_size - 1], fill=(20, 20, 30), width=1)
            else:
                # Path tiles get subtle texture (wear/tear)
                for _ in range(3):
                    px = x + random.randint(2, 30)
                    py = y + random.randint(2, 30)
                    draw.point((px, py), fill=COLORS["dark_charcoal"])

            # Add cracks
            if random.random() < 0.1:
                cx = x + random.randint(4, 28)
                cy = y + random.randint(4, 28)
                length = random.randint(3, 8)
                for i in range(length):
                    nx = cx + random.randint(-1, 1)
                    ny = cy + i
                    if 0 <= nx < 390 and 0 <= ny < 700:
                        draw.point((nx, ny), fill=COLORS["black"])

            # Add moss
            if random.random() < 0.08:
                mx = x + random.randint(2, 26)
                my = y + random.randint(2, 26)
                draw.rectangle([mx, my, mx + random.randint(2, 5), my + random.randint(2, 5)], fill=COLORS["moss_green"])

            # Add bloodstains
            if random.random() < 0.015:
                bx = x + random.randint(5, 25)
                by = y + random.randint(5, 25)
                draw.ellipse([bx, by, bx + 5, by + 3], fill=COLORS["blood_red"])

    # Atmosphere: Fade edges to darkness
    overlay = Image.new("RGBA", (390, 700), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    for i in range(50):
        alpha = int(255 * (1 - (i/50)**0.5))
        # Top edge
        ov_draw.line([0, i, 390, i], fill=(26, 26, 46, 255-alpha))
        # Bottom edge
        ov_draw.line([0, 700-i, 390, 700-i], fill=(26, 26, 46, 255-alpha))
        # Left edge
        ov_draw.line([i, 0, i, 700], fill=(26, 26, 46, 255-alpha))
        # Right edge
        ov_draw.line([390-i, 0, 390-i, 700], fill=(26, 26, 46, 255-alpha))

    # Add torch glow pools
    for _ in range(8):
        tx = random.randint(50, 340)
        ty = random.randint(50, 650)
        for r in range(60, 0, -5):
            alpha = int(80 * (1 - r/60))
            ov_draw.ellipse([tx-r, ty-r, tx+r, ty+r], fill=(255, 140, 0, alpha))

    img = Image.alpha_composite(img, overlay)
    img = img.convert("RGB") # Prompt says PNG, but background usually doesn't need transparency. Actually it says "(except the background itself)".
    img.save(os.path.join(OUTPUT_DIR, "background.png"))
    print("✓ Created background.png")

def draw_knight(draw, x_off, y_off, pose):
    """Draw a 64x64 knight cell"""
    # Knight body center
    cx, cy = x_off + 32, y_off + 32

    # Leg animation
    leg_y = cy + 12
    l1, l2 = 0, 0
    if "1" in pose: l1 = -4
    if "2" in pose: l2 = -4

    # Body (Torso)
    draw.rectangle([cx-6, cy-5, cx+6, cy+8], fill=COLORS["silver"], outline=COLORS["black"])
    # Tabard
    draw.rectangle([cx-5, cy-2, cx+5, cy+7], fill=COLORS["blue_tabard"])

    # Head (Helmet)
    draw.rectangle([cx-4, cy-15, cx+4, cy-6], fill=COLORS["silver"], outline=COLORS["black"])
    # Crest
    draw.rectangle([cx-1, cy-18, cx+1, cy-16], fill=COLORS["gold"])

    # Shield (Always top-down perspective, shield on left arm)
    draw.ellipse([cx-12, cy-2, cx-5, cy+8], fill=COLORS["silver"], outline=COLORS["black"])

    # Sword (In right hand)
    draw.rectangle([cx+6, cy+2, cx+8, cy+14], fill=COLORS["silver"], outline=COLORS["black"])

    # Face/Visor
    draw.line([cx-2, cy-10, cx+2, cy-10], fill=COLORS["black"])

    # Legs (simplified walk)
    if "down" in pose or "up" in pose:
        draw.rectangle([cx-4, leg_y+l1, cx-1, leg_y+l1+6], fill=COLORS["black"])
        draw.rectangle([cx+1, leg_y+l2, cx+4, leg_y+l2+6], fill=COLORS["black"])
    elif "left" in pose:
        draw.rectangle([cx-3, leg_y+l1, cx, leg_y+l1+6], fill=COLORS["black"])
        draw.rectangle([cx+1, leg_y+l2, cx+4, leg_y+l2+6], fill=COLORS["black"])
    elif "right" in pose:
        draw.rectangle([cx-4, leg_y+l1, cx-1, leg_y+l1+6], fill=COLORS["black"])
        draw.rectangle([cx, leg_y+l2, cx+3, leg_y+l2+6], fill=COLORS["black"])

def create_hero_sheet():
    img = Image.new("RGBA", (192, 192), COLORS["transparent"])
    draw = ImageDraw.Draw(img)
    poses = [
        (0,0,"down_idle"), (1,0,"down_1"), (2,0,"down_2"),
        (0,1,"left_1"), (1,1,"left_2"), (2,1,"right_1"),
        (0,2,"right_2"), (1,2,"up_1"), (2,2,"up_2")
    ]
    for c, r, p in poses:
        draw_knight(draw, c*64, r*64, p)
    img.save(os.path.join(OUTPUT_DIR, "hero-3x3-sheet.png"))
    print("✓ Created hero-3x3-sheet.png")

def draw_goblin(draw, x_off, y_off, pose):
    """Draw a 64x64 goblin cell"""
    cx, cy = x_off + 32, y_off + 34 # Lower center for hunched look

    # Body (Hunched)
    draw.ellipse([cx-7, cy-5, cx+7, cy+10], fill=COLORS["goblin_green"], outline=COLORS["goblin_dark"])

    # Head
    draw.ellipse([cx-5, cy-14, cx+5, cy-4], fill=COLORS["goblin_green"], outline=COLORS["goblin_dark"])
    # Cap
    draw.chord([cx-6, cy-16, cx+6, cy-8], 180, 360, fill=COLORS["leather_brown"], outline=COLORS["black"])

    # Eyes
    eye_c = COLORS["goblin_red"]
    if "alert" in pose: eye_c = COLORS["gold"]
    draw.point((cx-2, cy-9), fill=eye_c)
    draw.point((cx+2, cy-9), fill=eye_c)

    # Weapon (Rusty dagger/club)
    draw.rectangle([cx+6, cy, cx+9, cy+10], fill=COLORS["leather_brown"], outline=COLORS["black"])

    # Legs (simplified)
    leg_y = cy+10
    l1, l2 = 0, 0
    if "1" in pose: l1 = -3
    if "2" in pose: l2 = -3
    if "stunned" in pose:
        # Legs splayed
        draw.rectangle([cx-5, leg_y, cx-2, leg_y+4], fill=COLORS["black"])
        draw.rectangle([cx+2, leg_y, cx+5, leg_y+4], fill=COLORS["black"])
    else:
        draw.rectangle([cx-3, leg_y+l1, cx-1, leg_y+l1+5], fill=COLORS["black"])
        draw.rectangle([cx+1, leg_y+l2, cx+3, leg_y+l2+5], fill=COLORS["black"])

def create_goblin_sheet():
    img = Image.new("RGBA", (192, 192), COLORS["transparent"])
    draw = ImageDraw.Draw(img)
    poses = [
        (0,0,"down_idle"), (1,0,"down_1"), (2,0,"down_2"),
        (0,1,"left_1"), (1,1,"left_2"), (2,1,"right_1"),
        (0,2,"right_2"), (1,2,"stunned"), (2,2,"alert")
    ]
    for c, r, p in poses:
        draw_goblin(draw, c*64, r*64, p)
    img.save(os.path.join(OUTPUT_DIR, "goblin-3x3-sheet.png"))
    print("✓ Created goblin-3x3-sheet.png")

def draw_orb(draw, x_off, y_off, color):
    cx, cy = x_off + 24, y_off + 24
    # Outer glow
    for r in range(12, 6, -1):
        alpha = int(100 * (1 - (r-6)/6))
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(color[0], color[1], color[2], alpha))
    # Core
    draw.ellipse([cx-6, cy-6, cx+6, cy+6], fill=color, outline=COLORS["white"])
    # Highlight
    draw.point((cx-2, cy-2), fill=COLORS["white"])
    # Shadow
    draw.ellipse([cx-4, cy+10, cx+4, cy+12], fill=(0,0,0,80))

def create_orb_sheet():
    img = Image.new("RGBA", (144, 48), COLORS["transparent"])
    draw = ImageDraw.Draw(img)
    draw_orb(draw, 0, 0, COLORS["gold_orb"])
    draw_orb(draw, 48, 0, COLORS["blue_orb"])
    draw_orb(draw, 96, 0, COLORS["purple_orb"])
    img.save(os.path.join(OUTPUT_DIR, "orb-sheet.png"))
    print("✓ Created orb-sheet.png")

if __name__ == "__main__":
    create_background()
    create_hero_sheet()
    create_goblin_sheet()
    create_orb_sheet()
