# Guía de Despliegue - Semillas de Maíz

Esta guía explica cómo desplegar la aplicación Semillas de Maíz en producción utilizando servicios gratuitos.

## Arquitectura de Despliegue

- **Frontend**: Netlify o Vercel (Gratis)
- **Backend**: Render o Railway (Gratis)
- **Base de Datos**: Supabase o ElephantSQL (Gratis)
- **Almacenamiento**: Cloudinary (Gratis)

## 1. Preparación

### Actualizar configuraciones para producción

#### Backend `.env` de producción:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<url_de_supabase>
JWT_SECRET=<generar_secreto_seguro>
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=<tu_cloud_name>
CLOUDINARY_API_KEY=<tu_api_key>
CLOUDINARY_API_SECRET=<tu_api_secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<tu_email>
EMAIL_PASSWORD=<password_aplicacion>
ALLOWED_ORIGINS=https://tu-app.netlify.app
FRONTEND_URL=https://tu-app.netlify.app
```

## 2. Desplegar Base de Datos

### Opción A: Supabase (Recomendado)

1. Crea una cuenta en [Supabase](https://supabase.com/)
2. Crea un nuevo proyecto
3. Ve a Settings > Database y copia la "Connection String"
4. Reemplaza `[YOUR-PASSWORD]` con tu contraseña
5. Usa esta URL como `DATABASE_URL` en tu backend

### Opción B: ElephantSQL

1. Crea una cuenta en [ElephantSQL](https://www.elephantsql.com/)
2. Crea una nueva instancia (plan gratuito Tiny Turtle)
3. Copia la URL de conexión
4. Úsala como `DATABASE_URL`

### Ejecutar Migraciones en Producción

```bash
# Localmente, conectándote a la BD de producción
DATABASE_URL=<url_produccion> npm run migrate
DATABASE_URL=<url_produccion> npm run seed
```

## 3. Desplegar Backend

### Opción A: Render

1. Crea una cuenta en [Render](https://render.com/)
2. Crea un nuevo Web Service
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Agrega las variables de entorno desde el dashboard
6. Despliega

### Opción B: Railway

1. Crea una cuenta en [Railway](https://railway.app/)
2. Crea un nuevo proyecto
3. Selecciona "Deploy from GitHub repo"
4. Configuración:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Agrega las variables de entorno
6. Despliega

## 4. Desplegar Frontend

### Opción A: Netlify

1. Crea una cuenta en [Netlify](https://www.netlify.com/)
2. Conecta tu repositorio de GitHub
3. Configuración de build:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Variables de entorno:
   - `VITE_API_URL`: URL de tu backend de Render/Railway
5. Despliega

### Opción B: Vercel

1. Crea una cuenta en [Vercel](https://vercel.com/)
2. Importa tu proyecto desde GitHub
3. Configuración:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Variables de entorno:
   - `VITE_API_URL`: URL de tu backend
5. Despliega

## 5. Configurar Cloudinary

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/)
2. Obtén tus credenciales del Dashboard
3. Agrégalas a las variables de entorno del backend
4. Crea las carpetas necesarias:
   - `nasa-yuwe/audios`
   - `nasa-yuwe/images`

## 6. Configurar Email (Gmail)

1. Habilita verificación en 2 pasos en Gmail
2. Genera una contraseña de aplicación:
   - https://myaccount.google.com/apppasswords
3. Agrégala como `EMAIL_PASSWORD` en variables de entorno

## 7. Configurar CORS

Actualiza `ALLOWED_ORIGINS` en el backend con la URL de tu frontend:

```env
ALLOWED_ORIGINS=https://tu-app.netlify.app,https://tu-app.vercel.app
```

## 8. Verificación Post-Despliegue

### Checklist de verificación:

- [ ] El frontend carga correctamente
- [ ] El backend responde en `/health`
- [ ] Se puede iniciar sesión con credenciales de prueba
- [ ] El diccionario carga palabras
- [ ] Las actividades funcionan correctamente
- [ ] Los reportes muestran datos
- [ ] La recuperación de contraseña funciona
- [ ] Los emails se envían correctamente

### Probar endpoints:

```bash
# Health check
curl https://tu-backend.onrender.com/health

# Login
curl -X POST https://tu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@semillasmaiz.edu.co","password":"admin123"}'
```

## 9. Monitoreo

### Logs del Backend:

- **Render**: Dashboard > Logs
- **Railway**: Project > Deployments > Logs

### Errores comunes:

1. **Error 500**: Revisa logs del backend, probablemente error de BD
2. **CORS error**: Verifica `ALLOWED_ORIGINS`
3. **Cannot connect to database**: Verifica `DATABASE_URL`

## 10. Actualizaciones

Para actualizar la aplicación:

1. Haz push a tu repositorio de GitHub
2. Netlify/Vercel/Render/Railway desplegarán automáticamente
3. Si hay cambios en la BD, ejecuta migraciones:

```bash
# Conectarte a la BD de producción y ejecutar
npm run migrate
```

## 11. Backups

### Supabase:
- Los backups automáticos están incluidos en el plan gratuito
- Descarga backups manualmente desde el dashboard

### ElephantSQL:
- Plan gratuito no incluye backups automáticos
- Realiza backups manuales con `pg_dump`:

```bash
pg_dump <DATABASE_URL> > backup.sql
```

## 12. Costos Estimados

Con los servicios recomendados:

- **Supabase**: Gratis (hasta 500MB)
- **Render**: Gratis (con limitaciones de tiempo de actividad)
- **Netlify**: Gratis (100GB bandwidth)
- **Cloudinary**: Gratis (25 créditos/mes)
- **Total**: $0/mes

## 13. Escalamiento Futuro

Cuando la aplicación crezca, considera:

1. Migrar a planes pagos para mejor rendimiento
2. Usar CDN para assets estáticos
3. Implementar caché con Redis (Upstash gratis)
4. Configurar CI/CD con GitHub Actions
5. Agregar monitoreo con Sentry

---

¡Tu aplicación ahora está en producción! 🚀

