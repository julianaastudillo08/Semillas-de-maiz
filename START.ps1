# Detener procesos anteriores
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "`nIniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Juliana\OneDrive\Desktop\Semillas de maiz\backend'; node src/server.js"

Start-Sleep -Seconds 3

Write-Host "Iniciando Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Juliana\OneDrive\Desktop\Semillas de maiz\frontend'; npm run dev"

Write-Host "`nEsperando que los servicios inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " SERVICIOS INICIADOS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Blue
Write-Host ""
Write-Host "Abriendo navegador..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"
Write-Host ""
Write-Host "CREDENCIALES ADMIN:" -ForegroundColor Yellow
Write-Host "Email: admin@semillasmaiz.edu.co" -ForegroundColor White
Write-Host "Pass:  admin123" -ForegroundColor White
Write-Host ""

