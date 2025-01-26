#!/bin/sh

set -e
set -u

sync_branch() {
  local branch=$1
  echo "Checking out $branch branch 🔄"
  git switch "$branch" || {
    echo "Error: Failed to switch to branch $branch"
    exit 1
  }

  echo "Merging main into $branch 🔄"
  git merge main || {
    echo "Error: Merge failed for branch $branch"
    exit 1
  }

  echo "Pushing $branch branch 🔄"
  git push || {
    echo "Error: Push failed for branch $branch"
    exit 1
  }

  echo "Branch $branch synced successfully ✅"
}

echo "Syncing the local files to the GitHub repository 🔄"

echo "Syncing main branch 🔄"
git switch main
git pull || {
  echo "Error: Failed to pull main branch"
  exit 1
}

for branch in backend frontend; do
  sync_branch "$branch"
done

echo "Returning to main branch 💛"
git switch main

echo "All branches are synced successfully ✅"
