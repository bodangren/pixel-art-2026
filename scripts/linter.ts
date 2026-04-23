import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'runs');

async function lintRun(runId: string) {
  const runPath = path.join(DATA_DIR, runId, 'run.json');
  if (!fs.existsSync(runPath)) return;

  const run = JSON.parse(fs.readFileSync(runPath, 'utf8'));
  const assets = run.asset_file_paths;

  let alignmentScore = 5;
  const paletteScore = 5;
  let transparencyScore = 5;
  const notes: string[] = [];

  for (const [key, relativePath] of Object.entries(assets)) {
    const fullPath = path.join(process.cwd(), 'public', relativePath as string);
    if (!fs.existsSync(fullPath)) continue;

    try {
      const image = sharp(fullPath);
      const metadata = await image.metadata();
      const { width, height, hasAlpha } = metadata;

      // 1. Transparency Check
      if (key.includes('sheet') && !hasAlpha) {
        transparencyScore = Math.max(0, transparencyScore - 2);
        notes.push(`${key}: Missing alpha channel for sprite sheet.`);
      }

      // 2. Alignment Check (for 3x3 sheets)
      if (key.includes('3x3-sheet')) {
        if (width !== 192 || height !== 192) {
          alignmentScore = Math.max(0, alignmentScore - 2);
          notes.push(`${key}: Expected 192x192, got ${width}x${height}.`);
        }
      }

      // 3. Palette Check (Placeholder for real color analysis)
      // Real check would use getStats() or raw pixel data to count unique colors
      const stats = await image.stats();
      if (stats.channels.length > 3) {
        // Just a simple check if alpha channel is actually used
        const alphaStats = stats.channels[3];
        if (alphaStats.min === 255 && key.includes('sheet')) {
          transparencyScore = Math.max(0, transparencyScore - 1);
          notes.push(`${key}: Alpha channel present but fully opaque.`);
        }
      }

    } catch (err) {
      console.error(`Error linting ${key} in ${runId}:`, err);
    }
  }

  const totalTechnicalScore = (alignmentScore + paletteScore + transparencyScore) / 3;

  run.technical_grade = {
    alignment_score: alignmentScore,
    palette_consistency_score: paletteScore,
    transparency_score: transparencyScore,
    total_technical_score: totalTechnicalScore,
    linter_notes: notes.join(' '),
  };

  fs.writeFileSync(runPath, JSON.stringify(run, null, 2));
  console.log(`Linted ${runId}: Score ${totalTechnicalScore.toFixed(1)}`);
}

async function main() {
  const runDirs = fs.readdirSync(DATA_DIR);
  for (const runId of runDirs) {
    await lintRun(runId);
  }
}

main().catch(console.error);
