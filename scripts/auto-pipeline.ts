import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function runFullPipeline(gameSlug: string, modelId: string) {
  console.log(`\n🚀 STARTING PIPELINE: ${gameSlug} | Model: ${modelId}`);

  const runNpx = (cmd: string) => {
    console.log(`\n--- Running: ${cmd} ---`);
    execSync(`npx --yes ts-node ${cmd}`, { stdio: 'inherit' });
  };

  try {
    // 1. Research
    runNpx(`scripts/research-assets.ts ${gameSlug}`);

    // 2. Generation (Prompt -> Python Code)
    runNpx(`scripts/generate-assets.ts ${gameSlug} ${modelId}`);

    // Find the runId from the output or filesystem
    const runDirs = fs.readdirSync(path.join(process.cwd(), 'data', 'runs'));
    const runId = runDirs.find(d => d.startsWith(`${modelId.toLowerCase()}__`) && d.endsWith('__automated'));
    
    if (!runId) throw new Error("Could not find generated run directory.");

    // 3. Execution (Python -> PNGs)
    runNpx(`scripts/sandbox-runner.ts ${runId}`);

    // 4. Linting (Technical Grade)
    runNpx(`scripts/linter.ts`);

    // 5. Derived Data (Rebuild Dashboard)
    runNpx(`scripts/build-derived.ts`);

    console.log(`\n✅ PIPELINE COMPLETE: ${runId}`);
  } catch (err: any) {
    console.error(`\n❌ PIPELINE FAILED:`, err.message);
  }
}

const game = process.argv[2] || 'labyrinth-goblin-king';
const model = process.argv[3] || 'gemini-3.1-pro';
runFullPipeline(game, model).catch(console.error);
