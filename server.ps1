# Zeerocodes Localhost HTTP Server
$port = 8080
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  ZEEROCODES PLATFORM RUNNING AT $prefix" -ForegroundColor Green
    Write-Host "  Palette: #016B61 (Teal) | #85C79A (Green) | #E4EEE7 (Mint)" -ForegroundColor Yellow
    Write-Host "  Teach (Academy) - Build (Studio) - Protect (VibeScan)" -ForegroundColor White
    Write-Host "==========================================================" -ForegroundColor Cyan

    $contentTypes = @{
        ".html" = "text/html; charset=utf-8";
        ".css"  = "text/css; charset=utf-8";
        ".js"   = "application/javascript; charset=utf-8";
        ".png"  = "image/png";
        ".jpg"  = "image/jpeg";
        ".svg"  = "image/svg+xml";
        ".json" = "application/json"
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.AbsolutePath
        if ($urlPath -eq "/") { $urlPath = "/index.html" }

        $localPath = Join-Path (Get-Location) ($urlPath.TrimStart('/').Replace('/', '\'))

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath)
            if ($contentTypes.ContainsKey($ext)) {
                $response.ContentType = $contentTypes[$ext]
            } else {
                $response.ContentType = "application/octet-stream"
            }

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server stopped or error: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
