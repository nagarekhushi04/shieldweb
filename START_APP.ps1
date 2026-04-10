Write-Host "Stopping running Node processes to unlock files..." -ForegroundColor Yellow
Stop-Process -Name "node", "turbo" -Force -ErrorAction SilentlyContinue 

Write-Host "Aggressively cleaning disk space. This might take a moment..." -ForegroundColor Yellow

# Delete the root Node Modules and Locks
Set-Location -Path "C:\Users\khush\Shieldweb\shieldweb3"
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue

# Clear NPM Cache natively
Write-Host "Clearing NPM Cache completely..." -ForegroundColor Yellow
npm cache clean --force

# Search and destroy any mongodb memory server binaries in User profile
Remove-Item -Recurse -Force "$env:USERPROFILE\.mongodb-binaries" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\.cache\mongodb-binaries" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\mongodb-memory-server" -ErrorAction SilentlyContinue

Write-Host "Initializing ShieldWeb3 Frontend Without DB..." -ForegroundColor Cyan

if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Node.js Detected" -ForegroundColor Green
} else {
    Write-Host "Error: Node.js/NPM not found. Please install it first." -ForegroundColor Red
    Pause
    Exit
}

Write-Host "Installing Frontend Dependencies - Isolated mode..." -ForegroundColor Cyan
Set-Location -Path "apps\frontend"
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
npm install --no-fund --no-audit

Write-Host "Launching ShieldWeb3 Frontend..." -ForegroundColor Green
npm run dev

Pause
