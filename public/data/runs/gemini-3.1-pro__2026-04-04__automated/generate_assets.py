
import PIL.Image as Image
import PIL.ImageDraw as ImageDraw

def create_placeholder(name, size, color, grid=(1,1)):
    img = Image.new("RGBA", size, (0,0,0,0))
    draw = ImageDraw.Draw(img)
    w, h = size
    gw, gh = grid
    tw, th = w // gw, h // gh
    for r in range(gh):
        for c in range(gw):
            draw.rectangle([c*tw, r*th, (c+1)*tw-1, (r+1)*th-1], fill=color, outline=(255,255,255,100))
    img.save(name)

create_placeholder("background.png", (1024, 1024), (26, 26, 46, 255))
create_placeholder("hero-3x3-sheet.png", (192, 192), (192, 192, 192, 255), (3,3))
create_placeholder("goblin-3x3-sheet.png", (192, 192), (74, 140, 74, 255), (3,3))
create_placeholder("orb-sheet.png", (192, 64), (255, 215, 0, 255), (3,1))
  