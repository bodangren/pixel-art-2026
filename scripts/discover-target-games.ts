import fs from 'fs';
import path from 'path';

const GAMES_DIR = '/home/daniel-bo/Desktop/advantage-games/src/components/games';
const PUBLIC_GAMES_DIR = '/home/daniel-bo/Desktop/advantage-games/public/games';

async function discover() {
  const categories = ['sentence', 'vocabulary'];
  const targets = [];

  for (const category of categories) {
    const categoryPath = path.join(GAMES_DIR, category);
    if (!fs.existsSync(categoryPath)) continue;

    const games = fs.readdirSync(categoryPath);
    for (const gameSlug of games) {
      const gamePath = path.join(categoryPath, gameSlug);
      if (!fs.statSync(gamePath).isDirectory()) continue;

      // Check for assets in public folder
      const assetPath = path.join(PUBLIC_GAMES_DIR, gameSlug);
      const hasAssets = fs.existsSync(assetPath) && fs.readdirSync(assetPath).some(f => f.endsWith('.png') && !f.includes('cover'));

      // Check code for primitive shapes (Rect, Circle from Konva)
      // This is a heuristic: if it uses Konva shapes but NO image loading logic, it's likely a target
      let needsArt = !hasAssets;
      
      const gameFiles = fs.readdirSync(gamePath);
      for (const file of gameFiles) {
        if (!file.endsWith('.tsx')) continue;
        const content = fs.readFileSync(path.join(gamePath, file), 'utf8');
        if (content.includes('Rect') || content.includes('Circle')) {
          if (!content.includes('drawImage') && !content.includes('useImage') && !content.includes('loadImage')) {
            needsArt = true;
          }
        }
      }

      if (needsArt) {
        targets.push({
          slug: gameSlug,
          category,
          path: gamePath,
          hasExistingFolder: hasAssets
        });
      }
    }
  }

  console.log(JSON.stringify(targets, null, 2));
}

discover().catch(console.error);
