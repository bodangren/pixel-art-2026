import fs from 'fs';
import path from 'path';

// This script simulates the LLM prompt construction and response capture.
// It reads requirements.json and prepares the instruction for the model.

async function generate(gameSlug: string, modelId: string) {
  const reqPath = path.join(process.cwd(), 'data', 'requirements', `${gameSlug}.json`);
  if (!fs.existsSync(reqPath)) {
    throw new Error(`Requirements for ${gameSlug} not found. Run research-assets.ts first.`);
  }

  const requirements = JSON.parse(fs.readFileSync(reqPath, 'utf8'));

  const prompt = `
    You are a Pixel Art Generator Agent. 
    GAME THEME: ${requirements.theme}
    
    TASK: Write a Python script using the Pillow (PIL) library to generate the following assets:
    ${requirements.assets.map((a: any) => `- ${a.id}: ${a.description} (${a.dimensions})`).join('\n')}

    CONSTRAINTS:
    - Use a cohesive color palette for all assets.
    - All sprite sheets must align to their grid (e.g., 3x3 tiles of 64x64).
    - Sprite sheets must have a transparent background.
    - The Python script must save each asset as a PNG file in the current directory.
    - The script should be named 'generate_assets.py'.
    - Do NOT use pre-existing images. Generate every pixel via code.

    OUTPUT: Only the Python code.
  `;

  // Define the output run directory
  const runId = `${modelId.toLowerCase()}__${new Date().toISOString().split('T')[0]}__automated`;
  const runDir = path.join(process.cwd(), 'data', 'runs', runId);
  const assetDir = path.join(runDir, 'assets');
  
  if (!fs.existsSync(assetDir)) fs.mkdirSync(assetDir, { recursive: true });

  // Simulate receiving the code from an LLM
  // In a real implementation, this would call the AI SDK.
  const dummyPythonCode = `
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
  `;

  fs.writeFileSync(path.join(runDir, 'generate_assets.py'), dummyPythonCode);
  
  const runManifest = {
    run_id: runId,
    model_id: modelId,
    run_date: new Date().toISOString().split('T')[0],
    variant: "automated",
    benchmark_game_id: gameSlug,
    generation_method: "python-pillow",
    asset_file_paths: {},
    status: "incomplete",
    generation_notes: "Constructed prompt for model. Code generated and saved to run directory."
  };

  fs.writeFileSync(path.join(runDir, 'run.json'), JSON.stringify(runManifest, null, 2));
  console.log(`Generated run directory for ${gameSlug} using ${modelId} at ${runId}`);
  return { runId, runDir };
}

const game = process.argv[2] || 'labyrinth-goblin-king';
const model = process.argv[3] || 'gemini-3.1-pro';
generate(game, model).catch(console.error);
