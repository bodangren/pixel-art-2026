import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data', 'runs');

const LEGACY_MODELS = [
  'Gemini-2.5-flash',
  'Gemini-2.5-pro',
  'Gemini-3-flash',
  'Gemini-3.1-pro',
  'Haiku-4.6',
  'glm-4.7',
  'glm-5',
  'gpt-5.3-codex-medium',
  'gpt-5.4-medium',
  'gpt-5.4-mini-medium',
  'opus-4.6',
  'sonnet-4.6',
  'minimax-m2.5'
];

async function migrate() {
  for (const model of LEGACY_MODELS) {
    const sourceDir = path.join(ROOT_DIR, model);
    if (!fs.existsSync(sourceDir)) {
      console.log(`Skipping ${model}, source directory not found.`);
      continue;
    }

    const runId = `${model.toLowerCase()}__2026-04-04__initial`;
    const targetDir = path.join(DATA_DIR, runId);
    const assetDir = path.join(targetDir, 'assets');

    if (!fs.existsSync(assetDir)) {
      fs.mkdirSync(assetDir, { recursive: true });
    }

    const assets = [
      'background.png',
      'hero-3x3-sheet.png',
      'goblin-3x3-sheet.png',
      'orb-sheet.png'
    ];

    const assetFilePaths: Record<string, string> = {};

    for (const asset of assets) {
      const sourceFile = path.join(sourceDir, asset);
      if (fs.existsSync(sourceFile)) {
        const targetFile = path.join(assetDir, asset);
        fs.copyFileSync(sourceFile, targetFile);
        assetFilePaths[asset.replace('.png', '')] = `/data/runs/${runId}/assets/${asset}`;
      }
    }

    const runData = {
      run_id: runId,
      model_id: model,
      run_date: '2026-04-04',
      variant: 'initial',
      benchmark_game_id: 'labyrinth-of-the-goblin-king',
      asset_file_paths: assetFilePaths,
      status: Object.keys(assetFilePaths).length > 0 ? 'complete' : 'incomplete',
      generation_notes: 'Migrated from initial benchmark run.'
    };

    fs.writeFileSync(path.join(targetDir, 'run.json'), JSON.stringify(runData, null, 2));
    console.log(`Migrated ${model} to ${runId}`);
  }
}

migrate().catch(console.error);
