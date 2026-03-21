#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

output_dir = "/home/daniel-bo/Desktop/pixel-art-benchmark/glm-5"

def create_background():
    img = Image.new('RGBA', (390, 700), (26, 26, 46, 255))
    draw = ImageDraw.Draw(img)
    
    for row in range(22):
        for col in range(11):
            x = col * 32
            y = row * 32
            
            if (row + col) % 7 == 0:
                base_color = (58, 58, 74, 255)
            else:
                base_color = (42, 42, 58, 255)
            
            draw.rectangle([x, y, x + 31, y + 31], fill=base_color)
            
            if (row + col) % 5 == 0:
                draw.line([x + 2, y + 2, x + 5, y + 3], fill=(34, 34, 50, 255))
            
            if (row + col * 3) % 11 == 0:
                draw.ellipse([x + 10, y + 10, x + 22, y + 22], fill=(45, 65, 45, 120))
    
    for i in range(8):
        tx = 50 + (i * 47) % 340
        ty = 80 + (i * 89) % 600
        for r in range(40, 10, -5):
            alpha = int(30 * (40 - r) / 30)
            glow_color = (255, 180, 100, alpha)
            draw.ellipse([tx - r, ty - r, tx + r, ty + r], fill=glow_color)
    
    for i in range(10):
        bx = (i * 43 + 20) % 380
        by = (i * 67 + 15) % 690
        draw.ellipse([bx, by, bx + 4, by + 4], fill=(60, 20, 20, 150))
    
    return img

def create_hero():
    img = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    silver = (180, 185, 195)
    silver_dark = (130, 135, 145)
    blue = (70, 100, 170)
    blue_dark = (50, 70, 130)
    skin = (200, 170, 150)
    gold = (220, 190, 100)
    
    def draw_knight(cx, cy, facing, walk_frame=0):
        armor = silver
        cape = blue
        cape_dark = blue_dark
        helmet = silver_dark
        
        bob = (walk_frame % 2) * 2 if walk_frame > 0 else 0
        cy += bob
        
        draw.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=cape_dark)
        draw.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=cape)
        
        draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=armor)
        
        if facing == 'down':
            draw.ellipse([cx - 12, cy - 8, cx + 12, cy + 10], fill=helmet)
            draw.ellipse([cx - 4, cy + 2, cx + 4, cy + 8], fill=skin)
            draw.rectangle([cx - 20, cy - 2, cx - 16, cy + 12], fill=armor)
            draw.rectangle([cx + 16, cy - 2, cx + 20, cy + 14], fill=silver_dark)
            draw.polygon([(cx + 18, cy + 14), (cx + 22, cy + 22), (cx + 14, cy + 22)], fill=gold)
        elif facing == 'up':
            draw.ellipse([cx - 12, cy - 8, cx + 12, cy + 10], fill=helmet)
            draw.rectangle([cx - 3, cy - 16, cx + 3, cy - 12], fill=gold)
            draw.rectangle([cx - 20, cy - 2, cx - 16, cy + 12], fill=armor)
            draw.rectangle([cx + 16, cy - 2, cx + 20, cy + 14], fill=silver_dark)
        elif facing == 'left':
            draw.ellipse([cx - 12, cy - 8, cx + 12, cy + 10], fill=helmet)
            draw.rectangle([cx - 24, cy - 2, cx - 20, cy + 14], fill=silver_dark)
            draw.polygon([(cx - 20, cy + 14), (cx - 24, cy + 22), (cx - 16, cy + 22)], fill=gold)
            draw.ellipse([cx + 10, cy - 4, cx + 20, cy + 8], fill=armor)
        elif facing == 'right':
            draw.ellipse([cx - 12, cy - 8, cx + 12, cy + 10], fill=helmet)
            draw.rectangle([cx + 16, cy - 2, cx + 20, cy + 14], fill=silver_dark)
            draw.polygon([(cx + 20, cy + 14), (cx + 24, cy + 22), (cx + 16, cy + 22)], fill=gold)
            draw.ellipse([cx - 20, cy - 4, cx - 10, cy + 8], fill=armor)
    
    positions = [
        (32, 32, 'down', 0),
        (96, 32, 'down', 1),
        (160, 32, 'down', 2),
        (32, 96, 'left', 1),
        (96, 96, 'left', 2),
        (160, 96, 'right', 1),
        (32, 160, 'right', 2),
        (96, 160, 'up', 1),
        (160, 160, 'up', 2),
    ]
    
    for i, (x, y, facing, frame) in enumerate(positions):
        draw_knight(x, y, facing, frame)
    
    return img

def create_goblin():
    img = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    green = (74, 140, 74)
    green_dark = (50, 100, 50)
    green_light = (90, 160, 90)
    brown = (100, 70, 50)
    brown_dark = (70, 50, 35)
    red_eye = (255, 80, 80)
    yellow_eye = (255, 220, 100)
    
    def draw_goblin(cx, cy, facing, pose='walk', frame=0):
        bob = (frame % 2) * 3 if pose == 'walk' else 0
        cy += bob
        
        draw.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=green_dark)
        
        body_color = green if pose != 'flee' else green
        draw.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=body_color)
        
        draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=green_light)
        
        if facing == 'down':
            draw.ellipse([cx - 12, cy - 10, cx + 12, cy + 8], fill=brown)
            draw.ellipse([cx - 6, cy - 2, cx - 2, cy + 4], fill=red_eye)
            draw.ellipse([cx + 2, cy - 2, cx + 6, cy + 4], fill=yellow_eye)
            draw.rectangle([cx - 22, cy + 4, cx - 18, cy + 16], fill=brown_dark)
        elif facing == 'up':
            draw.ellipse([cx - 12, cy - 10, cx + 12, cy + 8], fill=brown)
            draw.ellipse([cx - 4, cy - 14, cx + 4, cy - 10], fill=brown_dark)
        elif facing == 'left':
            draw.ellipse([cx - 12, cy - 10, cx + 12, cy + 8], fill=brown)
            draw.ellipse([cx - 8, cy - 2, cx - 2, cy + 4], fill=red_eye)
            draw.rectangle([cx - 24, cy + 6, cx - 18, cy + 18], fill=brown_dark)
        elif facing == 'right':
            draw.ellipse([cx - 12, cy - 10, cx + 12, cy + 8], fill=brown)
            draw.ellipse([cx + 2, cy - 2, cx + 8, cy + 4], fill=yellow_eye)
            draw.rectangle([cx + 18, cy + 6, cx + 24, cy + 18], fill=brown_dark)
        
        if pose == 'alert':
            for i in range(3):
                ex = cx + (i - 1) * 8
                draw.ellipse([ex - 2, cy - 20, ex + 2, cy - 16], fill=(255, 255, 200, 200))
        elif pose == 'flee':
            draw.arc([cx - 10, cy - 6, cx + 10, cy + 6], 0, 180, fill=(100, 100, 200))
    
    positions = [
        (32, 32, 'down', 'idle', 0),
        (96, 32, 'down', 'walk', 1),
        (160, 32, 'down', 'walk', 2),
        (32, 96, 'left', 'walk', 1),
        (96, 96, 'left', 'walk', 2),
        (160, 96, 'right', 'walk', 1),
        (32, 160, 'right', 'walk', 2),
        (96, 160, 'down', 'flee', 0),
        (160, 160, 'down', 'alert', 0),
    ]
    
    for x, y, facing, pose, frame in positions:
        draw_goblin(x, y, facing, pose, frame)
    
    return img

def create_orbs():
    img = Image.new('RGBA', (144, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    def draw_orb(cx, cy, color, glow_color):
        for r in range(20, 8, -2):
            alpha = int(80 * (20 - r) / 12)
            gc = glow_color + (alpha,)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=gc)
        
        draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=color)
        
        inner_light = tuple(min(255, c + 60) for c in color[:3])
        draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=inner_light)
        
        bright = tuple(min(255, c + 100) for c in color[:3])
        draw.ellipse([cx - 4, cy - 6, cx + 2, cy - 2], fill=bright)
        
        draw.ellipse([cx - 10, cy + 12, cx + 10, cy + 16], fill=(0, 0, 0, 60))
    
    draw_orb(24, 24, (255, 200, 50), (255, 215, 0))
    draw_orb(72, 24, (74, 144, 217), (74, 144, 217))
    draw_orb(120, 24, (155, 89, 182), (155, 89, 182))
    
    return img

if __name__ == '__main__':
    print("Creating background...")
    bg = create_background()
    bg.save(os.path.join(output_dir, "background.png"))
    
    print("Creating hero sprite sheet...")
    hero = create_hero()
    hero.save(os.path.join(output_dir, "hero-3x3-sheet.png"))
    
    print("Creating goblin sprite sheet...")
    goblin = create_goblin()
    goblin.save(os.path.join(output_dir, "goblin-3x3-sheet.png"))
    
    print("Creating orb sprite sheet...")
    orbs = create_orbs()
    orbs.save(os.path.join(output_dir, "orb-sheet.png"))
    
    print("All assets created successfully!")
