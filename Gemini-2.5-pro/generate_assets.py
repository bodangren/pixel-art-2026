
import random
from PIL import Image, ImageDraw

def create_dungeon_background():
    """Creates a 390x700 top-down dungeon labyrinth floor."""
    width, height = 390, 700
    tile_size = 32
    img = Image.new('RGB', (width, height), '#1a1a2e')
    draw = ImageDraw.Draw(img)

    colors = {
        "wall": "#3a3a4a",
        "path": "#2a2a3a",
        "crack": "#1a1a2e",
        "moss": "#3e4a3a",
        "blood": "#5a1a1a",
    }

    for y in range(0, height, tile_size):
        for x in range(0, width, tile_size):
            is_wall = random.random() < 0.4
            base_color = colors["wall"] if is_wall else colors["path"]
            draw.rectangle([x, y, x + tile_size, y + tile_size], fill=base_color)

            # Add texture
            if not is_wall:
                if random.random() < 0.15: # Cracks
                    draw.line([x + random.randint(2, 30), y + random.randint(2, 30), x + random.randint(2, 30), y + random.randint(2, 30)], fill=colors["crack"], width=1)
                if random.random() < 0.1: # Moss
                    mx, my = x + random.randint(5, 27), y + random.randint(5, 27)
                    draw.ellipse([mx, my, mx + 5, my + 5], fill=colors["moss"])
                if random.random() < 0.05: # Bloodstains
                    bx, by = x + random.randint(5, 27), y + random.randint(5, 27)
                    draw.ellipse([bx, by, bx + random.randint(3, 6), by + random.randint(3, 6)], fill=colors["blood"])

    # Add torchlight glows
    for _ in range(random.randint(4, 7)):
        glow_center_x = random.randint(0, width)
        glow_center_y = random.randint(0, height)
        glow_radius = random.randint(80, 150)
        for i in range(glow_radius, 0, -2):
            alpha = int(30 * (1 - i / glow_radius))
            draw.ellipse(
                [glow_center_x - i, glow_center_y - i, glow_center_x + i, glow_center_y + i],
                fill=(255, 165, 0, alpha)
            )
            
    img.save("Gemini-2.5-pro/background.png")

def create_hero_sheet():
    """Creates a 192x192 3x3 sprite sheet for the hero knight."""
    sheet_size = 192
    cell_size = 64
    img = Image.new('RGBA', (sheet_size, sheet_size), (0, 0, 0, 0))
    
    # Simplified pixel art representation of a knight from top-down
    # Palette
    armor = "#c0c0c0"
    armor_dark = "#a9a9a9"
    tabard = "#0000ff"
    sword = "#f0f0f0"
    shield = "#8b4513"

    def draw_knight(dc, direction):
        # Body
        dc.rectangle([24, 20, 40, 44], fill=tabard)
        # Head
        dc.ellipse([28, 16, 36, 24], fill=armor)
        # Shoulders
        dc.rectangle([22, 22, 42, 28], fill=armor_dark)
        
        # Sword and Shield based on direction
        if direction == 'down':
            dc.rectangle([40, 28, 44, 40], fill=sword) # Sword right
            dc.rectangle([20, 28, 24, 40], fill=shield) # Shield left
        elif direction == 'up':
            dc.rectangle([20, 24, 24, 36], fill=sword) # Sword left
            dc.rectangle([40, 24, 44, 36], fill=shield) # Shield right
        elif direction == 'left':
            dc.rectangle([24, 40, 36, 44], fill=sword) # Sword down
            dc.rectangle([24, 16, 36, 20], fill=shield) # Shield up
        elif direction == 'right':
             dc.rectangle([28, 16, 40, 20], fill=sword) # Sword up
             dc.rectangle([28, 40, 40, 44], fill=shield) # Shield down

    # Poses
    poses = [
        (0, 0, 'down'), (1, 0, 'down'), (2, 0, 'down'),
        (0, 1, 'left'), (1, 1, 'left'), (2, 1, 'right'),
        (0, 2, 'right'), (1, 2, 'up'), (2, 2, 'up')
    ]

    for col, row, direction in poses:
        cell_img = Image.new('RGBA', (cell_size, cell_size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(cell_img)
        draw_knight(draw, direction)
        # Add slight animation for walking frames
        offset_x, offset_y = 0, 0
        if (col, row) in [(1,0), (2,0)]: offset_y = col * 2 - 3 # Walk down anim
        if (col, row) in [(0,1), (1,1)]: offset_x = (col % 2) * 2 - 1 # Walk left anim
        if (col, row) in [(2,1), (0,2)]: offset_x = ((col+1) % 2) * 2 - 1 # Walk right anim
        if (col, row) in [(1,2), (2,2)]: offset_y = (col % 2) * -2 + 1 # Walk up anim
        
        final_cell = Image.new('RGBA', (cell_size, cell_size), (0,0,0,0))
        final_cell.paste(cell_img, (offset_x, offset_y))

        img.paste(final_cell, (col * cell_size, row * cell_size))

    img.save("Gemini-2.5-pro/hero-3x3-sheet.png")

def create_goblin_sheet():
    """Creates a 192x192 3x3 sprite sheet for the goblin guard."""
    sheet_size = 192
    cell_size = 64
    img = Image.new('RGBA', (sheet_size, sheet_size), (0, 0, 0, 0))

    # Palette
    skin = "#4a8c4a"
    cap = "#8b4513"
    eyes = "#ffcc00"
    club = "#a0522d"

    def draw_goblin(dc, pose):
        # Head (big and round)
        dc.ellipse([26, 18, 42, 34], fill=skin)
        # Body (hunched)
        dc.ellipse([22, 28, 46, 50], fill=skin)
        # Cap
        dc.ellipse([28, 16, 40, 24], fill=cap)
        # Eyes
        dc.point([32, 26], fill=eyes)
        dc.point([36, 26], fill=eyes)
        
        if pose == 'stunned':
            # Dizzy stars
            dc.text((28, 10), "*", fill="yellow")
            dc.text((38, 15), "*", fill="yellow")
        elif pose == 'alert':
            # Exclamation mark
            dc.rectangle([33, 8, 35, 18], fill="red")
            dc.point((34, 20), fill="red")
        else: # Walking poses
            dc.rectangle([44, 30, 50, 45], fill=club) # Club


    poses = [
        (0, 0, 'walk'), (1, 0, 'walk'), (2, 0, 'walk'),
        (0, 1, 'walk'), (1, 1, 'walk'), (2, 1, 'walk'),
        (0, 2, 'walk'), (1, 2, 'stunned'), (2, 2, 'alert')
    ]

    for col, row, pose in poses:
        cell_img = Image.new('RGBA', (cell_size, cell_size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(cell_img)
        draw_goblin(draw, pose)
        img.paste(cell_img, (col * cell_size, row * cell_size))

    img.save("Gemini-2.5-pro/goblin-3x3-sheet.png")

def create_orb_sheet():
    """Creates a 144x48 1x3 sheet for the magical orbs."""
    sheet_width = 144
    sheet_height = 48
    cell_size = 48
    img = Image.new('RGBA', (sheet_width, sheet_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    orb_colors = [
        ("#ffd700", "#ffec8b"), # Gold
        ("#4a90d9", "#8bb8f0"), # Blue
        ("#9b59b6", "#c39bd3")  # Purple
    ]

    for i, (core_color, glow_color) in enumerate(orb_colors):
        x_offset = i * cell_size
        
        # Outer glow
        draw.ellipse([x_offset + 4, 4, x_offset + 44, 44], fill=glow_color)
        # Inner core
        draw.ellipse([x_offset + 10, 10, x_offset + 38, 38], fill=core_color)
        # Shine
        draw.ellipse([x_offset + 14, 14, x_offset + 20, 20], fill="#ffffff")

    img.save("Gemini-2.5-pro/orb-sheet.png")

if __name__ == "__main__":
    create_dungeon_background()
    create_hero_sheet()
    create_goblin_sheet()
    create_orb_sheet()
    print("All assets generated successfully in Gemini-2.5-pro/ directory.")

