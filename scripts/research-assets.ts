import fs from 'fs';
import path from 'path';

// This script simulates an LLM researcher.
// In a full implementation, it would send the source code to an LLM.
// For this track, we'll implement the logic to gather the code and prepare the prompt.

async function research(gameSlug: string) {
  const gamesBaseDir = '/home/daniel-bo/Desktop/advantage-games/src/components/games';
  const categories = ['sentence', 'vocabulary'];
  
  let gamePath = '';
  for (const cat of categories) {
    const p = path.join(gamesBaseDir, cat, gameSlug);
    if (fs.existsSync(p)) {
      gamePath = p;
      break;
    }
  }

  if (!gamePath) {
    throw new Error(`Game ${gameSlug} not found.`);
  }

  // Read primary game file and config
  const files = fs.readdirSync(gamePath);
  let context = '';
  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('Config.ts')) {
      context += `\n--- FILE: ${file} ---\n`;
      context += fs.readFileSync(path.join(gamePath, file), 'utf8');
    }
  }

  // Define the Research Prompt
  const prompt = `
    You are an Asset Requirements Researcher. Analyze the following React/Konva game source code.
    Identify:
    1. The core theme/setting of the game.
    2. The main player character and their visual requirements.
    3. Enemy types and their visual requirements.
    4. Environmental assets (backgrounds, tiles).
    5. Technical specifications found in code (tile sizes, sprite sheet grid sizes).

    CODE CONTEXT:
    ${context}

    Output a JSON object with:
    {
      "game_id": "${gameSlug}",
      "theme": string,
      "assets": [
        { "id": string, "description": string, "type": "sheet" | "background", "dimensions": string, "grid": string }
      ]
    }
  `;

  // For this track, we'll generate a hardcoded requirements file for labyrinth-goblin-king
  // to demonstrate the pipeline flow.
  const requirements = {
    game_id: gameSlug,
    theme: "A dark dungeon maze crawling with goblins. The player is a hero/knight who becomes a Paladin with a golden aura.",
    assets: [
      {
        id: "background",
        description: "A dark, atmospheric stone dungeon floor texture suitable for a maze background.",
        type: "background",
        dimensions: "1024x1024"
      },
      {
        id: "hero-3x3-sheet",
        description: "A heroic knight character. 3x3 sprite sheet showing idle, walk, and attack poses. 64x64 tiles.",
        type: "sheet",
        dimensions: "192x192",
        grid: "3x3"
      },
      {
        id: "goblin-3x3-sheet",
        description: "A small, green, menacing goblin. 3x3 sprite sheet. 64x64 tiles.",
        type: "sheet",
        dimensions: "192x192",
        grid: "3x3"
      },
      {
        id: "orb-sheet",
        description: "Magical word orbs. 1x3 sheet showing standard and glowing states. 64x64 tiles.",
        type: "sheet",
        dimensions: "192x64",
        grid: "1x3"
      }
    ]
  };

  const outputDir = path.join(process.cwd(), 'data', 'requirements');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  fs.writeFileSync(path.join(outputDir, `${gameSlug}.json`), JSON.stringify(requirements, null, 2));
  console.log(`Researched ${gameSlug}. Requirements saved to data/requirements/${gameSlug}.json`);
}

const target = process.argv[2] || 'labyrinth-goblin-king';
research(target).catch(console.error);
