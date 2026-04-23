# Implementation Plan - Git History Cleanup

## Phase 1: Backup and Tool Setup

- [ ] Task: Create a bare-clone backup of the repository.
  - [ ] Run `git clone --mirror <repo-url> repo-backup.git`
  - [ ] Verify backup integrity by listing refs and objects.
  - [ ] Store backup in a safe location outside the repo.
- [ ] Task: Install and verify cleanup tool.
  - [ ] Check if BFG Repo-Cleaner (`bfg.jar`) is available.
  - [ ] If not, install `git-filter-repo` via pip.
  - [ ] Verify tool works with `--help` or dry-run mode.
- [ ] Task: Identify all oversized blobs.
  - [ ] Run `git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)'` to list large objects.
  - [ ] Confirm the list matches expected `node_modules/@next/swc-*.node` files.
- [ ] Task: Conductor — User Manual Verification 'Phase 1: Backup and Tool Setup' (Protocol in workflow.md)

## Phase 2: History Rewrite

- [ ] Task: Update `.gitignore` before rewriting.
  - [ ] Add `node_modules/` if not present.
  - [ ] Add `*.node` as extra safeguard.
  - [ ] Commit the `.gitignore` change.
- [ ] Task: Run the history rewrite.
  - [ ] BFG: `java -jar bfg.jar --delete-files '@next/swc-*.node' repo.git`
  - [ ] Or git-filter-repo: `git filter-repo --invert-paths --path-glob 'node_modules/@next/swc-*.node'`
  - [ ] Run `git reflog expire --expire=now --all && git gc --prune=now --aggressive`
- [ ] Task: Verify cleanup results.
  - [ ] Re-run large object scan to confirm removal.
  - [ ] Check no single file exceeds 100MB.
  - [ ] Verify `.gitignore` changes are intact.
- [ ] Task: Conductor — User Manual Verification 'Phase 2: History Rewrite' (Protocol in workflow.md)

## Phase 3: Push, Verification, and Cleanup

- [ ] Task: Force-push to GitHub.
  - [ ] Force-push main/master: `git push --force origin main`
  - [ ] Force-push other affected branches.
  - [ ] Verify push completes without size errors.
- [ ] Task: Verify remote repository.
  - [ ] Clone fresh from GitHub into a new directory.
  - [ ] Verify all branches are accessible.
  - [ ] Run build to confirm project integrity.
- [ ] Task: Document collaborator instructions.
  - [ ] Write instructions for re-cloning (not pulling).
  - [ ] Explain what was removed and why.
  - [ ] Share via README or team communication channel.
- [ ] Task: Conductor — User Manual Verification 'Phase 3: Push, Verification, and Cleanup' (Protocol in workflow.md)
