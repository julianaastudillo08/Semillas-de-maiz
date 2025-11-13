# Guía Completa: Subir Proyecto a GitHub y Configurar Hosting
## Semillas de Maíz - Plataforma Educativa Nasa Yuwe

---

## 📋 ÍNDICE

1. [Crear Repositorio en GitHub (Ramas main/dev)](#1-crear-repositorio-en-github-ramas-maindev)
2. [Instalar Dependencias](#2-instalar-dependencias)
3. [Configurar Hosting (Netlify/Vercel + Render)](#3-configurar-hosting-netlifyvercel--render)
4. [Comandos para Subir el Proyecto](#comandos-para-subir-el-proyecto)

---

## 1. CREAR REPOSITORIO EN GITHUB (RAMAS MAIN/DEV)

### Descripción Breve:
Configuración del repositorio en GitHub con estructura de ramas para desarrollo colaborativo. Se establecen dos ramas principales: `main` (producción) y `dev` (desarrollo), siguiendo el flujo de trabajo Git Flow.

### Paso 1: Inicializar Git en el Proyecto

Abre PowerShell en el directorio del proyecto y ejecuta:

```powershell
# Inicializar repositorio Git
git init

# Configurar usuario (si no está configurado)
git config user.name "julianaastudillo08"
git config user.email "tu-email@ejemplo.com"

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit: Proyecto Semillas de Maíz completo"
```

### Paso 2: Conectar con el Repositorio de GitHub

Tu repositorio ya existe en: `https://github.com/julianaastudillo08/Semillas-de-maiz`

```powershell
# Agregar repositorio remoto
git remote add origin https://github.com/julianaastudillo08/Semillas-de-maiz.git

# Verificar que se agregó correctamente
git remote -v
```

### Paso 3: Crear Rama Main y Subir Código

```powershell
# Renombrar rama actual a main (si es necesario)
git branch -M main

# Subir código a GitHub
git push -u origin main
```

**Nota:** Si GitHub te pide autenticación, puedes usar:
- **Personal Access Token** (recomendado)
- O configurar SSH keys

### Paso 4: Crear Rama de Desarrollo (dev)

```powershell
# Crear y cambiar a rama dev
git checkout -b dev

# Subir rama dev a GitHub
git push -u origin dev
```

### Paso 5: Verificar en GitHub

Ve a tu repositorio: https://github.com/julianaastudillo08/Semillas-de-maiz

Deberías ver:
- ✅ Rama `main` con todo el código
- ✅ Rama `dev` creada
- ✅ Todos los archivos del proyecto

---

## 2. INSTALAR DEPENDENCIAS

### Descripción Breve:
Instalación y configuración de todas las dependencias necesarias para el backend. Se incluyen las herramientas de seguridad (bcrypt, JWT), manejo de archivos (Multer), configuración de entorno (dotenv) y el framework web (Express).

### 2.1. Verificar Node.js

```powershell
# Verificar versión de Node.js
node --version
npm --version
```

**Requisito:** Node.js 18.x o superior

Si no lo tienes instalado:
1. Descargar desde: https://nodejs.org/
2. Instalar la versión LTS
3. Reiniciar PowerShell

### 2.2. Instalar Dependencias del Backend

```powershell
# Navegar al directorio backend
cd backend

# Instalar todas las dependencias
npm install

# Verificar instalación
npm list --depth=0
```

**Dependencias principales instaladas:**
- ✅ `express` - Framework web
- ✅ `bcrypt` - Encriptación de contraseñas
- ✅ `jsonwebtoken` - Autenticación JWT
- ✅ `multer` - Manejo de archivos
- ✅ `dotenv` - Variables de entorno
- ✅ `pg` - Cliente PostgreSQL
- ✅ `cors` - CORS para API
- ✅ `helmet` - Seguridad HTTP
- ✅ `express-validator` - Validación
- ✅ `cloudinary` - Almacenamiento
- ✅ `nodemailer` - Emails

### 2.3. Instalar Dependencias del Frontend

```powershell
# Volver a la raíz y navegar al frontend
cd ..
cd frontend

# Instalar todas las dependencias
npm install

# Verificar instalación
npm list --depth=0
```

**Dependencias principales instaladas:**
- ✅ `react` - Framework UI
- ✅ `react-router-dom` - Navegación
- ✅ `axios` - HTTP client
- ✅ `zustand` - State management
- ✅ `vite` - Build tool
- ✅ `tailwindcss` - Estilos

### 2.4. Configurar Variables de Entorno

#### Backend - Archivo `.env`

En `backend/.env` (crear si no existe):

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=semillas_de_maiz
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# Frontend URL
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

#### Frontend - Archivo `.env`

En `frontend/.env` (crear si no existe):

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Semillas de Maíz
```

### 2.5. Verificar Instalación

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Si todo está correcto:
- ✅ Backend: `http://localhost:5000`
- ✅ Frontend: `http://localhost:5173`

---

## 3. CONFIGURAR HOSTING (Netlify/Vercel + Render)

### Descripción Breve:
Configuración de infraestructura en la nube para desplegar la aplicación. El frontend se despliega en **Netlify o Vercel** (optimizados para aplicaciones React), mientras que el backend se despliega en **Render** (especializado en aplicaciones Node.js con bases de datos PostgreSQL).

### 3.1. Configurar Frontend en Netlify

#### Paso 1: Preparar el Proyecto

Ya creamos el archivo `netlify.toml` en la raíz del proyecto. Verifica que existe.

#### Paso 2: Conectar con Netlify

1. **Crear cuenta:**
   - Ir a https://www.netlify.com
   - Clic en "Sign up" → Conectar con GitHub

2. **Desplegar desde GitHub:**
   - Clic en "Add new site" → "Import an existing project"
   - Seleccionar repositorio: `julianaastudillo08/Semillas-de-maiz`
   - **Branch to deploy:** `main`
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
   - Clic en "Deploy site"

3. **Configurar Variables de Entorno:**
   - **Site settings** → **Environment variables**
   - Agregar:
     ```
     VITE_API_URL=https://semillas-de-maiz-backend.onrender.com/api
     ```
   - (Actualizar después de desplegar el backend)

4. **Obtener URL del Frontend:**
   - Netlify asignará una URL como: `https://semillas-de-maiz-123.netlify.app`
   - Anotar esta URL para configurar CORS en el backend

---

### 3.2. Configurar Frontend en Vercel (Alternativa)

#### Paso 1: Preparar el Proyecto

Ya creamos el archivo `vercel.json` en la raíz del proyecto.

#### Paso 2: Conectar con Vercel

1. **Crear cuenta:**
   - Ir a https://vercel.com
   - Clic en "Sign up" → Conectar con GitHub

2. **Importar Proyecto:**
   - Clic en "Add New" → "Project"
   - Seleccionar: `julianaastudillo08/Semillas-de-maiz`
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - Clic en "Deploy"

3. **Configurar Variables de Entorno:**
   - **Settings** → **Environment Variables**
   - Agregar:
     ```
     VITE_API_URL=https://semillas-de-maiz-backend.onrender.com/api
     ```

---

### 3.3. Configurar Backend en Render

#### Paso 1: Crear Base de Datos PostgreSQL

1. **Crear cuenta en Render:**
   - Ir a https://render.com
   - Clic en "Get Started" → Conectar con GitHub

2. **Crear Base de Datos:**
   - Clic en "New +" → "PostgreSQL"
   - **Name:** `semillas-de-maiz-db`
   - **Database:** `semillas_de_maiz`
   - **Region:** Seleccionar la más cercana (ej: `Oregon (US West)`)
   - **Plan:** Free (o el plan que prefieras)
   - Clic en "Create Database"

3. **Copiar Credenciales:**
   - Anotar: `Host`, `Port`, `Database`, `User`, `Password`
   - **Internal Database URL:** Para usar dentro de Render
   - Guardar estas credenciales de forma segura

#### Paso 2: Desplegar Backend

1. **Crear Web Service:**
   - Clic en "New +" → "Web Service"
   - Conectar repositorio: `julianaastudillo08/Semillas-de-maiz`
   - **Name:** `semillas-de-maiz-backend`
   - **Region:** Misma que la base de datos
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

2. **Configurar Variables de Entorno:**

   En la sección "Environment Variables", agregar:

   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<host_de_la_base_de_datos>
   DB_PORT=5432
   DB_NAME=semillas_de_maiz
   DB_USER=<usuario_de_la_base_de_datos>
   DB_PASSWORD=<contraseña_de_la_base_de_datos>
   JWT_SECRET=<generar_clave_secreta_aleatoria>
   CORS_ORIGIN=https://semillas-de-maiz-123.netlify.app
   CLOUDINARY_CLOUD_NAME=<tu_cloud_name>
   CLOUDINARY_API_KEY=<tu_api_key>
   CLOUDINARY_API_SECRET=<tu_api_secret>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<tu_email>
   EMAIL_PASS=<tu_contraseña>
   FRONTEND_URL=https://semillas-de-maiz-123.netlify.app
   ```

   **Nota:** Reemplazar los valores entre `< >` con tus credenciales reales.

3. **Ejecutar Migraciones:**

   Después del primer despliegue, en **Shell** de Render:

   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

4. **Obtener URL del Backend:**
   - Render asignará una URL como: `https://semillas-de-maiz-backend.onrender.com`
   - Esta URL puede tardar unos minutos en estar disponible

#### Paso 3: Actualizar URLs

1. **Actualizar CORS en Backend:**
   - En Render, editar variable `CORS_ORIGIN` con la URL de Netlify/Vercel
   - Hacer redeploy

2. **Actualizar Frontend:**
   - En Netlify/Vercel, actualizar `VITE_API_URL` con la URL de Render
   - Hacer redeploy

---

## COMANDOS PARA SUBIR EL PROYECTO

### Comandos Completos (Ejecutar en PowerShell)

```powershell
# 1. Navegar al directorio del proyecto
cd "C:\Users\Juliana\OneDrive\Desktop\Semillas de maiz"

# 2. Inicializar Git (si no está inicializado)
git init

# 3. Configurar Git (si no está configurado)
git config user.name "julianaastudillo08"
git config user.email "tu-email@ejemplo.com"

# 4. Agregar todos los archivos
git add .

# 5. Crear commit inicial
git commit -m "Initial commit: Proyecto Semillas de Maíz completo"

# 6. Agregar repositorio remoto
git remote add origin https://github.com/julianaastudillo08/Semillas-de-maiz.git

# 7. Renombrar rama a main
git branch -M main

# 8. Subir a GitHub
git push -u origin main

# 9. Crear rama dev
git checkout -b dev

# 10. Subir rama dev
git push -u origin dev
```

### Si ya existe contenido en GitHub y quieres reemplazarlo:

```powershell
# Forzar push (¡CUIDADO! Esto sobrescribe el contenido remoto)
git push -u origin main --force
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

### Repositorio GitHub
- [ ] Git inicializado en el proyecto
- [ ] Repositorio remoto configurado
- [ ] Rama `main` creada y subida
- [ ] Rama `dev` creada y subida
- [ ] Todos los archivos subidos correctamente

### Dependencias
- [ ] Node.js instalado (versión 18+)
- [ ] Dependencias del backend instaladas
- [ ] Dependencias del frontend instaladas
- [ ] Archivos `.env` configurados (backend y frontend)
- [ ] Proyecto funciona en local

### Hosting Frontend
- [ ] Cuenta creada en Netlify o Vercel
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas
- [ ] Frontend desplegado y funcionando

### Hosting Backend
- [ ] Cuenta creada en Render
- [ ] Base de datos PostgreSQL creada
- [ ] Backend desplegado
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Backend funcionando

### Integración
- [ ] URLs actualizadas (CORS y API_URL)
- [ ] Frontend conectado con backend
- [ ] Aplicación completa funcionando

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "fatal: not a git repository"
```powershell
git init
```

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/julianaastudillo08/Semillas-de-maiz.git
```

### Error: "Authentication failed"
- Usar Personal Access Token en lugar de contraseña
- Generar token en: GitHub → Settings → Developer settings → Personal access tokens

### Error al instalar dependencias
```powershell
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📝 NOTAS IMPORTANTES

1. **Seguridad:**
   - ❌ NUNCA subir archivos `.env` a GitHub
   - ✅ El `.gitignore` ya está configurado para excluirlos
   - ✅ Usar variables de entorno en los servicios de hosting

2. **Rendimiento:**
   - Plan Free de Render puede tener "cold starts" (inactividad después de 15 min)
   - Primera petición después de inactividad puede tardar ~30 segundos

3. **Backups:**
   - Configurar backups automáticos de la base de datos en Render
   - Mantener copias locales del código

4. **Monitoreo:**
   - Revisar logs en Render para debugging
   - Configurar alertas en Netlify/Vercel

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Subir código a GitHub
2. ✅ Instalar dependencias
3. ✅ Configurar hosting
4. ✅ Probar aplicación en producción
5. ✅ Configurar dominio personalizado (opcional)
6. ✅ Configurar CI/CD (opcional)

---

**Documento generado para: Semillas de Maíz - Plataforma Educativa Nasa Yuwe**
**Repositorio:** https://github.com/julianaastudillo08/Semillas-de-maiz

