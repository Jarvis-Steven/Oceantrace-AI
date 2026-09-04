# Oceantrace-AI Desktop Application Launcher
$env:RUSTUP_HOME = "D:\antigravity-resources\.rustup"
$env:CARGO_HOME = "D:\antigravity-resources\.cargo"
$env:PATH = "D:\antigravity-resources\w64devkit\bin;D:\antigravity-resources\.cargo\bin;" + $env:PATH

Set-Location -Path "$PSScriptRoot\frontend"
Write-Host "Launching Oceantrace-AI Desktop Shell..." -ForegroundColor Green
npx @tauri-apps/cli dev
