#!/usr/bin/env python3
"""
Pixel Art Benchmark Generator for Gemini-3.1-pro
Creates 4 game assets: background, hero sprite sheet, goblin sprite sheet, word orbs
"""

import os
from PIL import Image, ImageDraw, ImageFilter
import random
import math

OUTPUT_DIR = "/home/daniel-bo/Desktop/pixel-art-benchmark/Gemini-3.1-pro"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Shared Colors
COLORS = {
    '0': (0, 0, 0, 0),         # Transparent
    '1': (10, 10, 20, 255),    # Black outline
    # Hero Palette
    '2': (180, 180, 200, 255), # Silver armor
    '3': (220, 220, 240, 255), # Silver highlight
    '4': (40, 80, 160, 255),   # Blue tabard
    '5': (60, 120, 200, 255),  # Blue tabard highlight
    '6': (255, 200, 150, 255), # Skin
    '7': (255, 215, 0, 255),   # Gold crest
    '8': (140, 140, 160, 255), # Shield base
    '9': (240, 240, 255, 255), # Sword blade
    'A': (100, 60, 20, 255),   # Sword hilt / leather
    # Goblin Palette
    'G': (74, 140, 74, 255),   # Goblin green
    'D': (40, 90, 40, 255),    # Goblin dark green
    'L': (120, 80, 40, 255),   # Leather brown
    'R': (220, 40, 40, 255),   # Red eye
    'Y': (255, 230, 40, 255),  # Yellow eye (alert)
    'B': (150, 150, 150, 255), # Blade
    'W': (200, 200, 200, 255), # White
}

def render_matrix(matrix, cell_size=64, scale=4):
    """Render a 16x16 string matrix into an RGBA Image of cell_size x cell_size"""
    img = Image.new('RGBA', (cell_size, cell_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate offset to center the 16x16 sprite (which is 64x64 when scaled)
    # If cell_size is 64 and scale is 4, offset is 0
    offset_x = (cell_size - len(matrix[0]) * scale) // 2
    offset_y = (cell_size - len(matrix) * scale) // 2
    
    for y, row in enumerate(matrix):
        for x, char in enumerate(row):
            if char in COLORS and char != '0':
                px = offset_x + x * scale
                py = offset_y + y * scale
                draw.rectangle([px, py, px + scale - 1, py + scale - 1], fill=COLORS[char])
    return img

def create_hero_sheet():
    # 16x16 matrices
    base_head = [
        "0000011110000000",
        "0000177771000000",
        "0000133221000000",
        "0000122221000000",
        "0001111111100000",
    ]
    base_torso_down = [
        "0112214444122110",
        "1888114554112291",
        "1888114444112291",
        "188811444411A291",
        "0111011111101110",
    ]
    base_torso_left = [
        "0000114444110000",
        "0011145544411100",
        "0188144444412910",
        "0188144444412910",
        "0011011111101100",
    ]
    base_torso_right = [
        "0000114444110000",
        "0011144554411100",
        "0192144444418810",
        "0192144444418810",
        "0011011111101100",
    ]
    base_torso_up = [
        "0112214444122110",
        "1922114444118881",
        "1922114444118881",
        "192A114444118881",
        "0111011111101110",
    ]
    
    legs_idle = [
        "0000012222100000",
        "0000012222100000",
        "0000011111100000",
        "0000000000000000",
        "0000000000000000",
        "0000000000000000",
    ]
    legs_walk1 = [
        "0000012211000000",
        "0000012210000000",
        "0000011110000000",
        "0000000000000000",
        "0000000000000000",
        "0000000000000000",
    ]
    legs_walk2 = [
        "0000001122100000",
        "0000000122100000",
        "0000000111100000",
        "0000000000000000",
        "0000000000000000",
        "0000000000000000",
    ]
    
    def build_frame(head, torso, legs):
        return head + torso + legs

    frames = [
        # Row 0: Down
        build_frame(base_head, base_torso_down, legs_idle),
        build_frame(base_head, base_torso_down, legs_walk1),
        build_frame(base_head, base_torso_down, legs_walk2),
        # Row 1: Left, Left, Right
        build_frame(base_head, base_torso_left, legs_walk1),
        build_frame(base_head, base_torso_left, legs_walk2),
        build_frame(base_head, base_torso_right, legs_walk1),
        # Row 2: Right, Up, Up
        build_frame(base_head, base_torso_right, legs_walk2),
        build_frame(base_head, base_torso_up, legs_walk1),
        build_frame(base_head, base_torso_up, legs_walk2),
    ]

    sheet = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        x = (i % 3) * 64
        y = (i // 3) * 64
        sprite_img = render_matrix(frame)
        sheet.paste(sprite_img, (x, y), sprite_img)

    sheet.save(os.path.join(OUTPUT_DIR, "hero-3x3-sheet.png"))
    print("Created hero-3x3-sheet.png")

def create_goblin_sheet():
    def build_goblin(eye='R', pose='down', leg='idle'):
        head = [
            "0000000000000000",
            "0000011110000000",
            "00001LLLL1000000",
            "0001LLLLLL100000",
            "0001GDGGDG100000",
            f"0001D{eye}GD{eye}G100000",
            "00001GGGG1000000",
        ]
        
        torso_down = [
            "0011111111000000",
            "01GDDGGGDDG10010",
            "1GDDGGGGGDDG11B1",
            "1GGGGGGGGGGG1AB1",
            "0111111111110110",
        ]
        torso_left = [
            "0000111111000000",
            "0001GDDGGG100000",
            "001GDDGGGG100000",
            "01B1GGGGGGG10000",
            "0110111111100000",
        ]
        torso_right = [
            "0000001111110000",
            "000001GGGDDG1000",
            "000001GGGGDDG100",
            "00001GGGGGGG1B10",
            "0000011111110110",
        ]
        
        legs_idle = [
            "00001GG1GG100000",
            "00001DD1DD100000",
            "0000111011100000",
            "0000000000000000",
        ]
        legs_walk1 = [
            "00001GG100000000",
            "00001DD100000000",
            "0000111000000000",
            "0000000000000000",
        ]
        legs_walk2 = [
            "00000001GG100000",
            "00000001DD100000",
            "0000000011100000",
            "0000000000000000",
        ]
        legs_stunned = [
            "000001GG10000000",
            "000001DD10000000",
            "0000011110000000",
            "0000000000000000",
        ]
        
        if pose == 'down': torso = torso_down
        elif pose == 'left': torso = torso_left
        elif pose == 'right': torso = torso_right
        
        if leg == 'idle': legs = legs_idle
        elif leg == 'walk1': legs = legs_walk1
        elif leg == 'walk2': legs = legs_walk2
        elif leg == 'stunned': legs = legs_stunned
        
        return head + torso + legs

    frames = [
        # Row 0: Down
        build_goblin('R', 'down', 'idle'),
        build_goblin('R', 'down', 'walk1'),
        build_goblin('R', 'down', 'walk2'),
        # Row 1: Left, Left, Right
        build_goblin('R', 'left', 'walk1'),
        build_goblin('R', 'left', 'walk2'),
        build_goblin('R', 'right', 'walk1'),
        # Row 2: Right, Stunned, Alert
        build_goblin('R', 'right', 'walk2'),
        build_goblin('W', 'down', 'stunned'),  # Stunned (white eyes)
        build_goblin('Y', 'down', 'idle'),     # Alert (yellow eyes)
    ]

    sheet = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        x = (i % 3) * 64
        y = (i // 3) * 64
        sprite_img = render_matrix(frame)
        sheet.paste(sprite_img, (x, y), sprite_img)

    sheet.save(os.path.join(OUTPUT_DIR, "goblin-3x3-sheet.png"))
    print("Created goblin-3x3-sheet.png")

def create_orb_sheet():
    sheet = Image.new('RGBA', (144, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sheet)
    
    colors = [
        (255, 215, 0),   # Gold
        (74, 144, 217),  # Blue
        (155, 89, 182),  # Purple
    ]
    
    for i, base_color in enumerate(colors):
        offset_x = i * 48
        center_x = offset_x + 24
        center_y = 24
        
        # Outer glow
        for r in range(16, 8, -1):
            alpha = int(255 * (1 - (r-8)/8) * 0.4)
            glow_color = base_color + (alpha,)
            draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=glow_color)
            
        # Inner core
        draw.ellipse([center_x - 8, center_y - 8, center_x + 8, center_y + 8], fill=base_color + (255,))
        draw.ellipse([center_x - 6, center_y - 6, center_x + 6, center_y + 6], fill=(255, 255, 255, 200))
        
        # Tiny shadow
        shadow_color = (base_color[0]//3, base_color[1]//3, base_color[2]//3, 100)
        draw.ellipse([center_x - 6, center_y + 12, center_x + 6, center_y + 16], fill=shadow_color)
        
        # Leave center clean for text
        draw.ellipse([center_x - 4, center_y - 4, center_x + 4, center_y + 4], fill=base_color + (255,))

    sheet.save(os.path.join(OUTPUT_DIR, "orb-sheet.png"))
    print("Created orb-sheet.png")

def create_background():
    img = Image.new('RGB', (390, 700), (26, 26, 46))
    draw = ImageDraw.Draw(img)
    
    random.seed(42)
    
    # 32px grid
    for y in range(0, 700, 32):
        for x in range(0, 390, 32):
            is_wall = random.choice([True, False, False, False]) # 25% walls
            
            # Base color
            base = (58, 58, 74) if is_wall else (42, 42, 58)
            draw.rectangle([x, y, x + 31, y + 31], fill=base)
            
            if is_wall:
                # Bevel
                draw.rectangle([x, y, x + 31, y + 2], fill=(80, 80, 100))
                draw.rectangle([x, y, x + 2, y + 31], fill=(80, 80, 100))
                draw.rectangle([x, y + 29, x + 31, y + 31], fill=(40, 40, 50))
                draw.rectangle([x + 29, y, x + 31, y + 31], fill=(40, 40, 50))
                
            # Moss
            if random.random() < 0.15:
                mx = x + random.randint(2, 26)
                my = y + random.randint(2, 26)
                draw.rectangle([mx, my, mx + 4, my + 4], fill=(90, 130, 90))
                
            # Cracks
            if random.random() < 0.2:
                cx = x + random.randint(4, 24)
                cy = y + random.randint(4, 24)
                for _ in range(4):
                    draw.point((cx, cy), fill=(20, 20, 30))
                    cx += random.choice([-1, 0, 1])
                    cy += random.choice([-1, 0, 1])
                    
    # Torches
    for _ in range(8):
        tx = random.randint(32, 350)
        ty = random.randint(32, 650)
        for r in range(40, 0, -5):
            alpha = int(120 * (1 - r/40))
            draw.ellipse([tx - r, ty - r, tx + r, ty + r], fill=(220, 140, 60, alpha))
            
    # Composite the torch glows (which were drawn directly on RGB)
    # Actually PIL draw.ellipse with RGBA on RGB ignores alpha properly unless we use a mask or RGBA image.
    # Let's do a proper overlay for lighting.
    lighting = Image.new('RGBA', (390, 700), (0, 0, 0, 0))
    ldraw = ImageDraw.Draw(lighting)
    for _ in range(8):
        tx = random.randint(32, 350)
        ty = random.randint(32, 650)
        for r in range(40, 0, -5):
            alpha = int(60 * (1 - r/40))
            ldraw.ellipse([tx - r, ty - r, tx + r, ty + r], fill=(220, 140, 60, alpha))
    img.paste(lighting, (0,0), lighting)
    
    # Darken edges (Vignette)
    vignette = Image.new('RGBA', (390, 700), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for y in range(0, 700, 10):
        for x in range(0, 390, 10):
            dx = abs(x - 195) / 195.0
            dy = abs(y - 350) / 350.0
            dist = max(dx, dy)
            if dist > 0.4:
                alpha = int(255 * min(1.0, (dist - 0.4) * 2.5))
                vdraw.rectangle([x, y, x+10, y+10], fill=(10, 10, 20, alpha))
    
    img.paste(vignette, (0,0), vignette)
            
    img.save(os.path.join(OUTPUT_DIR, "background.png"))
    print("Created background.png")

if __name__ == '__main__':
    create_background()
    create_hero_sheet()
    create_goblin_sheet()
    create_orb_sheet()
    print("All assets generated successfully.")
