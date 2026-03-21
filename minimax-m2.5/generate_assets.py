#!/usr/bin/env python3
"""Pixel Art Generator for Labyrinth of the Goblin King"""

from PIL import Image, ImageDraw
import os
import random

OUTPUT_DIR = "/home/daniel-bo/Desktop/pixel-art-benchmark/minimax-m2.5/public/games/sentence/labyrinth-goblin-king"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Palette
def rgb(r, g, b):
    return (r, g, b)

# Dungeon colors
DARK_CHARCOAL = rgb(26, 26, 46)
SLATE_GRAY = rgb(42, 42, 58)
SLATE_LIGHT = rgb(58, 58, 74)
MOSS_GREEN = rgb(60, 80, 50)
TORCH_ORANGE = rgb(255, 150, 50)
BLOOD_RED = rgb(100, 30, 30)

# Knight colors
SILVER = rgb(180, 180, 200)
BLUE_TABARD = rgb(60, 80, 180)
GOLD = rgb(220, 180, 60)
SKIN = rgb(230, 180, 140)
DARK_OUTLINE = rgb(30, 30, 50)
WHITE = rgb(255, 255, 255)
RED_EYES = rgb(200, 50, 50)

# Goblin colors
GOBLIN_GREEN = rgb(74, 140, 74)
GOBLIN_DARK = rgb(50, 100, 50)
LEATHER_BROWN = rgb(100, 70, 40)
RUSTY = rgb(120, 80, 40)

# Orb colors
GOLD_ORB = rgb(255, 215, 0)
BLUE_ORB = rgb(74, 144, 217)
PURPLE_ORB = rgb(155, 89, 182)
ORB_GLOW = rgb(255, 255, 200)

def draw_pixel(img, x, y, color, scale=1):
    if scale == 1:
        img.putpixel((x, y), color)
    else:
        for dy in range(scale):
            for dx in range(scale):
                img.putpixel((x * scale + dx, y * scale + dy), color)

def fill_rect(img, x1, y1, x2, y2, color, scale=1):
    for y in range(y1, y2):
        for x in range(x1, x2):
            draw_pixel(img, x, y, color, scale)

# Asset 1: Background (390x700, 32px tiles)
def create_background():
    print("Creating background...")
    img = Image.new('RGBA', (390, 700), (0, 0, 0, 0))
    pixels = img.load()
    
    # 11 cols x ~22 rows of 32px tiles
    for row in range(22):
        for col in range(11):
            base_x = col * 32
            base_y = row * 32
            
            # Alternate between wall and path tile colors
            is_wall = (row + col) % 2 == 0
            
            for ty in range(32):
                for tx in range(32):
                    x = base_x + tx
                    y = base_y + ty
                    if x >= 390 or y >= 700:
                        continue
                    
                    if is_wall:
                        # Wall tile - slightly raised with bevel
                        if tx < 2 or ty < 2 or tx > 29 or ty > 29:
                            pixels[x, y] = SLATE_LIGHT  # bevel
                        else:
                            pixels[x, y] = SLATE_GRAY
                    else:
                        # Path tile - worn flat stone
                        if tx < 2 and ty < 2:
                            pixels[x, y] = SLATE_GRAY
                        elif tx > 29 and ty > 29:
                            pixels[x, y] = rgb(35, 35, 55)
                        else:
                            pixels[x, y] = DARK_CHARCOAL
                    
                    # Add moss patches
                    if not is_wall and random.random() < 0.02:
                        pixels[x, y] = MOSS_GREEN
                    
                    # Add cracks
                    if random.random() < 0.01:
                        pixels[x, y] = rgb(20, 20, 40)
    
    # Add torch glow pools in corners
    for gx, gy in [(50, 50), (340, 50), (50, 650), (340, 650)]:
        for dy in range(-30, 31):
            for dx in range(-30, 31):
                dist = (dx*dx + dy*dy) ** 0.5
                if dist < 30:
                    x, y = gx + dx, gy + dy
                    if 0 <= x < 390 and 0 <= y < 700:
                        alpha = int(40 * (1 - dist/30))
                        r, g, b = TORCH_ORANGE
                        existing = pixels[x, y]
                        if len(existing) == 4:
                            pixels[x, y] = (
                                min(255, existing[0] + r * alpha // 255),
                                min(255, existing[1] + g * alpha // 255),
                                min(255, existing[2] + b * alpha // 255),
                                existing[3]
                            )
    
    # Edge fade to darkness
    for edge in range(40):
        alpha = int(255 * (1 - edge/40))
        for y in range(700):
            for x in range(edge):
                if pixels[x, y][3] > 0:
                    pixels[x, y] = pixels[x, y][:3] + (max(0, pixels[x, y][3] - alpha),)
            for y in range(700):
                for x in range(390 - edge, 390):
                    if pixels[x, y][3] > 0:
                        pixels[x, y] = pixels[x, y][:3] + (max(0, pixels[x, y][3] - alpha),)
        for y in range(edge):
            for x in range(390):
                if pixels[x, y][3] > 0:
                    pixels[x, y] = pixels[x, y][:3] + (max(0, pixels[x, y][3] - alpha),)
        for y in range(700 - edge, 700):
            for x in range(390):
                if pixels[x, y][3] > 0:
                    pixels[x, y] = pixels[x, y][:3] + (max(0, pixels[x, y][3] - alpha),)
    
    img.save(os.path.join(OUTPUT_DIR, "background.png"))
    print("  Saved background.png")

# Asset 2: Knight Hero (192x192, 3x3 grid, 64x64 each)
def create_hero():
    print("Creating hero spritesheet...")
    img = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Define sprite at 32x32, scale to 64x64
    scale = 2
    
    def draw_knight(cx, cy, direction, frame):
        # direction: 0=down, 1=left, 2=right, 3=up
        # frame: 0=idle, 1=walk1, 2=walk2
        
        offset = 0 if frame == 0 else (1 if frame == 1 else -1)
        
        # Body (round shield shape)
        for y in range(8, 24):
            for x in range(10, 22):
                draw_ellipse(img, cx + x*scale, cy + y*scale, 
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, 
                           BLUE_TABARD)
        
        # Armor shoulders
        for y in range(6, 10):
            for x in range(8, 12):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, SILVER)
        for y in range(6, 10):
            for x in range(20, 24):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, SILVER)
        
        # Helmet
        for y in range(4, 10):
            for x in range(12, 20):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, SILVER)
        
        # Helmet crest
        for y in range(2, 5):
            for x in range(14, 18):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, RED_EYES)
        
        # Face
        for y in range(10, 14):
            for x in range(13, 19):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, SKIN)
        
        # Eyes
        if direction == 0:  # facing down
            for dy in range(2):
                for dx in range(2):
                    img.putpixel((cx + (14 + dx)*scale, cy + (11 + dy)*scale), (30, 30, 50, 255))
                    img.putpixel((cx + (17 + dx)*scale, cy + (11 + dy)*scale), (30, 30, 50, 255))
        
        # Shield (left side)
        for y in range(14, 22):
            for x in range(6, 10):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, SILVER)
        # Shield emblem
        for y in range(16, 20):
            for x in range(7, 9):
                img.putpixel((cx + x*scale, cy + y*scale), BLUE_TABARD)
        
        # Sword (right side)
        for y in range(12 + offset, 20 + offset):
            for x in range(22, 24):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, LEATHER_BROWN)
        for y in range(8 + offset, 14 + offset):
            for x in range(23, 25):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, SILVER)
        
        # Legs
        leg_offset = 2 if frame > 0 else 0
        for y in range(22, 28):
            for x in range(12 - leg_offset, 14 - leg_offset):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, SLATE_GRAY)
        for y in range(22, 28):
            for x in range(18 + leg_offset, 20 + leg_offset):
                draw_ellipse(img, cx + x*scale, cy + y*scale,
                           cx + (x+1)*scale-1, cy + (y+1)*scale-1, SLATE_GRAY)
        
        # Cape
        if direction == 0 or direction == 3:
            for y in range(14, 20):
                for x in range(10, 22):
                    draw_ellipse(img, cx + x*scale, cy + y*scale,
                               cx + (x+1)*scale-1, cy + (y+1)*scale-1, BLUE_TABARD)
    
    def draw_ellipse(img, x1, y1, x2, y2, color):
        for y in range(y1, y2 + 1):
            for x in range(x1, x2 + 1):
                if 0 <= x < 192 and 0 <= y < 192:
                    img.putpixel((x, y), color)
    
    # Row 0: Idle, Walk down 1, Walk down 2
    draw_knight(0, 0, 0, 0)
    draw_knight(64, 0, 0, 1)
    draw_knight(128, 0, 0, 2)
    
    # Row 1: Walk left 1, Walk left 2, Walk right 1
    draw_knight(0, 64, 1, 1)
    draw_knight(64, 64, 1, 2)
    draw_knight(128, 64, 2, 1)
    
    # Row 2: Walk right 2, Walk up 1, Walk up 2
    draw_knight(0, 128, 2, 2)
    draw_knight(64, 128, 3, 1)
    draw_knight(128, 128, 3, 2)
    
    img.save(os.path.join(OUTPUT_DIR, "hero-3x3-sheet.png"))
    print("  Saved hero-3x3-sheet.png")

# Asset 3: Goblin Guard (192x192, 3x3 grid, 64x64 each)
def create_goblin():
    print("Creating goblin spritesheet...")
    img = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    
    def draw_goblin(cx, cy, state):
        # state: 0=idle, 1=walk1, 2=walk2, 3=stunned, 4=alert
        scale = 2
        
        # Body (hunched)
        for y in range(12, 26):
            for x in range(8, 24):
                img.putpixel((cx + x*scale, cy + y*scale), GOBLIN_GREEN)
        
        # Leather cap
        for y in range(6, 12):
            for x in range(10, 22):
                img.putpixel((cx + x*scale, cy + y*scale), LEATHER_BROWN)
        
        # Pointy ears
        for y in range(4, 8):
            for x in range(4, 8):
                img.putpixel((cx + x*scale, cy + y*scale), GOBLIN_DARK)
        for y in range(4, 8):
            for x in range(24, 28):
                img.putpixel((cx + x*scale, cy + y*scale), GOBLIN_DARK)
        
        # Face
        for y in range(12, 16):
            for x in range(12, 20):
                img.putpixel((cx + x*scale, cy + y*scale), GOBLIN_GREEN)
        
        # Beady eyes (red/yellow glow)
        eye_color = (220, 180, 50) if state != 4 else (255, 50, 50)
        for dy in range(2):
            for dx in range(2):
                img.putpixel((cx + (13 + dx)*scale, cy + (12 + dy)*scale), eye_color)
                img.putpixel((cx + (17 + dx)*scale, cy + (12 + dy)*scale), eye_color)
        
        # Nose
        for y in range(14, 16):
            for x in range(14, 16):
                img.putpixel((cx + x*scale, cy + y*scale), GOBLIN_DARK)
        
        # Weapon (rusty dagger/club)
        for y in range(16, 24):
            for x in range(22, 24):
                img.putpixel((cx + x*scale, cy + y*scale), RUSTY)
        for y in range(14, 17):
            for x in range(22, 24):
                img.putpixel((cx + x*scale, cy + y*scale), LEATHER_BROWN)
        
        # Legs
        for y in range(26, 30):
            for x in range(10, 14):
                img.putpixel((cx + x*scale, cy + y*scale), GOBLIN_DARK)
        for y in range(26, 30):
            for x in range(18, 22):
                img.putpixel((cx + x*scale, cy + y*scale), GOBLIN_DARK)
        
        # State-specific modifications
        if state == 3:  # stunned - add stars
            for dy in range(2):
                for dx in range(2):
                    img.putpixel((cx + (12 + dx)*scale, cy + (8 + dy)*scale), (255, 255, 0, 255))
                    img.putpixel((cx + (16 + dx)*scale, cy + (6 + dy)*scale), (255, 255, 0, 255))
                    img.putpixel((cx + (18 + dx)*scale, cy + (8 + dy)*scale), (255, 255, 0, 255))
        elif state == 4:  # alert - wider eyes
            for y in range(10, 14):
                for x in range(12, 20):
                    if (x - 12) < 3 or (x - 17) >= 3:
                        img.putpixel((cx + x*scale, cy + y*scale), (255, 255, 255, 255))
    
    # Row 0: Idle, Walk down 1, Walk down 2
    draw_goblin(0, 0, 0)
    draw_goblin(64, 0, 1)
    draw_goblin(128, 0, 2)
    
    # Row 1: Walk left 1, Walk left 2, Walk right 1
    draw_goblin(0, 64, 1)
    draw_goblin(64, 64, 2)
    draw_goblin(128, 64, 1)
    
    # Row 2: Walk right 2, Stunned/fleeing, Alert
    draw_goblin(0, 128, 2)
    draw_goblin(64, 128, 3)
    draw_goblin(128, 128, 4)
    
    img.save(os.path.join(OUTPUT_DIR, "goblin-3x3-sheet.png"))
    print("  Saved goblin-3x3-sheet.png")

# Asset 4: Word Orb (144x48, 1x3 grid, 48x48 each)
def create_orbs():
    print("Creating orb spritesheet...")
    img = Image.new('RGBA', (144, 48), (0, 0, 0, 0))
    
    def draw_orb(cx, cy, color, glow_color):
        scale = 2
        
        # Outer glow
        for r in range(12, 20):
            for a in range(360):
                angle = a * 3.14159 / 180
                x = int(cx + 24 + r * 1.5 * 0.9 * (1 + (r-12)/20) * 0.7 * (1 + (r-12)/20 * 0.3))
                y = int(cy + 24 + r * 1.5 * 0.9 * (1 + (r-12)/20) * 0.7 * (1 + (r-12)/20 * 0.3))
                x = int(cx + 24 + (r/20 * 16 - 8) * (1 + (r-12)/20 * 0.3))
                y = int(cy + 24 + (r/20 * 16 - 8) * (1 + (r-12)/20 * 0.3))
        
        # Simple glow - larger translucent circle
        for dy in range(-16, 17):
            for dx in range(-16, 17):
                dist = (dx*dx + dy*dy) ** 0.5
                if dist < 20:
                    x, y = cx + 24 + dx, cy + 24 + dy
                    if 0 <= x < 48 and 0 <= y < 48:
                        alpha = int(60 * (1 - dist/20))
                        existing = img.getpixel((x, y)) if x < 144 and y < 48 else (0,0,0,0)
                        if len(existing) == 4 and existing[3] > 0:
                            img.putpixel((x, y), (*glow_color, max(existing[3], alpha)))
        
        # Main orb body
        for dy in range(-10, 11):
            for dx in range(-10, 11):
                dist = (dx*dx + dy*dy) ** 0.5
                if dist < 10:
                    x, y = cx + 24 + dx, cy + 24 + dy
                    if 0 <= x < 48 and 0 <= y < 48:
                        img.putpixel((x, y), color)
        
        # Inner bright core
        for dy in range(-5, 6):
            for dx in range(-5, 6):
                dist = (dx*dx + dy*dy) ** 0.5
                if dist < 5:
                    x, y = cx + 24 + dx, cy + 24 + dy
                    if 0 <= x < 48 and 0 <= y < 48:
                        img.putpixel((x, y), ORB_GLOW)
        
        # Highlight (top left)
        for dy in range(-8, -5):
            for dx in range(-8, -5):
                dist = (dx*dx + dy*dy) ** 0.5
                if dist < 3:
                    x, y = cx + 24 + dx, cy + 24 + dy
                    if 0 <= x < 48 and 0 <= y < 48:
                        img.putpixel((x, y), (255, 255, 255, 200))
        
        # Shadow/reflection beneath
        for dy in range(12, 16):
            for dx in range(-6, 7):
                dist = abs(dx) + abs(dy - 14)
                if dist < 6:
                    x, y = cx + 24 + dx, cy + dy
                    if 0 <= x < 48 and 0 <= y < 48:
                        img.putpixel((x, y), (0, 0, 0, 80))
    
    draw_orb(0, 0, GOLD_ORB, GOLD)
    draw_orb(48, 0, BLUE_ORB, BLUE_ORB)
    draw_orb(96, 0, PURPLE_ORB, PURPLE_ORB)
    
    img.save(os.path.join(OUTPUT_DIR, "orb-sheet.png"))
    print("  Saved orb-sheet.png")

if __name__ == "__main__":
    create_background()
    create_hero()
    create_goblin()
    create_orbs()
    print("\nAll assets created successfully!")
    print(f"Output directory: {OUTPUT_DIR}")