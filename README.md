# Pixel Art Benchmark Report

This repository contains the outputs from running `pixel-art-benchmark.md` across multiple models and versions.

Each completed run produced the four required assets:

- `background.png`
- `hero-3x3-sheet.png`
- `goblin-3x3-sheet.png`
- `orb-sheet.png`

The sections below compare the generated results visually, grouped by model. The incomplete `minimax` run is called out separately.

## Prompt Used

All model runs used this prompt:

> You are going to create pixel art according to pixel-art-benchmark.md , but you will put all the files in the root of the gpt-5.3-codex-medium/ directory. This is a benchmark.

## Summary

| Model | Status | Assets | Notes |
|---|---:|---:|---|
| Gemini 2.5 Flash | Complete | 4/4 | All benchmark assets present |
| Gemini 2.5 Pro | Complete | 4/4 | All benchmark assets present |
| Gemini 3 Flash | Complete | 4/4 | All benchmark assets present |
| Gemini 3.1 Pro | Complete | 4/4 | All benchmark assets present |
| Haiku 4.6 | Complete | 4/4 | All benchmark assets present |
| GLM 5 | Complete | 4/4 | All benchmark assets present |
| GPT 5.3 Codex Medium | Complete | 4/4 | All benchmark assets present |
| GPT 5.4 Medium | Complete | 4/4 | All benchmark assets present |
| GPT 5.4 Mini Medium | Complete | 4/4 | All benchmark assets present |
| Opus 4.6 | Complete | 4/4 | All benchmark assets present |
| Sonnet 4.6 | Complete | 4/4 | All benchmark assets present |
| Minimax M2.5 | Incomplete | 0/4 | Directory contains only `generate_assets.py` |

## Visual Comparison

### Gemini 2.5 Flash

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="Gemini-2.5-flash/background.png" width="120" alt="Gemini 2.5 Flash background" /> | <img src="Gemini-2.5-flash/hero-3x3-sheet.png" width="120" alt="Gemini 2.5 Flash hero sheet" /> | <img src="Gemini-2.5-flash/goblin-3x3-sheet.png" width="120" alt="Gemini 2.5 Flash goblin sheet" /> | <img src="Gemini-2.5-flash/orb-sheet.png" width="120" alt="Gemini 2.5 Flash orb sheet" /> |

### Gemini 2.5 Pro

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="Gemini-2.5-pro/background.png" width="120" alt="Gemini 2.5 Pro background" /> | <img src="Gemini-2.5-pro/hero-3x3-sheet.png" width="120" alt="Gemini 2.5 Pro hero sheet" /> | <img src="Gemini-2.5-pro/goblin-3x3-sheet.png" width="120" alt="Gemini 2.5 Pro goblin sheet" /> | <img src="Gemini-2.5-pro/orb-sheet.png" width="120" alt="Gemini 2.5 Pro orb sheet" /> |

### Gemini 3 Flash

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="Gemini-3-flash/background.png" width="120" alt="Gemini 3 Flash background" /> | <img src="Gemini-3-flash/hero-3x3-sheet.png" width="120" alt="Gemini 3 Flash hero sheet" /> | <img src="Gemini-3-flash/goblin-3x3-sheet.png" width="120" alt="Gemini 3 Flash goblin sheet" /> | <img src="Gemini-3-flash/orb-sheet.png" width="120" alt="Gemini 3 Flash orb sheet" /> |

### Gemini 3.1 Pro

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="Gemini-3.1-pro/background.png" width="120" alt="Gemini 3.1 Pro background" /> | <img src="Gemini-3.1-pro/hero-3x3-sheet.png" width="120" alt="Gemini 3.1 Pro hero sheet" /> | <img src="Gemini-3.1-pro/goblin-3x3-sheet.png" width="120" alt="Gemini 3.1 Pro goblin sheet" /> | <img src="Gemini-3.1-pro/orb-sheet.png" width="120" alt="Gemini 3.1 Pro orb sheet" /> |

### Haiku 4.6

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="Haiku-4.6/background.png" width="120" alt="Haiku 4.6 background" /> | <img src="Haiku-4.6/hero-3x3-sheet.png" width="120" alt="Haiku 4.6 hero sheet" /> | <img src="Haiku-4.6/goblin-3x3-sheet.png" width="120" alt="Haiku 4.6 goblin sheet" /> | <img src="Haiku-4.6/orb-sheet.png" width="120" alt="Haiku 4.6 orb sheet" /> |

### GLM 5

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="glm-5/background.png" width="120" alt="GLM 5 background" /> | <img src="glm-5/hero-3x3-sheet.png" width="120" alt="GLM 5 hero sheet" /> | <img src="glm-5/goblin-3x3-sheet.png" width="120" alt="GLM 5 goblin sheet" /> | <img src="glm-5/orb-sheet.png" width="120" alt="GLM 5 orb sheet" /> |

### GPT 5.3 Codex Medium

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="gpt-5.3-codex-medium/background.png" width="120" alt="GPT 5.3 Codex Medium background" /> | <img src="gpt-5.3-codex-medium/hero-3x3-sheet.png" width="120" alt="GPT 5.3 Codex Medium hero sheet" /> | <img src="gpt-5.3-codex-medium/goblin-3x3-sheet.png" width="120" alt="GPT 5.3 Codex Medium goblin sheet" /> | <img src="gpt-5.3-codex-medium/orb-sheet.png" width="120" alt="GPT 5.3 Codex Medium orb sheet" /> |

### GPT 5.4 Medium

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="gpt-5.4-medium/background.png" width="120" alt="GPT 5.4 Medium background" /> | <img src="gpt-5.4-medium/hero-3x3-sheet.png" width="120" alt="GPT 5.4 Medium hero sheet" /> | <img src="gpt-5.4-medium/goblin-3x3-sheet.png" width="120" alt="GPT 5.4 Medium goblin sheet" /> | <img src="gpt-5.4-medium/orb-sheet.png" width="120" alt="GPT 5.4 Medium orb sheet" /> |

### GPT 5.4 Mini Medium

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="gpt-5.4-mini-medium/background.png" width="120" alt="GPT 5.4 Mini Medium background" /> | <img src="gpt-5.4-mini-medium/hero-3x3-sheet.png" width="120" alt="GPT 5.4 Mini Medium hero sheet" /> | <img src="gpt-5.4-mini-medium/goblin-3x3-sheet.png" width="120" alt="GPT 5.4 Mini Medium goblin sheet" /> | <img src="gpt-5.4-mini-medium/orb-sheet.png" width="120" alt="GPT 5.4 Mini Medium orb sheet" /> |

### Opus 4.6

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="opus-4.6/background.png" width="120" alt="Opus 4.6 background" /> | <img src="opus-4.6/hero-3x3-sheet.png" width="120" alt="Opus 4.6 hero sheet" /> | <img src="opus-4.6/goblin-3x3-sheet.png" width="120" alt="Opus 4.6 goblin sheet" /> | <img src="opus-4.6/orb-sheet.png" width="120" alt="Opus 4.6 orb sheet" /> |

### Sonnet 4.6

| Background | Hero | Goblin | Orb |
|---|---|---|---|
| <img src="sonnet-4.6/background.png" width="120" alt="Sonnet 4.6 background" /> | <img src="sonnet-4.6/hero-3x3-sheet.png" width="120" alt="Sonnet 4.6 hero sheet" /> | <img src="sonnet-4.6/goblin-3x3-sheet.png" width="120" alt="Sonnet 4.6 goblin sheet" /> | <img src="sonnet-4.6/orb-sheet.png" width="120" alt="Sonnet 4.6 orb sheet" /> |

## Incomplete Run

### Minimax M2.5

The `minimax-m2.5` directory did not complete the benchmark. It contains only the asset-generation script and no generated PNG files, so there is nothing to display for visual comparison.
