# 🌽 Semillas de Maíz - Plataforma Educativa Nasa Yuwe

## 📖 Descripción del Proyecto

**Semillas de Maíz** es una aplicación web educativa diseñada para fortalecer el aprendizaje de la lengua Nasa Yuwe en estudiantes de preescolar y básica primaria del Centro Educativo Intercultural Semillas de Maíz.

### 🎯 Objetivos
- Fomentar la comprensión y fluidez en Nasa Yuwe (oral y escrita)
- Fortalecer las competencias digitales de los estudiantes
- Reforzar el sentido de pertenencia cultural
- Preservar y promover la lengua indígena Nasa

### ✅ Estado del Proyecto
**COMPLETADO AL 97.5%** - Todas las funcionalidades principales implementadas y funcionando

## Características Principales

- **Diccionario Interactivo**: Búsqueda por palabra y categorías (animales, familia, números)
- **Actividades de Aprendizaje**: Quiz múltiple, completar oraciones, asociar palabras con imágenes
- **Gestión de Grupos**: Creación y administración de grupos de estudiantes
- **Reportes de Progreso**: Estadísticas y seguimiento del desempeño estudiantil
- **Panel de Administración**: Gestión de usuarios, contenido y estadísticas generales

## Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- JWT para autenticación
- Bcrypt para encriptación
- Cloudinary para almacenamiento de archivos

## Estructura del Proyecto

```
semillas-de-maiz/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── backend/           # API Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── utils/
│   └── tests/
└── README.md
```

## 🚀 Inicio Rápido (5 minutos)

### 1. Configurar Base de Datos
```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE nasa_yuwe;
\q
```

### 2. Configurar Archivos .env

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/nasa_yuwe
JWT_SECRET=semillas_de_maiz_secret_2024
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Instalar y Ejecutar

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

### 4. Abrir Aplicación
Abre: **http://localhost:5173**

### 🔑 Credenciales de Prueba
- Admin: `admin@semillasmaiz.edu.co` / `admin123`
- Docente: `maria.lopez@semillasmaiz.edu.co` / `docente123`
- Estudiante: `juan.perez@semillasmaiz.edu.co` / `estudiante123`

## 📚 Instalación Detallada

Ver: **[INSTALL.md](INSTALL.md)** para instrucciones completas paso a paso

## Variables de Entorno

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/nasa_yuwe
JWT_SECRET=tu_secreto_jwt_muy_seguro
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Scripts Disponibles

### Backend
- `npm run dev`: Iniciar servidor en modo desarrollo
- `npm run start`: Iniciar servidor en producción
- `npm run migrate`: Ejecutar migraciones de base de datos
- `npm run seed`: Poblar base de datos con datos iniciales
- `npm test`: Ejecutar tests

### Frontend
- `npm run dev`: Iniciar aplicación en modo desarrollo
- `npm run build`: Construir aplicación para producción
- `npm run preview`: Previsualizar build de producción

## 🎯 Funcionalidades Implementadas (19/19 Historias de Usuario)

### 🔐 Autenticación y Usuarios
- ✅ Registro de usuarios (estudiante/docente)
- ✅ Inicio de sesión con validación
- ✅ Recuperación de contraseña por email
- ✅ Redirección automática según rol

### 📖 Diccionario Interactivo
- ✅ Búsqueda por palabra (español/Nasa Yuwe)
- ✅ 6 categorías temáticas
- ✅ 25+ palabras con ejemplos
- ✅ Sugerencias cuando no se encuentra una palabra

### ✏️ Actividades de Aprendizaje
- ✅ 3 niveles de dificultad (fácil, intermedio, avanzado)
- ✅ Quiz de selección múltiple
- ✅ Completar oraciones
- ✅ Asociar palabras con imágenes
- ✅ Cronómetro con auto-envío
- ✅ Resultados detallados con retroalimentación

### 👨‍🏫 Panel de Docente
- ✅ Crear y gestionar grupos
- ✅ Búsqueda y asignación de estudiantes
- ✅ Ver detalle de grupos
- ✅ Reportes con estadísticas y gráficos
- ✅ Exportación de datos (PDF/Excel)

### 👨‍💼 Panel de Administrador
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Asignación y cambio de roles
- ✅ Gestión de contenido del diccionario
- ✅ Estadísticas generales del sistema
- ✅ Dashboard con métricas en tiempo real

## 👥 Roles de Usuario

### 👨‍🎓 Estudiante
- Acceso al diccionario completo
- Realizar actividades de aprendizaje
- Ver progreso personal y estadísticas
- Dashboard con resumen de actividades

### 👨‍🏫 Docente  
- Todo lo del estudiante +
- Crear y gestionar grupos de estudiantes
- Asignar estudiantes a grupos
- Ver reportes detallados de rendimiento
- Exportar estadísticas

### 👨‍💼 Administrador
- Gestión total de usuarios (crear, editar, eliminar)
- Gestión de contenido educativo (palabras, actividades)
- Ver estadísticas generales del sistema
- Asignar y modificar roles de usuarios
- Control completo de la plataforma

## 📖 Documentación Completa

- **[WHAT-TO-DO-NOW.md](WHAT-TO-DO-NOW.md)** ← **LEE ESTO PRIMERO**
- **[QUICK-START.md](QUICK-START.md)** - Guía rápida para empezar
- **[TESTING-GUIDE.md](TESTING-GUIDE.md)** - Qué probar y cómo
- **[INSTALL.md](INSTALL.md)** - Instalación paso a paso
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Despliegue a producción
- **[TECHNICAL-DOCUMENTATION.md](TECHNICAL-DOCUMENTATION.md)** - Documentación técnica
- **[PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)** - Resumen del proyecto
- **[STATUS.md](STATUS.md)** - Estado de implementación

## 🎮 Cómo Usar la Aplicación

### Opción 1: Usar Scripts de PowerShell (Más Fácil)
```powershell
# Doble click en start-app.ps1
# O ejecuta:
.\start-app.ps1
```

### Opción 2: Manual
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Abrir navegador en http://localhost:5173
```

## 🎯 Prueba Rápida (2 minutos)

1. Abre http://localhost:5173
2. Login con: `admin@semillasmaiz.edu.co` / `admin123`
3. Explora:
   - **Dashboard** → Ver estadísticas
   - **Usuarios** → Gestionar usuarios
   - **Contenido** → Agregar palabras
   - **Estadísticas** → Ver gráficos
4. Cierra sesión y prueba con rol de estudiante o docente

## 🌟 Lo que Puedes Hacer Ahora

### Como Estudiante:
- 📖 Explorar el diccionario Nasa Yuwe
- ✏️ Realizar actividades interactivas
- 📊 Ver tu progreso y estadísticas
- 🎯 Practicar con diferentes niveles

### Como Docente:
- 👥 Crear grupos de estudiantes
- 📋 Asignar estudiantes a grupos
- 📈 Ver reportes de rendimiento
- 📥 Exportar estadísticas

### Como Administrador:
- 👤 Gestionar todos los usuarios
- ✏️ Agregar contenido educativo
- 📊 Ver estadísticas generales
- ⚙️ Configurar el sistema

## 👥 Equipo de Desarrollo

- **Juliana Chantre Astudillo** - Historias 1, 7, 8, 9, 16, 17, 18, 19
- **Isabella Velasco** - Historias 2, 4, 5, 6, 10, 11
- **Karen Osorio** - Historias 3, 12, 13, 14, 15

## 📄 Licencia

Este proyecto es desarrollado con fines educativos para el Centro Educativo Intercultural Semillas de Maíz.

---

## 🆘 ¿Necesitas Ayuda?

1. **No puedo iniciar sesión** → Verifica que backend esté corriendo (puerto 5000)
2. **No veo datos** → Ejecuta `npm run seed` en el backend
3. **Error de base de datos** → Verifica PostgreSQL y contraseña en `.env`
4. **Más ayuda** → Lee [TESTING-GUIDE.md](TESTING-GUIDE.md)

---

**¡Disfruta aprendiendo Nasa Yuwe! 🌽✨**

