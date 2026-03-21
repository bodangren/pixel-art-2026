#!/usr/bin/env python3
"""
Pixel art asset generator for dungeon game benchmark.
Generates: background.png, hero-3x3-sheet.png, goblin-3x3-sheet.png, orb-sheet.png
"""

from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import random
import math
import os

OUTPUT_DIR = "/home/daniel-bo/Desktop/pixel-art-benchmark/sonnet-4.6/"
os.makedirs(OUTPUT_DIR, exist_ok=True)

random.seed(42)
np.random.seed(42)

# ─────────────────────────────────────────────
#  ASSET 1: background.png  (390×700)
# ─────────────────────────────────────────────
def generate_background():
    W, H = 390, 700
    CELL = 32
    img = Image.new("RGB", (W, H), (0x1a, 0x1a, 0x2e))
    pix = img.load()

    # ── stone tile colours ──
    FLOOR_A   = (0x2a, 0x2a, 0x3a)
    FLOOR_B   = (0x3a, 0x3a, 0x4a)
    WALL_DARK = (0x18, 0x18, 0x28)
    GROUT     = (0x15, 0x15, 0x25)
    HIGHLIGHT = (0x44, 0x44, 0x55)
    CRACK_C   = (0x20, 0x20, 0x30)
    MOSS_C    = (0x2a, 0x40, 0x2a)

    cols = W // CELL + 1
    rows = H // CELL + 1

    rng = np.random.default_rng(7)

    # base tile pass
    for row in range(rows):
        for col in range(cols):
            x0, y0 = col * CELL, row * CELL
            x1, y1 = min(x0 + CELL, W), min(y0 + CELL, H)

            # vary base colour per tile
            noise = int(rng.integers(-8, 8))
            base = FLOOR_A if (row + col) % 2 == 0 else FLOOR_B
            tile_c = tuple(max(0, min(255, c + noise)) for c in base)

            for py in range(y0, y1):
                for px in range(x0, x1):
                    # inner pixel noise
                    pn = int(rng.integers(-4, 4))
                    c = tuple(max(0, min(255, v + pn)) for v in tile_c)
                    pix[px, py] = c

            # grout lines (right and bottom edge of each tile)
            for px in range(x0, x1):
                if y1 - 1 < H:
                    pix[px, y1 - 1] = GROUT
            for py in range(y0, y1):
                if x1 - 1 < W:
                    pix[x1 - 1, py] = GROUT

            # top-left highlight bevel (raised stone look)
            for px in range(x0, min(x0 + 3, x1 - 1)):
                if y0 < H:
                    pix[px, y0] = HIGHLIGHT
            for py in range(y0, min(y0 + 3, y1 - 1)):
                if x0 < W:
                    pix[x0, py] = HIGHLIGHT

    # ── moss patches ──
    moss_positions = [(64, 128), (224, 320), (96, 512), (320, 96),
                      (160, 450), (288, 600), (32, 256), (352, 400)]
    for mx, my in moss_positions:
        for dy in range(-6, 7):
            for dx in range(-6, 7):
                dist = math.sqrt(dx*dx + dy*dy)
                if dist < 5.5 + rng.random():
                    px, py = mx + dx, my + dy
                    if 0 <= px < W and 0 <= py < H:
                        alpha = max(0.0, 1.0 - dist / 6.0)
                        old = pix[px, py]
                        mc = MOSS_C
                        blended = tuple(int(old[i] * (1-alpha*0.6) + mc[i] * alpha*0.6) for i in range(3))
                        pix[px, py] = blended

    # ── crack lines ──
    crack_starts = [(80, 64), (272, 200), (144, 400), (320, 550), (48, 600)]
    for cx, cy in crack_starts:
        angle = rng.uniform(0, math.pi * 2)
        length = rng.integers(20, 50)
        for step in range(length):
            angle += rng.uniform(-0.4, 0.4)
            nx_ = int(cx + math.cos(angle) * step * 0.7)
            ny_ = int(cy + math.sin(angle) * step * 0.7)
            if 0 <= nx_ < W and 0 <= ny_ < H:
                pix[nx_, ny_] = CRACK_C
                # occasionally widen the crack
                if rng.random() < 0.3:
                    for off in [(-1,0),(1,0),(0,-1),(0,1)]:
                        bx, by = nx_+off[0], ny_+off[1]
                        if 0 <= bx < W and 0 <= by < H:
                            old = pix[bx, by]
                            pix[bx, by] = tuple(max(0, c-6) for c in old)

    # ── torch glow pools ──
    torch_positions = [(128, 96), (256, 288), (96, 480), (320, 192), (192, 608)]
    for tx, ty in torch_positions:
        for dy in range(-28, 29):
            for dx in range(-28, 29):
                dist = math.sqrt(dx*dx + dy*dy)
                if dist < 28:
                    px, py = tx + dx, ty + dy
                    if 0 <= px < W and 0 <= py < H:
                        # warm orange glow that falls off with distance
                        falloff = (1.0 - dist / 28.0) ** 2
                        intensity = falloff * 0.55
                        old = pix[px, py]
                        torch_r = min(255, old[0] + int(90 * intensity))
                        torch_g = min(255, old[1] + int(45 * intensity))
                        torch_b = max(0,   old[2] - int(10 * intensity))
                        pix[px, py] = (torch_r, torch_g, torch_b)

    # ── edge vignette (fade to darkness) ──
    margin = 40
    for py in range(H):
        for px in range(W):
            dx = min(px, W - 1 - px)
            dy = min(py, H - 1 - py)
            dist_edge = min(dx, dy)
            if dist_edge < margin:
                factor = dist_edge / margin
                factor = factor ** 1.5
                old = pix[px, py]
                pix[px, py] = tuple(int(c * factor) for c in old)

    # slight gaussian blur to soften glow edges only — keep tile grid crisp
    img_blur = img.filter(ImageFilter.GaussianBlur(radius=0.6))
    # composite: keep original tile grid lines sharp, blend glow areas
    out = Image.blend(img, img_blur, 0.25)

    path = os.path.join(OUTPUT_DIR, "background.png")
    out.save(path)
    print(f"Saved {path}  size={out.size}")
    return out


# ─────────────────────────────────────────────
#  Helper: draw a top-down knight sprite
# ─────────────────────────────────────────────
def draw_knight(draw, ox, oy, direction, frame, cell=64):
    """
    Draw a top-down knight in a 64×64 cell at offset (ox, oy).
    direction: 'down','left','right','up'
    frame: 0 (idle/still), 1 (walk a), 2 (walk b)
    """
    cx, cy = ox + cell // 2, oy + cell // 2

    # ── palette ──
    SILVER_LIGHT  = (200, 210, 220, 255)
    SILVER_MID    = (160, 170, 180, 255)
    SILVER_DARK   = (100, 110, 120, 255)
    SILVER_SHADOW = (60,  70,  80,  255)
    TABARD_LIGHT  = (80,  130, 200, 255)
    TABARD_MID    = (50,  100, 170, 255)
    TABARD_DARK   = (30,   70, 130, 255)
    SKIN          = (220, 180, 140, 255)
    SKIN_SHADOW   = (180, 140, 100, 255)
    HELMET_VIS    = (140, 150, 160, 255)
    OUTLINE       = (20,   20,  30, 255)
    SWORD_BLADE   = (210, 220, 230, 255)
    SWORD_HILT    = (180, 140,  60, 255)
    SHIELD_FACE   = (60,  100, 180, 255)
    SHIELD_BOSS   = (200, 180,  40, 255)
    SHIELD_RIM    = (130, 140, 150, 255)
    BOOT          = (80,   60,  40, 255)

    # leg offset for walk animation
    leg_off_l = 0
    leg_off_r = 0
    arm_off   = 0
    if direction in ('down', 'up'):
        if frame == 1:
            leg_off_l = -3
            leg_off_r =  3
            arm_off   =  2
        elif frame == 2:
            leg_off_l =  3
            leg_off_r = -3
            arm_off   = -2
    else:  # left / right
        if frame == 1:
            leg_off_l = -3
            leg_off_r =  3
        elif frame == 2:
            leg_off_l =  3
            leg_off_r = -3

    # ── draw helpers ──
    def rect(x, y, w, h, c):
        draw.rectangle([ox+x, oy+y, ox+x+w-1, oy+y+h-1], fill=c)

    def outline_rect(x, y, w, h, fill, ol=OUTLINE):
        draw.rectangle([ox+x-1, oy+y-1, ox+x+w, oy+y+h], fill=ol)
        draw.rectangle([ox+x,   oy+y,   ox+x+w-1, oy+y+h-1], fill=fill)

    def circle(x, y, r, c, outline=None):
        draw.ellipse([ox+x-r, oy+y-r, ox+x+r, oy+y+r], fill=c, outline=outline)

    # ── centre coordinates local to cell ──
    bx = cell // 2   # 32
    by = cell // 2   # 32

    # ── BODY (tabard over armour) ──
    # torso 10×14 centred
    outline_rect(bx-5, by-7, 10, 14, TABARD_MID)
    # armour shoulder highlights
    rect(bx-5, by-7, 10, 3, SILVER_MID)
    # tabard front detail line
    rect(bx-1, by-4, 2, 8, TABARD_DARK)

    if direction == 'down':
        # boots (lower legs)
        outline_rect(bx-5+leg_off_l, by+7, 4, 6, BOOT)
        outline_rect(bx+1+leg_off_r, by+7, 4, 6, BOOT)
        # arm left (shield side) with animation
        outline_rect(bx-10, by-7+arm_off, 6, 10, SILVER_DARK)
        # arm right (sword side)
        outline_rect(bx+4,  by-7-arm_off, 6, 10, SILVER_DARK)
        # helmet/head (top circle)
        circle(bx, by-11, 8, SILVER_MID, OUTLINE)
        circle(bx, by-11, 5, HELMET_VIS)
        # visor slit
        rect(bx-3, by-12, 6, 2, SILVER_SHADOW)
        # shield (left arm)
        outline_rect(bx-14, by-8+arm_off, 7, 9, SHIELD_FACE)
        rect(bx-13, by-7+arm_off, 5, 5, SHIELD_FACE)
        circle(bx-11, by-4+arm_off, 2, SHIELD_BOSS)
        # sword (right arm — blade pointing down)
        rect(bx+9,  by-11-arm_off, 2, 16, SWORD_BLADE)
        rect(bx+7,  by-6-arm_off,  6,  2, SWORD_HILT)

    elif direction == 'up':
        # boots
        outline_rect(bx-5+leg_off_l, by+7, 4, 6, BOOT)
        outline_rect(bx+1+leg_off_r, by+7, 4, 6, BOOT)
        # arms at sides (back view — pauldrons visible)
        outline_rect(bx-10, by-7+arm_off, 6, 9, SILVER_LIGHT)
        outline_rect(bx+4,  by-7-arm_off, 6, 9, SILVER_LIGHT)
        # cloak / back plate
        rect(bx-5, by-5, 10, 10, SILVER_MID)
        # helmet back
        circle(bx, by-11, 8, SILVER_LIGHT, OUTLINE)
        # sword hilt sticking up over shoulder
        rect(bx+5,  by-17, 2, 7, SWORD_HILT)
        rect(bx+3,  by-14, 6, 2, SWORD_HILT)
        # shield rim on left
        outline_rect(bx-14, by-8+arm_off, 5, 8, SHIELD_RIM)

    elif direction == 'left':
        # body lean
        outline_rect(bx-5, by-7, 10, 14, TABARD_MID)
        rect(bx-5, by-7, 10, 3, SILVER_MID)
        # leg front and back
        outline_rect(bx-3+leg_off_l, by+7, 4, 6, BOOT)
        outline_rect(bx+1+leg_off_r, by+7, 4, 6, SILVER_DARK)
        # helmet side view
        circle(bx-2, by-11, 8, SILVER_MID, OUTLINE)
        rect(bx-8, by-13, 6, 4, SILVER_DARK)  # visor cheek
        # shield facing left (large oval)
        draw.ellipse([ox+bx-18, oy+by-11, ox+bx-6, oy+by+2], fill=SHIELD_FACE, outline=OUTLINE)
        draw.ellipse([ox+bx-16, oy+by-9,  ox+bx-8, oy+by  ], fill=SHIELD_FACE)
        circle(bx-12, by-5, 2, SHIELD_BOSS)
        # sword arm (behind)
        outline_rect(bx+3, by-7, 5, 9, SILVER_DARK)
        rect(bx+4, by-13, 2, 7, SWORD_BLADE)

    elif direction == 'right':
        outline_rect(bx-5, by-7, 10, 14, TABARD_MID)
        rect(bx-5, by-7, 10, 3, SILVER_MID)
        outline_rect(bx-3+leg_off_l, by+7, 4, 6, SILVER_DARK)
        outline_rect(bx+1+leg_off_r, by+7, 4, 6, BOOT)
        # helmet side view (other side)
        circle(bx+2, by-11, 8, SILVER_MID, OUTLINE)
        rect(bx+2, by-13, 6, 4, SILVER_DARK)
        # sword arm forward
        outline_rect(bx-8, by-7, 5, 9, SILVER_DARK)
        rect(bx-6, by-13, 2, 7, SWORD_BLADE)
        rect(bx-8, by-8, 6, 2, SWORD_HILT)
        # shield (behind body, rim visible on right)
        draw.ellipse([ox+bx+6, oy+by-11, ox+bx+18, oy+by+2], fill=SHIELD_FACE, outline=OUTLINE)
        circle(bx+12, by-5, 2, SHIELD_BOSS)

    # shadow under sprite (oval, semi-transparent dark)
    shadow_img = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_img)
    sdraw.ellipse([bx-10, by+12, bx+10, by+20], fill=(0, 0, 0, 80))
    return shadow_img


def generate_hero_sheet():
    SIZE = 192
    CELL = 64
    sheet = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

    poses = [
        # (col, row, direction, frame)
        (0, 0, 'down',  0),  # idle down
        (1, 0, 'down',  1),  # walk down f1
        (2, 0, 'down',  2),  # walk down f2
        (0, 1, 'left',  1),  # walk left f1
        (1, 1, 'left',  2),  # walk left f2
        (2, 1, 'right', 1),  # walk right f1
        (0, 2, 'right', 2),  # walk right f2
        (1, 2, 'up',    1),  # walk up f1
        (2, 2, 'up',    2),  # walk up f2
    ]

    for (gc, gr, direction, frame) in poses:
        cell_img = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
        draw = ImageDraw.Draw(cell_img)

        # shadow ellipse first
        draw.ellipse([CELL//2-10, CELL//2+12, CELL//2+10, CELL//2+20], fill=(0, 0, 0, 70))

        draw_knight(draw, 0, 0, direction, frame, CELL)

        sheet.paste(cell_img, (gc * CELL, gr * CELL), cell_img)

    path = os.path.join(OUTPUT_DIR, "hero-3x3-sheet.png")
    sheet.save(path)
    print(f"Saved {path}  size={sheet.size}")
    return sheet


# ─────────────────────────────────────────────
#  Helper: draw a top-down goblin sprite
# ─────────────────────────────────────────────
def draw_goblin(draw, ox, oy, direction, frame, cell=64, special=None):
    """
    special: None (normal), 'stunned', 'alert'
    """
    cx = cell // 2
    cy = cell // 2

    SKIN_L  = (90,  170,  90, 255)
    SKIN_M  = (74,  140,  74, 255)
    SKIN_D  = (50,  100,  50, 255)
    SKIN_S  = (30,   70,  30, 255)
    LEATHER = (110,  80,  40, 255)
    LEATHER_D=(80,   55,  25, 255)
    EYE_R   = (220,  60,  40, 255)
    EYE_Y   = (230, 200,  30, 255)
    EYE_WH  = (240, 240, 200, 255)
    TOOTH   = (220, 210, 160, 255)
    BLADE   = (160, 140, 100, 255)
    HANDLE  = (100,  70,  30, 255)
    OUTLINE = (15,   15,  15, 255)
    DARK_BG = (0,     0,   0,   0)
    STAR_Y  = (255, 220,   0, 255)

    leg_l = 0
    leg_r = 0
    if frame == 1:
        leg_l = -3
        leg_r =  3
    elif frame == 2:
        leg_l =  3
        leg_r = -3

    def rect(x, y, w, h, c):
        draw.rectangle([ox+x, oy+y, ox+x+w-1, oy+y+h-1], fill=c)

    def orect(x, y, w, h, fill, ol=OUTLINE):
        draw.rectangle([ox+x-1, oy+y-1, ox+x+w, oy+y+h], fill=ol)
        draw.rectangle([ox+x,   oy+y,   ox+x+w-1, oy+y+h-1], fill=fill)

    def circle(x, y, r, c, outline=None):
        draw.ellipse([ox+x-r, oy+y-r, ox+x+r, oy+y+r], fill=c, outline=outline)

    bx = cx
    by = cy

    # ── hunched body (slightly smaller / lower than knight) ──
    orect(bx-5, by-4, 10, 12, SKIN_M)
    # leather vest
    orect(bx-4, by-4, 8, 10, LEATHER)
    rect(bx-2, by-3, 4, 2, LEATHER_D)

    # leather cap
    orect(bx-5, by-13, 10, 6, LEATHER)
    rect(bx-3, by-14, 6, 2, LEATHER_D)

    # head
    circle(bx, by-8, 6, SKIN_M, OUTLINE)
    circle(bx, by-8, 4, SKIN_L)

    if direction == 'down' or special == 'alert':
        # eyes facing down — red + yellow dots
        rect(bx-3, by-10, 2, 2, EYE_WH)
        rect(bx+1, by-10, 2, 2, EYE_WH)
        rect(bx-3, by-10, 2, 2, EYE_R)
        rect(bx+1, by-10, 2, 2, EYE_Y)
        # toothy mouth
        rect(bx-2, by-6, 4, 2, OUTLINE)
        rect(bx-1, by-6, 1, 1, TOOTH)
        rect(bx+1, by-6, 1, 1, TOOTH)

        # arms
        orect(bx-9, by-4+leg_l, 5, 8, SKIN_D)
        orect(bx+4, by-4+leg_r, 5, 8, SKIN_D)

        # weapon: rusty dagger in right arm
        rect(bx+6, by-10-leg_r, 2, 10, BLADE)
        rect(bx+4, by-4-leg_r,  6,  2, HANDLE)

        # club/stick in left arm
        orect(bx-11, by-8+leg_l, 3, 12, HANDLE)
        rect(bx-13, by-9+leg_l, 6, 4, LEATHER_D)

        # legs
        orect(bx-4+leg_l, by+8, 3, 5, SKIN_D)
        orect(bx+1+leg_r, by+8, 3, 5, SKIN_D)

    elif direction == 'up':
        # back view
        circle(bx, by-8, 6, SKIN_D, OUTLINE)
        # leather cap back
        orect(bx-5, by-13, 10, 6, LEATHER_D)
        # arms
        orect(bx-9, by-4+leg_l, 5, 8, SKIN_S)
        orect(bx+4, by-4+leg_r, 5, 8, SKIN_S)
        # weapon tip sticking up
        rect(bx+6, by-14, 2, 7, BLADE)
        # legs
        orect(bx-4+leg_l, by+8, 3, 5, SKIN_S)
        orect(bx+1+leg_r, by+8, 3, 5, SKIN_S)

    elif direction == 'left':
        # side view
        circle(bx-2, by-8, 6, SKIN_M, OUTLINE)
        rect(bx-6, by-11, 5, 4, LEATHER)
        # single visible eye
        rect(bx-6, by-10, 2, 2, EYE_R)
        # snout lump
        circle(bx-7, by-7, 2, SKIN_L)
        # tooth
        rect(bx-8, by-6, 2, 1, TOOTH)
        # body
        orect(bx-5, by-4, 9, 11, LEATHER)
        # front arm (holds weapon)
        orect(bx-10, by-5+leg_l, 5, 8, SKIN_D)
        rect(bx-12, by-10+leg_l, 2, 12, BLADE)
        rect(bx-14, by-5+leg_l,  6,  2, HANDLE)
        # back arm
        orect(bx+3, by-4+leg_r, 4, 7, SKIN_S)
        # legs
        orect(bx-3+leg_l, by+7, 3, 5, SKIN_D)
        orect(bx+1+leg_r, by+7, 3, 5, SKIN_S)

    elif direction == 'right':
        circle(bx+2, by-8, 6, SKIN_M, OUTLINE)
        rect(bx+1,  by-11, 5, 4, LEATHER)
        rect(bx+4,  by-10, 2, 2, EYE_Y)
        circle(bx+7, by-7, 2, SKIN_L)
        rect(bx+6,  by-6,  2, 1, TOOTH)
        orect(bx-4, by-4, 9, 11, LEATHER)
        orect(bx+5, by-5+leg_r, 5, 8, SKIN_D)
        rect(bx+10, by-10+leg_r, 2, 12, BLADE)
        rect(bx+8,  by-5+leg_r,  6,  2, HANDLE)
        orect(bx-7, by-4+leg_l, 4, 7, SKIN_S)
        orect(bx-3+leg_l, by+7, 3, 5, SKIN_S)
        orect(bx+1+leg_r, by+7, 3, 5, SKIN_D)

    # ── special poses ──
    if special == 'stunned':
        # goblin flat on its back, stars circling
        # redraw as splayed figure
        orect(bx-8, by-3, 16, 6, LEATHER)   # body horizontal
        circle(bx+10, by, 5, SKIN_M, OUTLINE) # head to right
        rect(bx+8, by-1, 2, 2, EYE_R)
        # X eyes for stunned
        for ex, ey in [(bx+9, by-2), (bx+11, by-2)]:
            rect(ex, ey, 2, 2, OUTLINE)
            rect(ex, ey+1, 2, 2, OUTLINE)
        # limbs splayed
        orect(bx-8, by-7, 4, 5, SKIN_D)
        orect(bx+4, by-7, 4, 5, SKIN_D)
        orect(bx-8, by+2, 4, 5, SKIN_D)
        orect(bx+4, by+2, 4, 5, SKIN_D)
        # circling stars
        t = 0
        for i in range(3):
            ang = t + i * (2*math.pi/3)
            sx = int(bx + 14 * math.cos(ang))
            sy = int(by - 14 + 4 * math.sin(ang * 2))
            rect(sx, sy, 3, 3, STAR_Y)

    elif special == 'alert':
        # exclamation mark above head
        rect(bx, by-22, 3, 8, (255, 50, 50, 255))
        rect(bx, by-12, 3, 3, (255, 50, 50, 255))


def generate_goblin_sheet():
    SIZE = 192
    CELL = 64
    sheet = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

    poses = [
        # (col, row, direction, frame, special)
        (0, 0, 'down',  0, None),      # idle down
        (1, 0, 'down',  1, None),      # walk down f1
        (2, 0, 'down',  2, None),      # walk down f2
        (0, 1, 'left',  1, None),      # walk left f1
        (1, 1, 'left',  2, None),      # walk left f2
        (2, 1, 'right', 1, None),      # walk right f1
        (0, 2, 'right', 2, None),      # walk right f2
        (1, 2, 'down',  0, 'stunned'), # stunned/fleeing
        (2, 2, 'down',  0, 'alert'),   # alert
    ]

    for (gc, gr, direction, frame, special) in poses:
        cell_img = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
        draw = ImageDraw.Draw(cell_img)

        # shadow
        draw.ellipse([CELL//2-9, CELL//2+11, CELL//2+9, CELL//2+18], fill=(0, 0, 0, 70))

        draw_goblin(draw, 0, 0, direction, frame, CELL, special)

        sheet.paste(cell_img, (gc * CELL, gr * CELL), cell_img)

    path = os.path.join(OUTPUT_DIR, "goblin-3x3-sheet.png")
    sheet.save(path)
    print(f"Saved {path}  size={sheet.size}")
    return sheet


# ─────────────────────────────────────────────
#  ASSET 4: orb-sheet.png  (144×48)
# ─────────────────────────────────────────────
def generate_orb_sheet():
    W, H = 144, 48
    CELL = 48
    sheet = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    orb_configs = [
        # (R, G, B)  core colour
        (255, 215,   0),   # gold
        ( 74, 144, 217),   # blue
        (155,  89, 182),   # purple
    ]

    for idx, (cr, cg, cb) in enumerate(orb_configs):
        ox = idx * CELL
        cell_img = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
        pix = cell_img.load()

        CX, CY = CELL // 2, CELL // 2
        RADIUS = 18

        for py in range(CELL):
            for px in range(CELL):
                dx = px - CX
                dy = py - CY
                dist = math.sqrt(dx*dx + dy*dy)

                if dist < RADIUS:
                    # glow core gradient
                    t = dist / RADIUS   # 0 = centre, 1 = edge
                    # inner bright core
                    core_r = min(255, cr + int((255 - cr) * (1 - t)**2))
                    core_g = min(255, cg + int((255 - cg) * (1 - t)**2))
                    core_b = min(255, cb + int((255 - cb) * (1 - t)**2))
                    # alpha: opaque centre, translucent edge
                    alpha = int(255 * (1 - t * 0.5))
                    pix[px, py] = (core_r, core_g, core_b, alpha)

                elif dist < RADIUS + 8:
                    # outer translucent glow halo
                    t2 = (dist - RADIUS) / 8.0
                    halo_r = min(255, int(cr * (1 - t2) * 0.8))
                    halo_g = min(255, int(cg * (1 - t2) * 0.8))
                    halo_b = min(255, int(cb * (1 - t2) * 0.8))
                    halo_a = int(180 * (1 - t2)**2)
                    pix[px, py] = (halo_r, halo_g, halo_b, halo_a)

        # highlight glint (top-left of orb)
        draw = ImageDraw.Draw(cell_img)
        draw.ellipse([CX-10, CY-13, CX-2, CY-7], fill=(255, 255, 255, 180))

        # dark outline ring
        draw.ellipse([CX-RADIUS, CY-RADIUS, CX+RADIUS, CY+RADIUS],
                     outline=(20, 20, 30, 200), width=2)

        # shadow beneath (oval below orb)
        shadow_layer = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(shadow_layer)
        sdraw.ellipse([CX-10, CY+18, CX+10, CY+24], fill=(0, 0, 0, 80))
        cell_img = Image.alpha_composite(shadow_layer, cell_img)

        # central clean zone for text (slightly brighter, uniform centre)
        # already clean from gradient — add subtle uniform inner circle
        for py in range(CY - 8, CY + 9):
            for px in range(CX - 8, CX + 9):
                if 0 <= px < CELL and 0 <= py < CELL:
                    dx2 = px - CX
                    dy2 = py - CY
                    if dx2*dx2 + dy2*dy2 < 64:
                        old = cell_img.getpixel((px, py))
                        # brighten centre slightly
                        new_r = min(255, old[0] + 20)
                        new_g = min(255, old[1] + 20)
                        new_b = min(255, old[2] + 20)
                        cell_img.putpixel((px, py), (new_r, new_g, new_b, old[3]))

        sheet.paste(cell_img, (ox, 0), cell_img)

    path = os.path.join(OUTPUT_DIR, "orb-sheet.png")
    sheet.save(path)
    print(f"Saved {path}  size={sheet.size}")
    return sheet


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("Generating pixel art assets...")
    generate_background()
    generate_hero_sheet()
    generate_goblin_sheet()
    generate_orb_sheet()

    print("\nVerification:")
    for fname, expected in [
        ("background.png",       (390, 700)),
        ("hero-3x3-sheet.png",   (192, 192)),
        ("goblin-3x3-sheet.png", (192, 192)),
        ("orb-sheet.png",        (144, 48)),
    ]:
        path = os.path.join(OUTPUT_DIR, fname)
        img = Image.open(path)
        status = "OK" if img.size == expected else f"MISMATCH (got {img.size})"
        print(f"  {fname}: {img.size} mode={img.mode} — {status}")

    print("\nAll done!")
