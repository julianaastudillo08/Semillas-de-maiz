# Script principal para iniciar toda la aplicación
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    SEMILLAS DE MAIZ - NASA YUWE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Iniciando aplicación completa..." -ForegroundColor Green
Write-Host ""

# Verificar que PostgreSQL esté corriendo
Write-Host "[1/4] Verificando PostgreSQL..." -ForegroundColor Yellow
$pgStatus = Get-Process -Name "postgres" -ErrorAction SilentlyContinue
if ($pgStatus) {
    Write-Host "      PostgreSQL OK" -ForegroundColor Green
} else {
    Write-Host "      ADVERTENCIA: PostgreSQL no parece estar corriendo" -ForegroundColor Red
    Write-Host "      Inicia PostgreSQL antes de continuar" -ForegroundColor Red
}
Write-Host ""

# Iniciar Backend
Write-Host "[2/4] Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "start-backend.ps1" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "      Backend iniciado en puerto 5000" -ForegroundColor Green
Write-Host ""

# Iniciar Frontend
Write-Host "[3/4] Iniciando Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "start-frontend.ps1" -WindowStyle Normal
Start-Sleep -Seconds 2
Write-Host "      Frontend iniciado en puerto 5173" -ForegroundColor Green
Write-Host ""

# Esperar a que todo esté listo
Write-Host "[4/4] Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Abrir navegador
Write-Host ""
Write-Host "Abriendo navegador..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    APLICACION LISTA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "CREDENCIALES DE PRUEBA:" -ForegroundColor Yellow
Write-Host "  Admin:      admin@semillasmaiz.edu.co / admin123" -ForegroundColor White
Write-Host "  Docente:    maria.lopez@semillasmaiz.edu.co / docente123" -ForegroundColor White
Write-Host "  Estudiante: juan.perez@semillasmaiz.edu.co / estudiante123" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

