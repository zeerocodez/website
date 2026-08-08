@echo off
setlocal enabledelayedexpansion
echo ==========================================================
echo   PUSHING ZEEROCODES TO GITHUB: https://github.com/zeerocodez/website
echo ==========================================================

:: Detect git executable in PATH, local project git_bin, or standard directories
set "GIT_CMD=git"
where git >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%~dp0git_bin\cmd\git.exe" (
        set "GIT_CMD=%~dp0git_bin\cmd\git.exe"
    ) else if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
        set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    ) else if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files (x86)\Git\cmd\git.exe"
    ) else (
        echo [INFO] Portable Git not found locally. Running setup_and_push.ps1...
        powershell -ExecutionPolicy Bypass -File "%~dp0setup_and_push.ps1"
        pause
        exit /b 0
    )
)

echo Using Git: !GIT_CMD!

"!GIT_CMD!" config --global --add safe.directory "*" 2>nul
"!GIT_CMD!" config --global --add safe.directory "%~dp0." 2>nul

if not exist ".git" (
    echo [1/4] Initializing Git repository...
    "!GIT_CMD!" init
)

echo [2/4] Setting remote origin...
"!GIT_CMD!" remote remove origin 2>nul
"!GIT_CMD!" remote add origin https://github.com/zeerocodez/website.git

echo [3/4] Staging files...
"!GIT_CMD!" add .
"!GIT_CMD!" commit -m "feat: complete Zeerocodes platform, VibeScan security integration, and interactive UX suite"

echo [4/4] Pushing to https://github.com/zeerocodez/website...
"!GIT_CMD!" branch -M main
"!GIT_CMD!" push -u origin main

echo.
echo ==========================================================
echo   SUCCESS! Pushed to https://github.com/zeerocodez/website
echo ==========================================================
pause
