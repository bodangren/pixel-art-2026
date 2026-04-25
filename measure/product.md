# Initial Concept
Setting up a benchmark for AI-generated pixel art.

# Product Definition - Pixel Art Benchmark

## Vision
The Pixel Art Benchmark is a semi-automated system designed to evaluate the capability of Large Language Models (LLMs) in generating game-ready pixel-art asset packs. By providing a structured environment for asset generation, storage, and review, the project aims to establish a clear leaderboard of model performance in creative asset generation.

## Target Audience
- AI Researchers and Model Developers: To benchmark their models against a standardized pixel art specification.
- Game Developers: To discover which models are most capable of generating high-quality game assets.
- Hobbyists: To explore the current state of AI in creative game development.

## Core Features
- **Automated Pipeline:** Identify games missing assets, research their specific requirements, and trigger LLM generation via Python/Pillow scripts.
- **Run Management:** Store and organize benchmark runs by model ID, date, and variant (e.g., `model-id__YYYY-MM-DD__variant`).
- **Unified Review/Benchmark App:** A Next.js application that provides an editable review interface for local development and a read-only benchmark dashboard for public deployment.
- **Asset Inspection Tools:** High-fidelity preview for sprite sheets (animation, frame-stepping, FPS control, zoom, grid overlay) and background previews.
- **Scoring and Leaderboard:** Implement a structured human rubric to save subscores and generate a global leaderboard across all models and runs.
- **Static Export:** Fully static site generation for public hosting.

## Project Structure (Data Model)
- **Immutable Run Metadata (`run.json`):** Contains model info, date, variant, benchmark ID, prompt, and asset paths.
- **Mutable Review Data (`review.json`):** Contains subscores, notes, and prototype-readiness status.
- **Assets:** PNG files for background, hero, enemy, and effect sheets.

## Success Metrics
- Performance: Quick loading of asset previews and interactive components.
- Usability: Intuitive review interface for human evaluators.
- Accuracy: Reliable leaderboard generation from versioned JSON data.
