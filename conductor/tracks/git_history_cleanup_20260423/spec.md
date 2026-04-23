# Specification - Git History Cleanup

## Summary

Remove 124MB `node_modules/@next/swc-*.node` binary files from git history that exceed GitHub's 100MB push limit. Rewrite history using BFG Repo-Cleaner or git filter-repo, update `.gitignore`, force-push, and verify all collaborators can re-clone cleanly.

## Goals

- Remove oversized binary blobs from all git history
- Restore ability to push to GitHub without size errors
- Prevent future accidental commits of large binaries
- Maintain clean repository state for all collaborators

## Functional Requirements

### Tool Selection
- **BFG Repo-Cleaner** (preferred): simpler syntax, faster for single-pattern removal, requires Java.
- **git filter-repo** (alternative): Python-based, more flexible, requires Python 3.
- Document both options; use whichever is available in the environment.

### Safety
- Create a full backup of the repository (bare clone) before any history rewrite.
- Verify backup is intact before proceeding.
- Document rollback procedure.

### History Rewrite
- Remove all files matching `node_modules/@next/swc-*.node` from every commit.
- Verify no other oversized blobs remain after cleanup.
- Check final repo size is well under 100MB for any single file.

### .gitignore Updates
- Add `node_modules/` to `.gitignore` if not already present.
- Add `*.node` to `.gitignore` as an extra safeguard.
- Verify `.gitignore` is committed before the force-push.

### Force-Push Procedure
- Force-push all branches that were rewritten.
- Document the exact commands used.
- Notify collaborators before force-pushing.

### Collaborator Communication
- Provide clear instructions for collaborators to re-clone (not pull).
- Document what happened and why.
- Provide timeline for when force-push will occur.

## Technical Stack

- BFG Repo-Cleaner or git filter-repo
- Git
- GitHub

## Acceptance Criteria

- [ ] Backup of repository created and verified before rewrite
- [ ] `node_modules/@next/swc-*.node` files removed from all history
- [ ] No single file in history exceeds 100MB
- [ ] `.gitignore` includes `node_modules/` and `*.node`
- [ ] Force-push succeeds without GitHub size errors
- [ ] Fresh clone from GitHub works for all branches
- [ ] Collaborator instructions documented

## Out of Scope

- Rewriting history for other large files not related to swc binaries
- Changing repository hosting platform
- Implementing git-lfs for binary assets
