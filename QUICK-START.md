# 🚀 Guía Rápida de Inicio - Semillas de Maíz

## Paso 1: Crear archivos de configuración

### Backend - Crear archivo `backend/.env`
Crea el archivo `.env` en la carpeta `backend` con este contenido:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nasa_yuwe
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nasa_yuwe
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRES
JWT_SECRET=semillas_de_maiz_secret_2024
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
ALLOWED_ORIGINS=http://localhost:5173
```

**⚠️ IMPORTANTE:** Cambia `TU_PASSWORD_DE_POSTGRES` por tu contraseña real de PostgreSQL

### Frontend - Crear archivo `frontend/.env`
Crea el archivo `.env` en la carpeta `frontend` con este contenido:

```env
VITE_API_URL=http://localhost:5000/api
```

## Paso 2: Crear la base de datos

Abre **pgAdmin** o la terminal de PostgreSQL y ejecuta:

```sql
CREATE DATABASE nasa_yuwe;
```

O desde CMD/PowerShell (te pedirá la contraseña):
```bash
psql -U postgres
```
Luego dentro de psql:
```sql
CREATE DATABASE nasa_yuwe;
\q
```

## Paso 3: Instalar dependencias del Backend

```bash
cd backend
npm install
```

## Paso 4: Ejecutar migraciones y seed

```bash
npm run migrate
npm run seed
```

## Paso 5: Iniciar el Backend

```bash
npm run dev
```

✅ Deberías ver: `🚀 Servidor corriendo en puerto 5000`

**Deja esta terminal abierta**

## Paso 6: Instalar dependencias del Frontend

Abre una **NUEVA TERMINAL** y ejecuta:

```bash
cd frontend
npm install
```

## Paso 7: Iniciar el Frontend

```bash
npm run dev
```

✅ Deberías ver: `Local: http://localhost:5173/`

## Paso 8: Abrir la aplicación

Abre tu navegador en: **http://localhost:5173**

## 🔑 Credenciales para probar

**Administrador:**
- Email: `admin@semillasmaiz.edu.co`
- Password: `admin123`

**Docente:**
- Email: `maria.lopez@semillasmaiz.edu.co`
- Password: `docente123`

**Estudiante:**
- Email: `juan.perez@semillasmaiz.edu.co`
- Password: `estudiante123`

---

## ❌ Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Verifica tu contraseña en `backend/.env`
- Asegúrate que la base de datos `nasa_yuwe` exista

### Error: "Port 5000 already in use"
- Cambia el puerto en `backend/.env` a otro (ej: 5001)
- Y actualiza `frontend/.env`: `VITE_API_URL=http://localhost:5001/api`

### Error: "Module not found"
- Ejecuta `npm install` en la carpeta correspondiente (backend o frontend)

### El frontend no carga datos
- Verifica que el backend esté corriendo en http://localhost:5000
- Abre las herramientas de desarrollo (F12) y revisa la consola

---

## 📝 Resumen de Comandos

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

¡Listo! Tu aplicación debería estar funcionando 🎉

