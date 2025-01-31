@echo off
setlocal enabledelayedexpansion

REM Sincronizza un branch specifico
:sync_branch
set "branch=%~1"
echo Checking out %branch% branch 🔄
git switch %branch%
if errorlevel 1 (
    echo Error: Failed to switch to branch %branch%
    exit /b 1
)

echo Merging main into %branch% 🔄
git merge main
if errorlevel 1 (
    echo Error: Merge failed for branch %branch%
    exit /b 1
)

echo Pushing %branch% branch 🔄
git push
if errorlevel 1 (
    echo Error: Push failed for branch %branch%
    exit /b 1
)

echo Branch %branch% synced successfully ✅
exit /b 0

REM Inizio dello script principale
echo Syncing the local files to the GitHub repository 🔄

REM Sincronizza il branch main
echo Syncing main branch 🔄
git switch main
if errorlevel 1 (
    echo Error: Failed to switch to branch main
    exit /b 1
)

git pull
if errorlevel 1 (
    echo Error: Failed to pull main branch
    exit /b 1
)

REM Elenco dei branch da sincronizzare
for %%B in (backend frontend) do (
    call :sync_branch %%B
    if errorlevel 1 (
        echo Error occurred while syncing branch %%B
        exit /b 1
    )
)

echo Returning to main branch 💛
git switch main
if errorlevel 1 (
    echo Error: Failed to switch back to main branch
    exit /b 1
)

echo All branches are synced successfully ✅