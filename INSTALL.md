# Guía de Instalación - Semillas de Maíz

Esta guía te ayudará a configurar y ejecutar la aplicación Semillas de Maíz en tu entorno local.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **PostgreSQL** (versión 14 o superior)
- **npm** o **yarn**
- **Git**

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd "Semillas de maiz"
```

### 2. Configurar la Base de Datos

#### Crear la base de datos PostgreSQL

```bash
# Acceder a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE nasa_yuwe;

# Crear usuario (opcional)
CREATE USER nasa_user WITH PASSWORD 'tu_password_segura';
GRANT ALL PRIVILEGES ON DATABASE nasa_yuwe TO nasa_user;

# Salir
\q
```

### 3. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo de variables de entorno
cp env.example .env

# Editar el archivo .env con tus credenciales
# Ejemplo:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/nasa_yuwe
# JWT_SECRET=tu_secreto_muy_seguro_aqui
# PORT=5000
```

#### Editar el archivo `.env`

Abre el archivo `backend/.env` y configura las siguientes variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/nasa_yuwe
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nasa_yuwe
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=cambia_esto_por_un_secreto_muy_seguro_y_aleatorio
JWT_EXPIRES_IN=30d

# Cloudinary (opcional - para almacenamiento de archivos)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email (opcional - para recuperación de contraseña)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Ejecutar Migraciones y Seeds

```bash
# Crear las tablas en la base de datos
npm run migrate

# Poblar la base de datos con datos iniciales
npm run seed
```

#### Iniciar el servidor backend

```bash
# Modo desarrollo
npm run dev

# El servidor estará corriendo en http://localhost:5000
```

### 4. Configurar el Frontend

Abre una nueva terminal:

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo de variables de entorno
cp env.example .env

# El archivo ya debería tener la configuración correcta:
# VITE_API_URL=http://localhost:5000/api
```

#### Iniciar el servidor frontend

```bash
npm run dev

# La aplicación estará corriendo en http://localhost:5173
```

## Acceder a la Aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Usa las credenciales de prueba creadas por el seed:

### Credenciales de Prueba

**Administrador:**
- Email: `admin@semillasmaiz.edu.co`
- Contraseña: `admin123`

**Docente:**
- Email: `maria.lopez@semillasmaiz.edu.co`
- Contraseña: `docente123`

**Estudiante:**
- Email: `juan.perez@semillasmaiz.edu.co`
- Contraseña: `estudiante123`

## Configuración de Cloudinary (Opcional)

Para habilitar la subida de imágenes y audios:

1. Crea una cuenta gratuita en [Cloudinary](https://cloudinary.com/)
2. Obtén tus credenciales (Cloud Name, API Key, API Secret)
3. Agrégalas al archivo `.env` del backend
4. Reinicia el servidor backend

## Configuración de Email (Opcional)

Para habilitar la recuperación de contraseña:

### Usando Gmail:

1. Habilita la verificación en 2 pasos en tu cuenta de Gmail
2. Genera una contraseña de aplicación:
   - Ve a https://myaccount.google.com/apppasswords
   - Genera una nueva contraseña de aplicación
3. Usa esa contraseña en `EMAIL_PASSWORD` en el archivo `.env`
4. Reinicia el servidor backend

## Scripts Disponibles

### Backend

```bash
npm run dev        # Iniciar en modo desarrollo
npm run start      # Iniciar en modo producción
npm run migrate    # Ejecutar migraciones de BD
npm run seed       # Poblar BD con datos iniciales
npm test           # Ejecutar tests
```

### Frontend

```bash
npm run dev        # Iniciar en modo desarrollo
npm run build      # Construir para producción
npm run preview    # Previsualizar build de producción
npm run lint       # Ejecutar linter
```

## Solución de Problemas Comunes

### Error de conexión a PostgreSQL

- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Verifica las credenciales en el archivo `.env`
- Asegúrate de que la base de datos exista: `psql -l`

### Error "Puerto en uso"

- Cambia el puerto en el archivo `.env` (backend) o `vite.config.js` (frontend)
- O cierra la aplicación que esté usando ese puerto

### Errores de dependencias

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### La aplicación no carga datos

- Verifica que el backend esté corriendo en `http://localhost:5000`
- Abre las herramientas de desarrollo del navegador (F12) y revisa la consola
- Verifica que el seed se haya ejecutado correctamente

## Próximos Pasos

1. Explora la aplicación con las diferentes cuentas de usuario
2. Revisa la documentación de las APIs en la carpeta `backend/src/routes`
3. Personaliza el contenido agregando más palabras y actividades
4. Configura Cloudinary para subir audios e imágenes

## Soporte

Si encuentras algún problema durante la instalación:

1. Revisa esta guía nuevamente
2. Verifica los logs de la consola del backend y frontend
3. Consulta el README.md para más información sobre el proyecto

---

¡Disfruta aprendiendo Nasa Yuwe! 🌽

