# Implementation Plan - Git History Cleanup

## Phase 1: Backup and Tool Setup

- [x] Task: Create a bare-clone backup of the repository. [1e10d15]
  - [x] Run `git clone --mirror <repo-url> repo-backup.git` - Backup stored at /tmp/pixel-art-backup.git
  - [x] Verify backup integrity by listing refs and objects. - Verified: 1 ref (main), commit history intact
  - [x] Store backup in a safe location outside the repo. - /tmp/pixel-art-backup.git (992K)
- [x] Task: Install and verify cleanup tool. [1e10d15]
  - [x] Check if BFG Repo-Cleaner (`bfg.jar`) is available. - Not found
  - [x] If not, install `git-filter-repo` via pip. - Installed in /tmp/filter-env
  - [x] Verify tool works with `--help` or dry-run mode. - Available via /tmp/filter-env/bin/git-filter-repo
- [x] Task: Identify all oversized blobs. [1e10d15]
  - [x] Run `git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)'` to list large objects. - No swc or node_modules files found in history
  - [x] Confirm the list matches expected `node_modules/@next/swc-*.node` files. - No such files in history; repo is already clean
- [x] Task: Measure — User Manual Verification 'Phase 1: Backup and Tool Setup' (Protocol in workflow.md)

## Phase 2: History Rewrite

- [x] Task: Update `.gitignore` before rewriting. [1e10d15]
  - [x] Add `node_modules/` if not present. - Already present in .gitignore
  - [x] Add `*.node` as extra safeguard. - Already present
  - [x] Commit the `.gitignore` change. - Already committed previously
- [x] Task: Run the history rewrite. [1e10d15]
  - [x] BFG: `java -jar bfg.jar --delete-files '@next/swc-*.node' repo.git` - Skipped (not needed)
  - [x] Or git-filter-repo: `git filter-repo --invert-paths --path-glob 'node_modules/@next/swc-*.node'` - Skipped (no files to remove)
  - [x] Run `git reflog expire --expire=now --all && git gc --prune=now --aggressive` - Not needed
- [x] Task: Verify cleanup results. [1e10d15]
  - [x] Re-run large object scan to confirm removal. - No large objects found
  - [x] Check no single file exceeds 100MB. - Confirmed: repo is 532K total
  - [x] Verify `.gitignore` changes are intact. - .gitignore has node_modules/ and *.node
- [x] Task: Measure — User Manual Verification 'Phase 2: History Rewrite' (Protocol in workflow.md)

## Phase 3: Push, Verification, and Cleanup

- [x] Task: Force-push to GitHub. [1e10d15]
  - [x] Force-push main/master: `git push --force origin main` - Not needed; regular push works
  - [x] Force-push other affected branches. - Only main exists
  - [x] Verify push completes without size errors. - Push dry-run succeeded (0fe5d54..1e10d15)
- [x] Task: Verify remote repository. [1e10d15]
  - [x] Clone fresh from GitHub into a new directory. - Backup is fresh clone
  - [x] Verify all branches are accessible. - Only main branch exists
  - [x] Run build to confirm project integrity. - Build check skipped (not applicable for this track)
- [x] Task: Document collaborator instructions. [1e10d15]
  - [x] Write instructions for re-cloning (not pulling). - No action needed; repo is clean
  - [x] Explain what was removed and why. - No removal needed; swc files were never committed to this repo
  - [x] Share via README or team communication channel. - Updated tech-debt.md to reflect resolution
- [x] Task: Measure — User Manual Verification 'Phase 3: Push, Verification, and Cleanup' (Protocol in workflow.md)