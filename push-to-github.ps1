# Automated GitHub Push Script for Zeerocodes
# Repository Target: https://github.com/zeerocodez/website.git

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  PUSHING ZEEROCODES TO GITHUB: https://github.com/zeerocodez/website" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if git is available
if (-not (Get-Command git.exe -ErrorAction SilentlyContinue)) {
    Write-Host "`n⚠️ Git is not found in your current terminal PATH." -ForegroundColor Yellow
    Write-Host "If you don't have Git installed, download it from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "After installing Git, re-run this script." -ForegroundColor White
    Write-Host "`nPress any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing local Git repository..." -ForegroundColor Yellow
    git init
}

# Configure remote
Write-Host "🔗 Linking remote origin: https://github.com/zeerocodez/website.git" -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/zeerocodez/website.git

# Stage and commit
Write-Host "📄 Staging all platform and VibeScan files..." -ForegroundColor Yellow
git add .

Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "feat: complete Zeerocodes platform, VibeScan security integration, and Vercel edge deployment"

# Push to main
Write-Host "🚀 Pushing to https://github.com/zeerocodez/website (main branch)..." -ForegroundColor Green
git branch -M main
git push -u origin main --force

Write-Host "`n✅ Successfully pushed to https://github.com/zeerocodez/website!" -ForegroundColor Green
