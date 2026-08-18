# =============================================================================
# Zeerocodes & VibeScan Local Development Web Server
# Powered by .NET HttpListener (Runs on any Windows system with zero dependencies)
# =============================================================================

param (
    [int]$Port = 8080,
    [string]$Root = $PSScriptRoot
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Failed to start listener on $prefix : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "🚀 ZEEROCODES & VIBESCAN LOCAL HOST ACTIVE" -ForegroundColor Green
Write-Host "🔗 URL: $prefix" -ForegroundColor Yellow
Write-Host "📁 Root: $Root" -ForegroundColor DarkGray
Write-Host "=================================================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".txt"  = "text/plain; charset=utf-8"
    ".pdf"  = "application/pdf"
}

$jobStore = @{}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Add CORS and Security Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
        $response.AddHeader("X-Content-Type-Options", "nosniff")
        $response.AddHeader("X-Frame-Options", "DENY")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        $rawUrl = $request.RawUrl.Split('?')[0]
        if ($rawUrl -eq "/" -or $rawUrl -eq "") {
            $rawUrl = "/index.html"
        }

        # Mock API routes for interactive demo
        if ($rawUrl -eq "/api/scan" -and $request.HttpMethod -eq "POST") {
            $scanId = "scan-" + [System.Guid]::NewGuid().ToString().Substring(0, 8)
            $mockResult = @{
                status = "completed"
                result = @{
                    repo = "my-vibe-project"
                    grade = "A"
                    score = 95
                    findingsCount = 0
                    findings = @()
                }
            }
            $json = $mockResult | ConvertTo-Json -Depth 5
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        $filePath = Join-Path $Root $rawUrl.TrimStart('/')
        $filePath = $filePath.Replace('/', '\')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            
            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $fileBytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
        } else {
            $notFoundHtml = "<html><body><h1>404 Not Found</h1><p>Resource $rawUrl does not exist.</p></body></html>"
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes($notFoundHtml)
            $response.StatusCode = 404
            $response.ContentType = "text/html"
            $response.ContentLength64 = $notFoundBytes.Length
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }

        $response.Close()
    } catch {
        # Catch unexpected client disconnects
    }
}
