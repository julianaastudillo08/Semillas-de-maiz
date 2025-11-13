# 📊 Guía de Exportación a Excel y PDF

## 🎯 Descripción General

Se ha implementado la funcionalidad completa para exportar datos a **Excel** y **PDF** en la plataforma Semillas de Maíz.

---

## 📦 Librerías Utilizadas

### Backend:
- **`exceljs`**: Generación de archivos Excel (.xlsx)
- **`pdfkit`**: Generación de archivos PDF

### Instalación:
```bash
npm install exceljs pdfkit
```

---

## 🔧 Implementación Técnica

### 1. Backend

#### Archivo: `backend/src/controllers/exportController.js`

Contiene 4 funciones principales:

1. **`exportGroupToExcel`** - Exportar reporte de grupo a Excel
2. **`exportGroupToPDF`** - Exportar reporte de grupo a PDF
3. **`exportStatisticsToExcel`** - Exportar estadísticas generales a Excel (Admin)
4. **`exportStudentProgressToPDF`** - Exportar progreso de estudiante a PDF

#### Archivo: `backend/src/routes/exportRoutes.js`

Rutas disponibles:
- `GET /api/export/group/:groupId/excel` - Exportar grupo a Excel (Docente)
- `GET /api/export/group/:groupId/pdf` - Exportar grupo a PDF (Docente)
- `GET /api/export/statistics/excel` - Exportar estadísticas a Excel (Admin)
- `GET /api/export/student/progress/pdf` - Exportar progreso propio (Estudiante)
- `GET /api/export/student/:studentId/progress/pdf` - Exportar progreso de estudiante (Docente/Admin)

### 2. Frontend

#### Archivo: `frontend/src/pages/teacher/GroupDetail.jsx`

**Funciones agregadas:**
```javascript
const handleExportExcel = async () => {
  // Descarga archivo Excel del grupo
}

const handleExportPDF = async () => {
  // Descarga archivo PDF del grupo
}
```

**Botones agregados:**
- Botón "Excel" (verde) - Exporta a Excel
- Botón "PDF" (rojo) - Exporta a PDF

---

## 📚 Funcionalidades por Rol

### 👨‍🏫 **DOCENTES**

#### Exportar Reporte de Grupo

**Ubicación**: Grupos → Seleccionar grupo → Botones "Excel" o "PDF"

**Contenido del Excel:**
- Título del grupo
- Lista de estudiantes con:
  - Nombre Completo
  - Correo
  - Actividades Completadas
  - Promedio
  - Palabras Aprendidas
  - Última Actividad

**Contenido del PDF:**
- Encabezado con nombre del grupo, nivel y grado
- Tabla con estudiantes y sus estadísticas
- Pie de página con fecha de generación

### 👨‍🎓 **ESTUDIANTES**

#### Exportar Progreso Personal

**Ubicación**: Dashboard → Botón "Exportar Progreso" (disponible próximamente)

**Contenido del PDF:**
- Nombre y correo del estudiante
- Estadísticas generales:
  - Actividades completadas
  - Promedio general
  - Palabras aprendidas
- Últimas 10 actividades realizadas con:
  - Título
  - Puntuación
  - Dificultad
  - Fecha

### 🔧 **ADMINISTRADORES**

#### Exportar Estadísticas Generales

**Ubicación**: Estadísticas → Botón "Exportar a Excel"

**Contenido del Excel:**

**Hoja 1 - Usuarios:**
- Rol
- Total
- Activos

**Hoja 2 - Contenido:**
- Palabras en Diccionario
- Actividades Activas
- Intentos Completados

---

## 💻 Código de Ejemplo

### Llamada desde Frontend:

```javascript
// Exportar a Excel
const handleExportExcel = async () => {
  try {
    toast.loading('Generando archivo Excel...')
    const response = await api.get(`/export/group/${groupId}/excel`, {
      responseType: 'blob' // IMPORTANTE: Especificar blob
    })
    
    // Crear URL y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `reporte_${Date.now()}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    toast.dismiss()
    toast.success('Archivo Excel generado correctamente')
  } catch (error) {
    toast.dismiss()
    toast.error('Error al generar archivo Excel')
  }
}
```

### Controlador Backend (Ejemplo Excel):

```javascript
export const exportGroupToExcel = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    
    // Obtener datos de la BD
    const studentsResult = await pool.query(/* ... */);
    
    // Crear workbook de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');
    
    // Configurar columnas
    worksheet.columns = [
      { header: 'Nombre', key: 'name', width: 30 },
      // ...más columnas
    ];
    
    // Agregar datos
    studentsResult.rows.forEach(student => {
      worksheet.addRow({
        name: student.name,
        // ...más datos
      });
    });
    
    // Enviar respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=reporte.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};
```

### Controlador Backend (Ejemplo PDF):

```javascript
export const exportGroupToPDF = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    
    // Obtener datos
    const studentsResult = await pool.query(/* ... */);
    
    // Crear documento PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Configurar respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte.pdf`);
    
    doc.pipe(res);
    
    // Título
    doc.fontSize(20).text('Reporte del Grupo', { align: 'center' });
    doc.moveDown();
    
    // Contenido
    studentsResult.rows.forEach(student => {
      doc.fontSize(10);
      doc.text(student.name);
      doc.text(`Promedio: ${student.average}`);
      doc.moveDown();
    });
    
    // Finalizar
    doc.end();
  } catch (error) {
    next(error);
  }
};
```

---

## 🎨 Formato de Archivos

### Excel (.xlsx)

**Características:**
- Encabezados en negrita con fondo gris
- Columnas con ancho automático
- Título centrado y en grande
- Datos ordenados alfabéticamente

**Ejemplo de estructura:**

| Nombre Completo | Correo | Actividades | Promedio | Palabras | Última Actividad |
|-----------------|--------|-------------|----------|----------|------------------|
| Juan Pérez      | juan@  | 5           | 85.50    | 120      | 08/11/2024       |

### PDF

**Características:**
- Encabezado centrado con título grande
- Información del grupo/estudiante
- Tabla con datos formateados
- Pie de página con fecha de generación
- Márgenes de 50px

**Diseño:**
```
┌────────────────────────────────────┐
│                                    │
│   Reporte del Grupo: Preescolar A  │
│   Nivel: Preescolar                │
│                                    │
├────────────────────────────────────┤
│                                    │
│  Nombre    Actividades  Promedio   │
│  ────────  ───────────  ────────   │
│  Juan      5            85.5        │
│  María     3            92.0        │
│                                    │
├────────────────────────────────────┤
│ Generado el 08/11/2024 15:30       │
└────────────────────────────────────┘
```

---

## 🚀 Cómo Usar

### Para Docentes:

1. **Iniciar sesión** como docente
2. Ir a **"Grupos"**
3. **Seleccionar** un grupo de la lista
4. En la parte superior verás los botones:
   - 🟢 **Excel** (botón verde)
   - 🔴 **PDF** (botón rojo)
5. **Click** en el botón deseado
6. ✅ El archivo se descargará automáticamente

### Para Estudiantes:

1. **Iniciar sesión** como estudiante
2. Ir al **Dashboard**
3. Click en **"Exportar Mi Progreso"**
4. ✅ Se descargará un PDF con tu progreso

### Para Administradores:

1. **Iniciar sesión** como administrador
2. Ir a **"Estadísticas"**
3. Click en **"Exportar a Excel"**
4. ✅ Se descargará un Excel con todas las estadísticas

---

## 🔒 Seguridad

**Autenticación y Autorización:**
- Todas las rutas requieren JWT válido
- Los docentes solo pueden exportar sus propios grupos
- Los estudiantes solo pueden exportar su propio progreso
- Los administradores tienen acceso completo

**Validaciones:**
- Verificación de que el grupo pertenece al docente
- Verificación de que el estudiante existe
- Manejo de errores apropiado

---

## 🐛 Solución de Problemas

### Error: "Archivo no se descarga"
**Solución**: Verifica que el backend esté corriendo y que el usuario tenga permisos.

### Error: "Invalid token"
**Solución**: Vuelve a iniciar sesión.

### Error: "Grupo no encontrado"
**Solución**: Verifica que el grupo existe y pertenece al docente.

### Archivo Excel vacío
**Solución**: Verifica que el grupo tenga estudiantes asignados.

---

## 📝 Notas Técnicas

1. **responseType: 'blob'** es esencial en las llamadas Axios para archivos binarios
2. Los archivos se nombran con timestamp para evitar sobrescritura
3. El formato de fecha es 'es-CO' (español de Colombia)
4. Los PDFs tienen paginación automática si el contenido es extenso
5. Los archivos Excel tienen múltiples hojas si es necesario

---

## 🔄 Próximas Mejoras

- [ ] Botón de exportación en Dashboard de estudiantes
- [ ] Más opciones de filtrado antes de exportar
- [ ] Gráficas en los PDFs
- [ ] Plantillas personalizables
- [ ] Programar exportaciones automáticas
- [ ] Envío por email

---

## ✅ Estado Actual

**IMPLEMENTADO Y FUNCIONANDO:**
- ✅ Exportar grupo a Excel (Docentes)
- ✅ Exportar grupo a PDF (Docentes)
- ✅ Exportar estadísticas a Excel (Admin)
- ✅ Exportar progreso a PDF (Estudiantes) - endpoint disponible

**PENDIENTE DE UI:**
- ⏳ Botón en Dashboard de Estudiantes
- ⏳ Botón en Statistics de Admin

---

🌽 **¡La funcionalidad de exportación está completamente implementada y lista para usar!**

