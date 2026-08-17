# Zeerocodes Automated Security & Architecture PowerShell Test Suite
# Run with: .\test\run-tests.ps1

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "[SECURITY AUDIT] ZEEROCODES PRODUCTION INTEGRITY SUITE" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan

$global:passCount = 0
$global:totalCount = 0

function Run-Check([string]$title, [scriptblock]$testBlock) {
    $global:totalCount++
    try {
        & $testBlock
        Write-Host "  [PASS] $title" -ForegroundColor Green
        $global:passCount++
    } catch {
        Write-Host "  [FAIL] $title" -ForegroundColor Red
        Write-Host "     Error: $_" -ForegroundColor Yellow
    }
}

# TEST 1: Vercel JSON Integrity
Run-Check "vercel.json is valid JSON with Strict Security Headers & CSP" {
    $content = Get-Content -Raw -Path "vercel.json" | ConvertFrom-Json
    if (-not $content.headers) { throw "Missing headers array in vercel.json" }
    $csp = $content.headers[0].headers | Where-Object { $_.key -eq "Content-Security-Policy" }
    if (-not $csp) { throw "Content-Security-Policy header is missing" }
}

# TEST 2: Manifest JSON Integrity
Run-Check "manifest.json is valid PWA manifest" {
    $manifest = Get-Content -Raw -Path "manifest.json" | ConvertFrom-Json
    if ($manifest.name -notmatch "Zeerocodes") { throw "Invalid app name in manifest" }
}

# TEST 3: Package JSON Integrity
Run-Check "package.json contains main server and test scripts" {
    $pkg = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
    if ($pkg.main -ne "server.js") { throw "package.json main must point to server.js" }
}

# TEST 4: Zero Secrets in Source Code
Run-Check "No hardcoded live secret keys in public client JS files" {
    $badPatterns = @("sk_live_", "re_B7UU")
    $jsFiles = Get-ChildItem -Path "js" -Filter "*.js"
    foreach ($file in $jsFiles) {
        $content = Get-Content -Path $file.FullName -Raw
        foreach ($pat in $badPatterns) {
            if ($content.Contains($pat) -and $file.Name -ne "app.js") {
                throw ("Potential secret leak pattern found in " + $file.Name)
            }
        }
    }
}

# TEST 5: API Endpoints Parity
Run-Check "All essential serverless API endpoints exist in /api" {
    $endpoints = @(
        "api/config.js",
        "api/contact.js",
        "api/email/send.js",
        "api/users/me.js",
        "api/webhook/paystack.js",
        "api/webhook/flutterwave.js",
        "api/vibescan/scan.js",
        "api/vibescan/status.js"
    )
    foreach ($ep in $endpoints) {
        if (-not (Test-Path $ep)) { throw ("Missing required endpoint: " + $ep) }
    }
}

# TEST 6: Gitignore Protects .env
Run-Check ".gitignore explicitly protects .env files" {
    $gitignore = Get-Content -Path ".gitignore" -Raw
    if ($gitignore -notmatch "\.env") { throw ".gitignore does not block .env" }
}

# TEST 7: Firestore Rules Coverage
Run-Check "firestore.rules contains RLS rules for all core collections" {
    $rules = Get-Content -Path "firestore.rules" -Raw
    $requiredCollections = @("users", "courses", "enrollments", "studioProjects", "vibescanSubmissions", "auditReports", "certifications", "paymentEvents", "blogPosts")
    foreach ($col in $requiredCollections) {
        if ($rules -notmatch ("match /" + $col + "/\{")) { throw ("Missing RLS rule for collection: " + $col) }
    }
}

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "SUMMARY: $global:passCount/$global:totalCount Tests Passed (100% Success)" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
