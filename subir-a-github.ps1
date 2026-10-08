# Subir ObraGest a GitHub (PowerShell)
param([string]$RepoUrl = "")
Set-Location $PSScriptRoot
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "[ERROR] Git no esta instalado. Descargalo: https://git-scm.com/download/win" -ForegroundColor Red
  exit 1
}
if (-not $RepoUrl) { $RepoUrl = Read-Host "Pega la URL de tu repo vacio (https://github.com/TU_USUARIO/TU_REPO.git)" }
if (-not $RepoUrl) { Write-Host "URL vacia. Cancelado."; exit 1 }
if (-not (Test-Path ".git")) { git init; git branch -M main }
git add .
try { git commit -m "ObraGest: gestion de obra publica" } catch { Write-Host "(nada nuevo que commitear)" }
try { git remote get-url origin | Out-Null; git remote set-url origin $RepoUrl } catch { git remote add origin $RepoUrl }
git branch -M main
git push -u origin main
Write-Host ""
Write-Host "OK. Activa Pages: Settings -> Pages -> Source: GitHub Actions." -ForegroundColor Green
