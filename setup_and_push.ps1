# MinGit Downloader & Automatic GitHub Pusher
$repoDir = 'd:\LAPTOP\zeerocodes'
$gitBinDir = Join-Path $repoDir 'git_bin'
$zipFile = Join-Path $repoDir 'mingit.zip'
$gitExe = Join-Path $gitBinDir 'cmd\git.exe'

if (-not (Test-Path $gitExe)) {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  Step 1: Downloading Standalone Portable Git (No Admin)..." -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan

    $downloadUrl = 'https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip'
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing

    Write-Host "Extracting to $gitBinDir..." -ForegroundColor Cyan
    if (-not (Test-Path $gitBinDir)) { New-Item -ItemType Directory -Path $gitBinDir | Out-Null }
    Expand-Archive -Path $zipFile -DestinationPath $gitBinDir -Force
    Remove-Item -Path $zipFile -Force
}

if (Test-Path $gitExe) {
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  Step 2: Pushing to https://github.com/zeerocodez/website" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green

    Set-Location $repoDir
    Remove-Item -Path "$repoDir\.git\index.lock" -Force -ErrorAction SilentlyContinue
    & $gitExe config --global --add safe.directory "*"
    & $gitExe config --global --add safe.directory "D:/LAPTOP/zeerocodes"
    & $gitExe init
    & $gitExe config user.name "zeerocodez"
    & $gitExe config user.email "nuel@zeerocodes.com"

    $remotes = & $gitExe remote
    if ($remotes -contains "origin") {
        & $gitExe remote set-url origin https://github.com/zeerocodez/website.git
    } else {
        & $gitExe remote add origin https://github.com/zeerocodez/website.git
    }

    & $gitExe add -A -- ":!git_bin" ":!mingit.zip"
    & $gitExe status
    & $gitExe commit -m "feat: complete Zeerocodes platform, VibeScan security integration, and interactive UX suite"
    & $gitExe branch -M main
    Write-Host "Pushing to GitHub origin main..." -ForegroundColor Cyan
    & $gitExe push -u origin main
} else {
    Write-Host "Git binary not found at $gitExe" -ForegroundColor Red
}
