# Script para iniciar el backend
Write-Host "===========" -ForegroundColor Cyan
Write-Host "BACKEND - Semillas de Maiz" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "C:\Users\Juliana\OneDrive\Desktop\Semillas de maiz\backend"

Write-Host "Iniciando servidor backend..." -ForegroundColor Green
Write-Host "Puerto: 5000" -ForegroundColor Yellow
Write-Host "API: http://localhost:5000/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Red
Write-Host ""

npm run dev

