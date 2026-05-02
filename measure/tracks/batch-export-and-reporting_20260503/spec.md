# Spec: Batch Export and Reporting

## Problem

The leaderboard system and quality metrics dashboard display data in the UI, but there is no way to export benchmark results for external analysis. Researchers need CSV/JSON exports of leaderboard rankings, model comparison data, and quality score distributions to perform their own analysis in spreadsheets or Jupyter notebooks. The product vision explicitly lists "export reports" as a feature of the quality metrics dashboard.

## Goal

Add export functionality that allows users to download benchmark results, leaderboard rankings, and quality metrics as CSV and JSON files.

## Requirements

1. **Leaderboard Export**: Download the full leaderboard as CSV (model, rank, overall score, subscores, run count).
2. **Quality Metrics Export**: Download score distributions and trend data as JSON for external charting.
3. **Batch Comparison Export**: Download side-by-side comparison data for selected models as CSV.
4. **UI Integration**: Export buttons on leaderboard, quality dashboard, and comparison views.

## Non-Goals

- Automated scheduled exports
- PDF report generation
- API endpoint for programmatic access (static export only)

## Success Criteria

- Leaderboard CSV opens correctly in Excel/Google Sheets
- JSON exports are valid and match UI data
- Export buttons are accessible (keyboard navigable, proper ARIA labels)
- All existing tests pass
