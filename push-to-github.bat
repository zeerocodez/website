@echo off
setlocal
cd /d "%~dp0"
title Zeerocodes GitHub & Vercel Deployment

echo ==========================================================
echo   ZEEROCODES PLATFORM -^> GITHUB & VERCEL PUSHER
echo   Repository: https://github.com/zeerocodez/website
echo ==========================================================
echo.

set "GIT=%~dp0git_bin\cmd\git.exe"

if not exist "%GIT%" (
    where git >nul 2>nul
    if %errorlevel% equ 0 (
        set "GIT=git"
    ) else (
        echo [ERROR] git.exe was not found.
        echo Please ensure Git is installed.
        pause
        exit /b 1
    )
)

echo [1/5] Using Git from: "%GIT%"
echo.

:: Configure safe directory
"%GIT%" config --global --add safe.directory "*" 2>nul
"%GIT%" config --global --add safe.directory "%~dp0." 2>nul

:: Initialize repository if needed
if not exist ".git" (
    echo [2/5] Initializing Git repository...
    "%GIT%" init
)

:: Configure user identity
"%GIT%" config user.name "zeerocodez"
"%GIT%" config user.email "nuel@zeerocodes.com"

:: Set remote origin
echo [3/5] Setting remote origin...
"%GIT%" remote remove origin 2>nul
"%GIT%" remote add origin https://github.com/zeerocodez/website.git

:: Clean staging & commit
echo [4/5] Staging files...
"%GIT%" add .
"%GIT%" reset HEAD git_bin/ mingit.zip 2>nul
"%GIT%" commit -m "feat: complete Zeerocodes platform, VibeScan security integration, and interactive UX suite"

:: Push to main branch
echo [5/5] Pushing to https://github.com/zeerocodez/website on branch main...
"%GIT%" branch -M main
"%GIT%" push -u origin main

echo.
echo ==========================================================
echo   PROCESS FINISHED!
echo   Check your Vercel dashboard: your site is building!
echo ==========================================================
echo.
pause
