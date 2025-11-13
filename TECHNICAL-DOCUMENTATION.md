# Documentación Técnica - Semillas de Maíz

## Resumen del Proyecto

Semillas de Maíz es una plataforma educativa web diseñada para fortalecer el aprendizaje de la lengua Nasa Yuwe en estudiantes de preescolar y básica primaria del Centro Educativo Intercultural Semillas de Maíz.

## Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- React 18
- Vite (Build tool)
- Tailwind CSS (Estilos)
- React Router DOM (Navegación)
- Zustand (State management)
- Axios (HTTP client)
- React Hot Toast (Notificaciones)

**Backend:**
- Node.js con Express
- PostgreSQL (Base de datos)
- JWT (Autenticación)
- Bcrypt (Encriptación)
- Multer (Upload de archivos)
- Cloudinary (Almacenamiento)
- Nodemailer (Emails)

### Estructura de Directorios

```
semillas-de-maiz/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, Cloudinary)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── database/       # Migraciones y seeds
│   │   ├── middlewares/    # Middlewares (auth, validation, error handling)
│   │   ├── routes/         # Definición de rutas API
│   │   ├── utils/          # Utilidades (JWT, email)
│   │   └── server.js       # Punto de entrada
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── layouts/        # Layouts (Public, Student, Teacher, Admin)
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios API
│   │   ├── stores/         # Zustand stores
│   │   ├── App.jsx         # Componente principal
│   │   └── main.jsx        # Punto de entrada
│   ├── package.json
│   └── index.html
├── README.md
├── INSTALL.md
└── DEPLOYMENT.md
```

## Modelo de Base de Datos

### Tablas Principales

#### `users`
- Almacena información de todos los usuarios del sistema
- Roles: estudiante, docente, administrador
- Campos: id, full_name, email, password_hash, role, is_active, email_verified

#### `categories`
- Categorías para clasificar palabras (Animales, Familia, Números, etc.)
- Campos: id, name, description, icon_url

#### `words`
- Diccionario de palabras en español y Nasa Yuwe
- Campos: id, spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, audio_url, image_url, category_id, difficulty_level

#### `groups`
- Grupos de estudiantes creados por docentes
- Campos: id, name, education_level, grade, difficulty_level, teacher_id

#### `group_students`
- Relación muchos a muchos entre grupos y estudiantes
- Campos: id, group_id, student_id

#### `activities`
- Actividades de aprendizaje (quiz, completar oración, asociar imagen)
- Campos: id, title, description, type, difficulty_level, time_limit, passing_score

#### `questions`
- Preguntas asociadas a cada actividad
- Campos: id, activity_id, question_text, question_type, correct_answer, points

#### `question_options`
- Opciones de respuesta para cada pregunta
- Campos: id, question_id, option_text, option_label, is_correct

#### `activity_attempts`
- Registro de intentos de estudiantes en actividades
- Campos: id, activity_id, student_id, score, total_questions, correct_answers, time_taken, completed

#### `student_answers`
- Respuestas específicas de estudiantes a cada pregunta
- Campos: id, attempt_id, question_id, selected_option_id, is_correct, points_earned

#### `progress_tracking`
- Seguimiento del progreso general de cada estudiante
- Campos: id, student_id, total_activities_completed, average_score, last_activity_date

#### `audit_log`
- Registro de auditoría de acciones importantes
- Campos: id, user_id, action, entity_type, entity_id, old_values, new_values

### Vistas

#### `student_statistics`
- Vista consolidada de estadísticas por estudiante

#### `group_statistics`
- Vista consolidada de estadísticas por grupo

## API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registro de usuario | No |
| POST | `/login` | Iniciar sesión | No |
| POST | `/forgot-password` | Solicitar recuperación | No |
| POST | `/verify-reset-code` | Verificar código | No |
| POST | `/reset-password` | Restablecer contraseña | No |
| GET | `/verify-email` | Verificar email | No |
| GET | `/profile` | Obtener perfil | Sí |

### Diccionario (`/api/dictionary`)

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/search` | Buscar palabras | Todos |
| GET | `/categories` | Listar categorías | Todos |
| GET | `/categories/:id/words` | Palabras por categoría | Todos |
| GET | `/words/:id` | Detalle de palabra | Todos |
| GET | `/difficulty/:level` | Por dificultad | Todos |
| GET | `/random` | Palabra aleatoria | Todos |

### Actividades (`/api/activities`)

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/difficulty/:level` | Por dificultad | Estudiante |
| GET | `/type/:type` | Por tipo | Estudiante |
| GET | `/:id` | Detalle actividad | Estudiante |
| POST | `/:id/start` | Iniciar actividad | Estudiante |
| POST | `/attempts/:id/submit` | Enviar respuestas | Estudiante |
| GET | `/attempts/my-attempts` | Mis intentos | Estudiante |
| GET | `/attempts/:id` | Detalle intento | Estudiante |

### Grupos (`/api/groups`)

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| POST | `/` | Crear grupo | Docente |
| GET | `/` | Listar grupos | Docente |
| GET | `/:id` | Detalle grupo | Docente |
| PUT | `/:id` | Actualizar grupo | Docente |
| DELETE | `/:id` | Eliminar grupo | Docente |
| GET | `/students/search` | Buscar estudiantes | Docente |
| POST | `/:id/students` | Asignar estudiantes | Docente |
| DELETE | `/:id/students/:studentId` | Quitar estudiante | Docente |

### Reportes (`/api/reports`)

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/groups/:id` | Reporte de grupo | Docente, Admin |
| GET | `/students/:id` | Reporte de estudiante | Docente, Admin |
| GET | `/teacher/statistics` | Estadísticas docente | Docente |

### Administración (`/api/admin`)

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/users` | Listar usuarios | Admin |
| POST | `/users` | Crear usuario | Admin |
| PUT | `/users/:id` | Actualizar usuario | Admin |
| DELETE | `/users/:id` | Eliminar usuario | Admin |
| PATCH | `/users/:id/status` | Activar/Desactivar | Admin |
| PATCH | `/users/:id/role` | Asignar rol | Admin |
| GET | `/words` | Listar palabras | Admin |
| POST | `/words` | Crear palabra | Admin |
| PUT | `/words/:id` | Actualizar palabra | Admin |
| DELETE | `/words/:id` | Eliminar palabra | Admin |
| GET | `/activities` | Listar actividades | Admin |
| GET | `/statistics` | Estadísticas generales | Admin |

## Flujos Principales

### Flujo de Autenticación

1. Usuario ingresa credenciales
2. Backend valida en la base de datos
3. Si es válido, genera token JWT
4. Frontend almacena token en localStorage
5. Todas las peticiones subsiguientes incluyen el token en los headers
6. Middleware de autenticación valida el token en cada solicitud

### Flujo de Actividad

1. Estudiante selecciona nivel de dificultad
2. Sistema muestra actividades disponibles
3. Estudiante selecciona una actividad
4. Sistema inicia intento y cronómetro
5. Estudiante responde preguntas
6. Al finalizar o agotar tiempo, envía respuestas
7. Sistema calcula puntuación
8. Muestra resultados con respuestas correctas
9. Actualiza progreso del estudiante

### Flujo de Gestión de Grupos

1. Docente crea nuevo grupo
2. Busca estudiantes por nombre
3. Selecciona estudiantes a asignar
4. Sistema valida que no estén ya asignados
5. Crea relaciones en group_students
6. Docente puede ver reportes del grupo

## Seguridad

### Implementaciones de Seguridad

1. **Autenticación JWT**: Tokens firmados con secret seguro
2. **Encriptación de Contraseñas**: Bcrypt con 10 rondas de sal (salt rounds)
3. **Validación de Entrada**: Express-validator en todos los endpoints
4. **Sanitización**: Limpieza de scripts maliciosos
5. **CORS**: Configurado para dominios permitidos solamente
6. **Helmet**: Headers de seguridad HTTP
7. **Rate Limiting**: (Implementar en producción)
8. **SQL Injection Protection**: Queries parametrizadas
9. **XSS Protection**: Sanitización de inputs
10. **Session Timeout**: 30 minutos de inactividad

### Roles y Permisos

**Estudiante:**
- Ver diccionario
- Realizar actividades
- Ver su propio progreso

**Docente:**
- Todo lo de estudiante
- Crear y gestionar grupos
- Asignar estudiantes
- Ver reportes de sus grupos

**Administrador:**
- Gestión completa de usuarios
- Gestión de contenido (palabras, actividades)
- Ver estadísticas generales
- Asignar roles

## Performance y Optimización

### Backend

- **Connection Pool**: PostgreSQL con máximo 20 conexiones concurrentes
- **Índices**: Índices en columnas frecuentemente consultadas (email, role, category_id)
- **Vistas**: Vistas materializadas para reportes y estadísticas
- **Consultas**: Queries optimizadas con JOINs eficientes y paginación

### Frontend

- **Code Splitting**: División de código por rutas para carga inicial rápida
- **Lazy Loading**: Carga diferida de componentes no críticos
- **Imágenes**: Optimización y compresión de imágenes con Cloudinary
- **Caché**: Almacenamiento en caché de peticiones comunes
- **Debouncing**: Retraso en búsquedas para reducir llamadas al servidor

## Testing

### Estrategia de Testing

1. **Unit Tests**: Funciones de utilidad, helpers
2. **Integration Tests**: Endpoints de API
3. **E2E Tests**: Flujos críticos de usuario
4. **Load Testing**: Capacidad del sistema

### Herramientas Sugeridas

- **Jest** - Unit tests
- **Supertest** - API tests
- **Cypress** - E2E tests
- **Artillery** - Load testing

## Mantenimiento

### Tareas Regulares

1. **Diarias:**
   - Revisar logs de errores
   - Monitorear uso de recursos

2. **Semanales:**
   - Backup de base de datos
   - Revisar métricas de uso

3. **Mensuales:**
   - Actualizar dependencias
   - Revisar y optimizar queries lentas
   - Limpiar datos obsoletos

### Monitoreo

- **Logs centralizados** - Winston y Morgan
- **Métricas de aplicación** - Uso de CPU, memoria y base de datos
- **Monitoreo de disponibilidad** - Uptime monitoring
- **Seguimiento de errores** - Sentry (recomendado para producción)

## Escalabilidad

### Optimizaciones Futuras

1. **Backend:**
   - Implementar caché con Redis
   - Separar en microservicios
   - Load balancer
   - CDN para assets

2. **Base de Datos:**
   - Read replicas
   - Particionamiento de tablas grandes
   - Índices adicionales según uso

3. **Frontend:**
   - Service Workers para PWA
   - Optimización de bundle size
   - Server-Side Rendering (SSR)

## Troubleshooting

### Problemas Comunes

**Error: "Token expirado"**
- Solución: El usuario debe iniciar sesión nuevamente
- Causa: El tiempo de expiración configurado en JWT_EXPIRES_IN ha sido alcanzado
- Verificar la configuración de JWT_EXPIRES_IN en las variables de entorno

**Error: "Cannot connect to database"**
- Verificar que DATABASE_URL esté correctamente configurada
- Asegurar que PostgreSQL esté en ejecución
- Revisar configuración de firewall y red
- Confirmar que las credenciales de base de datos sean correctas

**Consultas lentas en la base de datos**
- Revisar y optimizar índices en las tablas más consultadas
- Optimizar las consultas con JOINs complejos
- Considerar desnormalización de datos para reportes frecuentes
- Analizar el plan de ejecución con EXPLAIN ANALYZE

## Contribución

### Guía para Desarrolladores

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código

- **Linting**: Utilizar ESLint para mantener calidad de código JavaScript
- **Formateo**: Prettier para formato consistente del código
- **Control de versiones**: Commits descriptivos siguiendo convenciones (ej: "feat:", "fix:", "docs:")
- **Documentación**: Documentar funciones complejas con JSDoc
- **Testing**: Incluir tests unitarios para todas las nuevas funcionalidades
- **Revisión de código**: Pull Requests requieren al menos una revisión antes de merge

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 8, 2024  
**Equipo de Desarrollo**: Juliana Chantre Astudillo, Isabella Velasco, Karen Osorio

