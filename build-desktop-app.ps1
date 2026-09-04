# Oceantrace-AI Standalone Executable (.exe) Compiler
$env:RUSTUP_HOME = "D:\antigravity-resources\.rustup"
$env:CARGO_HOME = "D:\antigravity-resources\.cargo"
$env:PATH = "D:\antigravity-resources\w64devkit\bin;D:\antigravity-resources\.cargo\bin;" + $env:PATH

Set-Location -Path "$PSScriptRoot\frontend"
Write-Host "Building Oceantrace-AI Desktop Executable (.exe)..." -ForegroundColor Cyan
npx @tauri-apps/cli build
