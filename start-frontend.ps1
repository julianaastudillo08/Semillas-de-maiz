# Script para iniciar el frontend
Write-Host "============" -ForegroundColor Cyan
Write-Host "FRONTEND - Semillas de Maiz" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "C:\Users\Juliana\OneDrive\Desktop\Semillas de maiz\frontend"

Write-Host "Iniciando aplicación web..." -ForegroundColor Green
Write-Host "Puerto: 5173" -ForegroundColor Yellow
Write-Host "URL: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Red
Write-Host ""

npm run dev

