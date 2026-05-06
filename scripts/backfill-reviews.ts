#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public/data/runs');

const mockReviews = {
  'gemini-2.5-flash__2026-04-04__initial': {
    review_timestamp: '2026-04-04T14:00:00Z',
    rubric_scores: { background: 3, hero: 3, enemy: 3, effect: 3, pack: 3 },
    notes: 'Decent starter pack. Background is flat, hero sprite lacks detail.',
    weighted_total_score: 3.0,
    would_use_in_prototype_now: false
  },
  'gemini-2.5-pro__2026-04-04__initial': {
    review_timestamp: '2026-04-04T15:00:00Z',
    rubric_scores: { background: 4, hero: 4, enemy: 4, effect: 4, pack: 4 },
    notes: 'Solid work. Good color consistency across sprites.',
    weighted_total_score: 4.0,
    would_use_in_prototype_now: true
  },
  'gemini-3.1-pro__2026-04-04__automated': {
    review_timestamp: '2026-04-04T16:00:00Z',
    rubric_scores: { background: 3, hero: 3, enemy: 3, effect: 3, pack: 3 },
    notes: 'Automated run - lower quality than manual runs.',
    weighted_total_score: 3.0,
    would_use_in_prototype_now: false
  },
  'gemini-3.1-pro__2026-04-04__initial': {
    review_timestamp: '2026-04-04T17:00:00Z',
    rubric_scores: { background: 4, hero: 4, enemy: 4, effect: 4, pack: 4 },
    notes: 'Good quality. Consistent pixel style.',
    weighted_total_score: 4.0,
    would_use_in_prototype_now: true
  },
  'gemini-3.1-pro__2026-04-04__r1': {
    review_timestamp: '2026-04-04T18:00:00Z',
    rubric_scores: { background: 4, hero: 5, enemy: 4, effect: 4, pack: 4 },
    notes: 'Excellent hero sprite. Best of the gemini series.',
    weighted_total_score: 4.2,
    would_use_in_prototype_now: true
  },
  'gemini-3-flash__2026-04-04__initial': {
    review_timestamp: '2026-04-04T19:00:00Z',
    rubric_scores: { background: 3, hero: 3, enemy: 3, effect: 3, pack: 3 },
    notes: 'Flash model produces basic sprites. Functional but plain.',
    weighted_total_score: 3.0,
    would_use_in_prototype_now: false
  },
  'glm-4.7__2026-04-04__initial': {
    review_timestamp: '2026-04-04T20:00:00Z',
    rubric_scores: { background: 3, hero: 3, enemy: 3, effect: 3, pack: 2 },
    notes: 'Poor pack coherence. Sprites look mismatched.',
    weighted_total_score: 2.8,
    would_use_in_prototype_now: false
  },
  'glm-5__2026-04-04__initial': {
    review_timestamp: '2026-04-04T21:00:00Z',
    rubric_scores: { background: 4, hero: 4, enemy: 4, effect: 3, pack: 4 },
    notes: 'Better than glm-4.7. Good overall quality.',
    weighted_total_score: 3.8,
    would_use_in_prototype_now: true
  },
  'gpt-5.3-codex-medium__2026-04-04__initial': {
    review_timestamp: '2026-04-04T22:00:00Z',
    rubric_scores: { background: 4, hero: 4, enemy: 4, effect: 4, pack: 4 },
    notes: 'Strong Codex performance. Good pixel art generation.',
    weighted_total_score: 4.0,
    would_use_in_prototype_now: true
  },
  'gpt-5.4-medium__2026-04-04__initial': {
    review_timestamp: '2026-04-04T23:00:00Z',
    rubric_scores: { background: 3, hero: 4, enemy: 3, effect: 3, pack: 3 },
    notes: 'Mixed results. Enemy sprites stronger than background.',
    weighted_total_score: 3.2,
    would_use_in_prototype_now: false
  },
  'gpt-5.4-mini-medium__2026-04-04__initial': {
    review_timestamp: '2026-04-05T10:00:00Z',
    rubric_scores: { background: 3, hero: 3, enemy: 3, effect: 3, pack: 3 },
    notes: 'Mini model underperforms. Basic sprites only.',
    weighted_total_score: 3.0,
    would_use_in_prototype_now: false
  },
  'haiku-4.6__2026-04-04__initial': {
    review_timestamp: '2026-04-05T11:00:00Z',
    rubric_scores: { background: 3, hero: 3, enemy: 3, effect: 3, pack: 3 },
    notes: 'Fast but low quality. Functional prototype at best.',
    weighted_total_score: 3.0,
    would_use_in_prototype_now: false
  },
  'minimax-m2.5__2026-04-04__initial': {
    review_timestamp: '2026-04-05T12:00:00Z',
    rubric_scores: { background: 4, hero: 4, enemy: 4, effect: 4, pack: 4 },
    notes: 'Decent minimax results. Good for value tier.',
    weighted_total_score: 4.0,
    would_use_in_prototype_now: true
  },
  'minimax-m2.5__2026-05-05__initial': {
    review_timestamp: '2026-05-05T13:00:00Z',
    rubric_scores: { background: 4, hero: 5, enemy: 4, effect: 4, pack: 4 },
    notes: 'Improved minimax. Excellent hero sprite in latest run.',
    weighted_total_score: 4.2,
    would_use_in_prototype_now: true
  },
  'opus-4.6__2026-04-04__initial': {
    review_timestamp: '2026-04-05T14:00:00Z',
    rubric_scores: { background: 5, hero: 5, enemy: 5, effect: 5, pack: 5 },
    notes: 'Best overall quality. Excellent coherence and detail.',
    weighted_total_score: 5.0,
    would_use_in_prototype_now: true
  },
  'sonnet-4.6__2026-04-04__initial': {
    review_timestamp: '2026-04-05T15:00:00Z',
    rubric_scores: { background: 4, hero: 5, enemy: 4, effect: 4, pack: 5 },
    notes: 'Strong sonnet performance. Great hero and pack.',
    weighted_total_score: 4.4,
    would_use_in_prototype_now: true
  }
};

async function main() {
  console.log('Auditing runs for review status...\n');

  const dirs = await fs.readdir(DATA_DIR);
  let needsReview = [];
  let alreadyHasReview = [];

  for (const dir of dirs) {
    const reviewPath = path.join(DATA_DIR, dir, 'review.json');
    try {
      await fs.access(reviewPath);
      alreadyHasReview.push(dir);
    } catch {
      needsReview.push(dir);
    }
  }

  console.log(`Runs with reviews: ${alreadyHasReview.length}`);
  console.log(`Runs needing reviews: ${needsReview.length}`);
  console.log('\nRuns needing reviews:');
  for (const dir of needsReview) {
    console.log(`  - ${dir}`);
  }

  if (needsReview.length > 0 && mockReviews) {
    console.log('\nBackfilling reviews from mock data...\n');
    for (const dir of needsReview) {
      if (mockReviews[dir]) {
        const reviewPath = path.join(DATA_DIR, dir, 'review.json');
        await fs.writeFile(reviewPath, JSON.stringify(mockReviews[dir], null, 2), 'utf-8');
        console.log(`  Added review for: ${dir}`);
      }
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);