@echo off
setlocal enabledelayedexpansion
title Zeerocodes GitHub & Vercel Auto-Pusher
cd /d "%~dp0"

echo ==========================================================
echo   ZEEROCODES PLATFORM - GITHUB & VERCEL DEPLOYMENT
echo   Target: https://github.com/zeerocodez/website
echo ==========================================================
echo.

:: 1. Locate Git executable
set "GIT_EXE=git"
where git >nul 2>nul
if %errorlevel% equ 0 goto :RUN_GIT

if exist "%~dp0git_bin\cmd\git.exe" (
    set "GIT_EXE=%~dp0git_bin\cmd\git.exe"
    goto :RUN_GIT
)
if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"
    goto :RUN_GIT
)
if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
    set "GIT_EXE=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    goto :RUN_GIT
)

echo [1/4] Git not found. Downloading lightweight portable Git...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip' -OutFile '%~dp0mingit.zip' -UseBasicParsing; Expand-Archive -Path '%~dp0mingit.zip' -DestinationPath '%~dp0git_bin' -Force; Remove-Item -Path '%~dp0mingit.zip' -Force"

if exist "%~dp0git_bin\cmd\git.exe" (
    set "GIT_EXE=%~dp0git_bin\cmd\git.exe"
    goto :RUN_GIT
)

echo.
echo [ERROR] Git could not be set up automatically.
echo Please install Git from: https://git-scm.com/download/win
pause
exit /b 1

:RUN_GIT
echo [Found Git] %GIT_EXE%
echo.

:: Fix dubious ownership & configure user
"%GIT_EXE%" config --global --add safe.directory "*" >nul 2>nul
"%GIT_EXE%" config --global --add safe.directory "%~dp0." >nul 2>nul

if not exist ".git" (
    echo [2/4] Initializing Git repository...
    "%GIT_EXE%" init
)

"%GIT_EXE%" config user.name "zeerocodez"
"%GIT_EXE%" config user.email "nuel@zeerocodes.com"

echo [3/4] Configuring remote origin (https://github.com/zeerocodez/website.git)...
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin https://github.com/zeerocodez/website.git

echo [4/4] Staging and committing project files...
"%GIT_EXE%" add -A -- ":!git_bin" ":!mingit.zip"
"%GIT_EXE%" commit -m "feat: complete Zeerocodes platform, VibeScan security integration, and interactive UX suite"

echo.
echo ==========================================================
echo   PUSHING TO GITHUB (MAIN BRANCH)...
echo ==========================================================
"%GIT_EXE%" branch -M main
"%GIT_EXE%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================================
    echo   SUCCESS! Pushed to https://github.com/zeerocodez/website
    echo   Vercel will now automatically build and deploy your site!
    echo ==========================================================
) else (
    echo.
    echo ==========================================================
    echo   [NOTE] If GitHub requires login, please authenticate above.
    echo ==========================================================
)

pause
