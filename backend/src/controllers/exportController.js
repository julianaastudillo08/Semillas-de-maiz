import pool from '../config/database.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Exportar reporte de grupo a Excel
 */
export const exportGroupToExcel = async (req, res, next) => {
  try {
    console.log('📗 Exportando grupo a Excel...');
    const { groupId } = req.params;
    const teacherId = req.user.id;
    
    console.log('   GroupId:', groupId);
    console.log('   TeacherId:', teacherId);

    // Verificar que el grupo pertenece al docente
    const groupResult = await pool.query(
      'SELECT * FROM groups WHERE id = $1 AND teacher_id = $2',
      [groupId, teacherId]
    );

    if (groupResult.rows.length === 0) {
      console.log('❌ Grupo no encontrado');
      throw new AppError('Grupo no encontrado', 404);
    }

    const group = groupResult.rows[0];
    console.log('✅ Grupo encontrado:', group.name);

    // Obtener estudiantes y su progreso
    const studentsResult = await pool.query(
      `SELECT 
        u.full_name,
        u.email,
        COALESCE(pt.total_activities_completed, 0) as actividades_completadas,
        COALESCE(pt.average_score, 0) as promedio,
        COALESCE(pt.words_learned, 0) as palabras_aprendidas,
        pt.last_activity_date
       FROM group_students gs
       INNER JOIN users u ON gs.student_id = u.id
       LEFT JOIN progress_tracking pt ON u.id = pt.student_id
       WHERE gs.group_id = $1
       ORDER BY u.full_name`,
      [groupId]
    );

    // Crear workbook de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Grupo');

    // Configurar columnas
    worksheet.columns = [
      { header: 'Nombre Completo', key: 'full_name', width: 30 },
      { header: 'Correo', key: 'email', width: 30 },
      { header: 'Actividades Completadas', key: 'actividades_completadas', width: 25 },
      { header: 'Promedio', key: 'promedio', width: 15 },
      { header: 'Palabras Aprendidas', key: 'palabras_aprendidas', width: 20 },
      { header: 'Última Actividad', key: 'last_activity_date', width: 20 }
    ];

    // Agregar título
    worksheet.insertRow(1, [`Reporte del Grupo: ${group.name}`]);
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Agregar espacio
    worksheet.insertRow(2, []);

    // El header ahora estará en la fila 3
    const headerRow = worksheet.getRow(3);
    headerRow.values = ['Nombre Completo', 'Correo', 'Actividades Completadas', 'Promedio', 'Palabras Aprendidas', 'Última Actividad'];
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }
    };

    // Agregar datos
    studentsResult.rows.forEach(student => {
      worksheet.addRow({
        full_name: student.full_name,
        email: student.email,
        actividades_completadas: student.actividades_completadas,
        promedio: parseFloat(student.promedio).toFixed(2),
        palabras_aprendidas: student.palabras_aprendidas,
        last_activity_date: student.last_activity_date 
          ? new Date(student.last_activity_date).toLocaleDateString('es-CO')
          : 'N/A'
      });
    });

    // Configurar respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte_${group.name}_${Date.now()}.xlsx`
    );

    console.log('📝 Escribiendo Excel...');
    await workbook.xlsx.write(res);
    res.end();
    console.log('✅ Excel generado correctamente');

  } catch (error) {
    console.error('❌ Error en exportGroupToExcel:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
};

/**
 * Exportar reporte de grupo a PDF
 */
export const exportGroupToPDF = async (req, res, next) => {
  try {
    console.log('📕 Exportando grupo a PDF...');
    const { groupId } = req.params;
    const teacherId = req.user.id;
    
    console.log('   GroupId:', groupId);
    console.log('   TeacherId:', teacherId);

    // Verificar que el grupo pertenece al docente
    const groupResult = await pool.query(
      'SELECT * FROM groups WHERE id = $1 AND teacher_id = $2',
      [groupId, teacherId]
    );

    if (groupResult.rows.length === 0) {
      console.log('❌ Grupo no encontrado');
      throw new AppError('Grupo no encontrado', 404);
    }

    const group = groupResult.rows[0];
    console.log('✅ Grupo encontrado:', group.name);

    // Obtener estudiantes y su progreso
    const studentsResult = await pool.query(
      `SELECT 
        u.full_name,
        u.email,
        COALESCE(pt.total_activities_completed, 0) as actividades_completadas,
        COALESCE(pt.average_score, 0) as promedio,
        COALESCE(pt.words_learned, 0) as palabras_aprendidas,
        pt.last_activity_date
       FROM group_students gs
       INNER JOIN users u ON gs.student_id = u.id
       LEFT JOIN progress_tracking pt ON u.id = pt.student_id
       WHERE gs.group_id = $1
       ORDER BY u.full_name`,
      [groupId]
    );

    // Crear documento PDF
    const doc = new PDFDocument({ margin: 50 });

    // Configurar respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte_${group.name}_${Date.now()}.pdf`
    );

    doc.pipe(res);

    // Título
    doc.fontSize(20).text(`Reporte del Grupo: ${group.name}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Nivel: ${group.education_level}`, { align: 'center' });
    if (group.grade) {
      doc.text(`Grado: ${group.grade}`, { align: 'center' });
    }
    doc.moveDown(2);

    // Encabezados de tabla
    const tableTop = doc.y;
    const colWidths = [150, 80, 80, 100];
    const colPositions = [50, 200, 280, 360];

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Nombre', colPositions[0], tableTop);
    doc.text('Actividades', colPositions[1], tableTop);
    doc.text('Promedio', colPositions[2], tableTop);
    doc.text('Última Actividad', colPositions[3], tableTop);

    doc.moveDown();
    doc.font('Helvetica');

    // Línea separadora
    doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();
    doc.moveDown(0.5);

    // Datos de estudiantes
    studentsResult.rows.forEach((student, index) => {
      const y = doc.y;

      // Verificar si necesitamos nueva página
      if (y > 700) {
        doc.addPage();
        doc.y = 50;
      }

      doc.fontSize(9);
      doc.text(student.full_name.substring(0, 25), colPositions[0], doc.y, { width: 140 });
      doc.text(student.actividades_completadas.toString(), colPositions[1], y);
      doc.text(parseFloat(student.promedio).toFixed(1), colPositions[2], y);
      doc.text(
        student.last_activity_date 
          ? new Date(student.last_activity_date).toLocaleDateString('es-CO')
          : 'N/A',
        colPositions[3],
        y,
        { width: 100 }
      );

      doc.moveDown();
    });

    // Pie de página
    doc.moveDown(2);
    doc.fontSize(8).text(
      `Generado el ${new Date().toLocaleString('es-CO')}`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    console.log('📝 Finalizando PDF...');
    doc.end();
    console.log('✅ PDF generado correctamente');

  } catch (error) {
    console.error('❌ Error en exportGroupToPDF:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
};

/**
 * Exportar estadísticas generales a Excel (Admin)
 */
export const exportStatisticsToExcel = async (req, res, next) => {
  try {
    // Obtener estadísticas generales
    const usersStats = await pool.query(`
      SELECT role, COUNT(*) as total,
             SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as activos
      FROM users
      GROUP BY role
    `);

    const wordsStats = await pool.query('SELECT COUNT(*) as total FROM words');
    const activitiesStats = await pool.query('SELECT COUNT(*) as total FROM activities WHERE is_active = true');
    const attemptsStats = await pool.query('SELECT COUNT(*) as total FROM activity_attempts WHERE completed = true');

    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    
    // Hoja 1: Usuarios
    const usersSheet = workbook.addWorksheet('Usuarios');
    usersSheet.columns = [
      { header: 'Rol', key: 'role', width: 20 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Activos', key: 'activos', width: 15 }
    ];
    
    usersSheet.getRow(1).font = { bold: true };
    usersSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }
    };

    usersStats.rows.forEach(row => {
      usersSheet.addRow({
        role: row.role,
        total: row.total,
        activos: row.activos
      });
    });

    // Hoja 2: Contenido
    const contentSheet = workbook.addWorksheet('Contenido');
    contentSheet.addRow(['Métrica', 'Total']);
    contentSheet.getRow(1).font = { bold: true };
    contentSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }
    };
    
    contentSheet.addRow(['Palabras en Diccionario', wordsStats.rows[0].total]);
    contentSheet.addRow(['Actividades Activas', activitiesStats.rows[0].total]);
    contentSheet.addRow(['Intentos Completados', attemptsStats.rows[0].total]);

    contentSheet.columns = [
      { width: 30 },
      { width: 15 }
    ];

    // Configurar respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=estadisticas_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    next(error);
  }
};

/**
 * Exportar progreso individual de estudiante a PDF
 */
export const exportStudentProgressToPDF = async (req, res, next) => {
  try {
    const studentId = req.user.role === 'estudiante' ? req.user.id : req.params.studentId;

    // Obtener información del estudiante
    const studentResult = await pool.query(
      'SELECT full_name, email FROM users WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      throw new AppError('Estudiante no encontrado', 404);
    }

    const student = studentResult.rows[0];

    // Obtener progreso
    const progressResult = await pool.query(
      'SELECT * FROM progress_tracking WHERE student_id = $1',
      [studentId]
    );

    const progress = progressResult.rows[0] || {
      total_activities_completed: 0,
      average_score: 0,
      words_learned: 0
    };

    // Obtener últimos intentos
    const attemptsResult = await pool.query(
      `SELECT aa.*, a.title, a.type, a.difficulty_level
       FROM activity_attempts aa
       INNER JOIN activities a ON aa.activity_id = a.id
       WHERE aa.student_id = $1 AND aa.completed = true
       ORDER BY aa.completed_at DESC
       LIMIT 10`,
      [studentId]
    );

    // Crear PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=progreso_${student.full_name.replace(/\s/g, '_')}_${Date.now()}.pdf`
    );

    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('Reporte de Progreso Individual', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Estudiante: ${student.full_name}`, { align: 'center' });
    doc.fontSize(10).text(`Correo: ${student.email}`, { align: 'center' });
    doc.moveDown(2);

    // Estadísticas generales
    doc.fontSize(14).font('Helvetica-Bold').text('Estadísticas Generales');
    doc.moveDown();
    doc.fontSize(11).font('Helvetica');
    doc.text(`Actividades Completadas: ${progress.total_activities_completed}`);
    doc.text(`Promedio General: ${parseFloat(progress.average_score).toFixed(2)}`);
    doc.text(`Palabras Aprendidas: ${progress.words_learned}`);
    doc.moveDown(2);

    // Últimos intentos
    if (attemptsResult.rows.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Últimas Actividades');
      doc.moveDown();

      attemptsResult.rows.forEach((attempt, index) => {
        if (doc.y > 650) {
          doc.addPage();
        }

        doc.fontSize(10).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${attempt.title}`);
        doc.font('Helvetica');
        doc.text(`   Puntuación: ${attempt.score}/100`);
        doc.text(`   Dificultad: ${attempt.difficulty_level}`);
        doc.text(`   Fecha: ${new Date(attempt.completed_at).toLocaleString('es-CO')}`);
        doc.moveDown();
      });
    }

    // Pie de página
    doc.fontSize(8).text(
      `Generado el ${new Date().toLocaleString('es-CO')}`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    doc.end();

  } catch (error) {
    next(error);
  }
};

