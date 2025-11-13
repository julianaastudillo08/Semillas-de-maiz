# ════════════════════════════════════════════════════════════════
#  🌽 SCRIPT PARA INICIAR SEMILLAS DE MAÍZ
# ════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🌽 INICIANDO SEMILLAS DE MAÍZ - NASA YUWE" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Detener procesos existentes
Write-Host "🛑 Deteniendo procesos anteriores..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Iniciar Backend
Write-Host ""
Write-Host "🚀 Iniciando BACKEND..." -ForegroundColor Cyan
$backendPath = "C:\Users\Juliana\OneDrive\Desktop\Semillas de maiz\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    `$host.UI.RawUI.WindowTitle = '🌽 Backend - Puerto 5000';
    Write-Host '════════════════════════════════════════════' -ForegroundColor Green;
    Write-Host '  🌽 BACKEND - SEMILLAS DE MAÍZ' -ForegroundColor Yellow;
    Write-Host '════════════════════════════════════════════' -ForegroundColor Green;
    Write-Host '';
    cd '$backendPath';
    node src/server.js
"

Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "🚀 Iniciando FRONTEND..." -ForegroundColor Cyan
$frontendPath = "C:\Users\Juliana\OneDrive\Desktop\Semillas de maiz\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    `$host.UI.RawUI.WindowTitle = '🎨 Frontend - Puerto 5173';
    Write-Host '════════════════════════════════════════════' -ForegroundColor Blue;
    Write-Host '  🎨 FRONTEND - SEMILLAS DE MAÍZ' -ForegroundColor Yellow;
    Write-Host '════════════════════════════════════════════' -ForegroundColor Blue;
    Write-Host '';
    cd '$frontendPath';
    npm run dev
"

# Esperar a que los servicios inicien
Write-Host ""
Write-Host "⏳ Esperando que los servicios inicien (15 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar servicios
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🔍 VERIFICANDO SERVICIOS" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ BACKEND: Funcionando correctamente" -ForegroundColor Green
    Write-Host "   Puerto: 5000" -ForegroundColor White
} catch {
    Write-Host "❌ BACKEND: No responde" -ForegroundColor Red
    Write-Host "   Verifica la ventana de PowerShell del backend" -ForegroundColor Gray
}

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -Method Head -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ FRONTEND: Funcionando correctamente" -ForegroundColor Green
    Write-Host "   Puerto: 5173" -ForegroundColor White
} catch {
    Write-Host "❌ FRONTEND: No responde" -ForegroundColor Red
    Write-Host "   Verifica la ventana de PowerShell del frontend" -ForegroundColor Gray
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🌐 ABRE TU NAVEGADOR" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "   http://localhost:5173" -ForegroundColor Blue
Write-Host ""
Write-Host "🔑 CREDENCIALES DE ADMINISTRADOR:" -ForegroundColor Yellow
Write-Host "   Email:      admin@semillasmaiz.edu.co" -ForegroundColor White
Write-Host "   Contraseña: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📍 NUEVA FUNCIONALIDAD:" -ForegroundColor Yellow
Write-Host "   Admin -> Pendientes (para aprobar/rechazar usuarios)" -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Abrir navegador automáticamente
Write-Host "🌐 Abriendo navegador..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ Todo listo! Mantén las ventanas de PowerShell abiertas." -ForegroundColor Green
Write-Host ""

