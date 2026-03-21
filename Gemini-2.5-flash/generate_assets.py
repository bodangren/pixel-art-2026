from PIL import Image, ImageDraw

def create_blank_png(filepath, width, height, color=(0, 0, 0, 0)):
    """
    Creates a blank PNG image with the specified dimensions and an optional background color.
    (0, 0, 0, 0) is fully transparent.
    """
    try:
        image = Image.new("RGBA", (width, height), color)
        image.save(filepath, "PNG")
        print(f"Created blank PNG: {filepath} ({width}x{height})")
    except Exception as e:
        print(f"Error creating PNG {filepath}: {e}")

def generate_pixel_art_assets():
    # Asset 1: Background
    # File: background.png
    # Size: 390 x 700 pixels
    # Description: A top-down dungeon labyrinth floor. Dark stone tile grid (32px cells) with subtle variation
    #              — cracked flagstones, moss creeping between joints, the occasional dried bloodstain or scratch mark.
    #              The palette is deep charcoal (#1a1a2e) and slate gray (#2a2a3a / #3a3a4a) with desaturated green moss accents.
    #              Faint ambient glow from unseen torches casts warm orange pools in a few corners.
    #              The edges of the image fade into impenetrable darkness suggesting the labyrinth extends forever.
    # Key Elements:
    # - Stone tile floor with 32px grid alignment (11 cols x ~22 rows)
    # - Two tile variants: wall tiles (#3a3a4a, slightly raised look with beveled edges) and path tiles (#2a2a3a, worn flat stone)
    # - Atmospheric details: torch glow pools (warm orange, subtle), moss patches, cracks
    # - Overall dark and foreboding — this is the Goblin King's domain
    # - No specific maze layout baked in (maze is generated at runtime) — just provide a generic dungeon floor texture that works whether a cell is wall or path
    create_blank_png("background.png", 390, 700)

    # Asset 2: Player Hero (Knight)
    # File: hero-3x3-sheet.png
    # Sheet: 3 columns x 3 rows, each cell 64x64 pixels (total: 192 x 192 pixels)
    # Display size: 28px (scaled down from 64px cell for crisp rendering)
    # Description: Top-down view of a brave knight navigating the labyrinth. Silver armor with a blue tabard/cape visible from above.
    #              Round shield on the left arm, short sword in the right hand. Helmet with a small crest.
    #              The character reads as heroic and distinct from the dark dungeon floor.
    #              When in "Heroic Aura" mode (handled in code with a golden tint), the base sprite should look good with a gold color overlay.
    # Pose Grid:
    # | | Col 0 | Col 1 | Col 2 |
    # |---|---|---|---|
    # | Row 0 | Idle (facing down) | Walk down frame 1 | Walk down frame 2 |
    # | Row 1 | Walk left frame 1 | Walk left frame 2 | Walk right frame 1 |
    # | Row 2 | Walk right frame 2 | Walk up frame 1 | Walk up frame 2 |
    # Notes:
    # - Must be clearly distinguishable from goblins at 28px display size
    # - Silver/blue palette contrasts with the green goblins and dark dungeon
    # - Keep silhouette round and compact for maze navigation feel
    create_blank_png("hero-3x3-sheet.png", 192, 192)

    # Asset 3: Goblin Guard
    # File: goblin-3x3-sheet.png
    # Sheet: 3 columns x 3 rows, each cell 64x64 pixels (total: 192 x 192 pixels)
    # Display size: 28px
    # Description: Top-down view of a goblin dungeon guard. Green skin, hunched posture visible even from above.
    #              Wears a crude leather cap and carries a rusty dagger or club. Beady red/yellow eyes that glow slightly.
    #              The goblin patrols the maze corridors and chases the player when in range.
    #              When "fleeing" (during Heroic Aura), the code tints the sprite blue — the base green design should look recognizable with a blue color shift.
    # Pose Grid:
    # | | Col 0 | Col 1 | Col 2 |
    # |---|---|---|---|
    # | Row 0 | Idle (facing down) | Walk down frame 1 | Walk down frame 2 |
    # | Row 1 | Walk left frame 1 | Walk left frame 2 | Walk right frame 1 |
    # | Row 2 | Walk right frame 2 | Stunned/fleeing | Alert (spotted player) |
    # Notes:
    # - Green skin (#4a8c4a base) must be the dominant color for instant recognition
    # - Three goblin types exist in code (scout, warrior, elite) but share this sprite — differentiation is by speed only
    # - Should look menacing but slightly comical (classic fantasy goblin)
    create_blank_png("goblin-3x3-sheet.png", 192, 192)

    # Asset 4: Word Orb
    # File: orb-sheet.png
    # Sheet: 1 row x 3 columns, each cell 48x48 pixels (total: 144 x 48 pixels)
    # Display size: 24px
    # Description: A magical floating orb that contains a word the player must collect.
    #              The orb hovers slightly above the dungeon floor with a faint glow.
    #              Two color variants are needed: gold (the target word the player should collect next) and blue (other words in the sentence, collectible but not the current target).
    #              The third frame is a special "power-up" orb that grants Heroic Aura.
    # Frame Grid:
    # | Col 0 | Col 1 | Col 2 |
    # |---|---|---|
    # | Gold orb (#ffd700 glow) — target word | Blue orb (#4a90d9 glow) — non-target word | Purple orb (#9b59b6 glow) — Heroic Aura power-up |
    # Notes:
    # - Each orb should have a bright inner core, a translucent outer glow, and a tiny shadow/reflection beneath suggesting it floats
    # - Must be legible at 24px — keep the design simple with strong color contrast
    # - Text is overlaid on top of the orb in code (white, 10-14px) — leave the center area relatively clean/uniform so text remains readable
    create_blank_png("orb-sheet.png", 144, 48)

if __name__ == "__main__":
    generate_pixel_art_assets()
