@echo off
echo ================================================
echo Fixing Vercel build error - pnpm lockfile sync
echo ================================================
echo.

cd /d C:\Projects\mailmind-website

echo [1/4] Running pnpm install...
call pnpm install

if %errorlevel% neq 0 (
    echo ERROR: pnpm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Staging pnpm-lock.yaml...
git add pnpm-lock.yaml

echo.
echo [3/4] Committing changes...
git commit -m "Fix: update pnpm lockfile for react-icons"

if %errorlevel% neq 0 (
    echo ERROR: Git commit failed
    pause
    exit /b 1
)

echo.
echo [4/4] Pushing to repository...
git push

if %errorlevel% neq 0 (
    echo ERROR: Git push failed
    pause
    exit /b 1
)

echo.
echo ================================================
echo SUCCESS! Vercel will auto-trigger new build
echo ================================================
echo.
pause
