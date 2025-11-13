# 🔊 GUÍA PARA AGREGAR AUDIOS EN NASA YUWE

## ✅ Lo que YA está hecho:

- ✅ **388 audios en ESPAÑOL** generados automáticamente
- ✅ Botones de audio funcionales en el diccionario
- ✅ Sistema de reproducción con un clic
- ✅ API preparada para subir audios en Nasa Yuwe

---

## 📝 Audios en Nasa Yuwe - Opciones

### Opción 1: Grabar con Hablantes Nativos (RECOMENDADO) ⭐

**¿Por qué?** Es la forma más auténtica y educativa.

**Pasos:**
1. Contacta hablantes nativos de la comunidad Nasa
2. Pídeles que graben las 388 palabras
3. Usa una app de grabación:
   - **Audacity** (gratis, Windows/Mac)
   - **Voice Recorder** (Windows nativa)
   - **GarageBand** (Mac)
   - **App de grabación del teléfono**

4. Guarda cada audio con el nombre de la palabra
   - Ejemplo: `nasa_perro.mp3`, `nasa_gato.mp3`

---

### Opción 2: Usar Recursos en Línea Existentes 🌐

**Recursos recomendados:**

1. **Kwe'sx Yuwe** - https://kwesxyuwe.com/vocales.html
   - Tiene audios de vocales
   - Puedes descargar y usar como referencia

2. **SoundCloud - Nasa Yuwe**
   - https://soundcloud.com/user-393594502-72562590
   - Canciones educativas (números, colores, días)

3. **Radioteca** - https://radioteca.net
   - Audios en Nasa Yuwe
   - Puede tener palabras individuales

4. **En Mi Idioma** - https://www.enmiidioma.org/es/cursos/nasa-yuwe
   - Curso completo con recursos multimedia

---

## 📂 Cómo Agregar los Audios al Sistema

### Método 1: Agregar Manualmente (Rápido)

1. **Guarda los audios** en:
   ```
   backend/public/audio/
   ```

2. **Nombra los archivos:**
   ```
   nasa_[palabra].mp3
   ```
   Ejemplos:
   - `nasa_perro.mp3`
   - `nasa_manzana.mp3`
   - `nasa_agua.mp3`

3. **Ejecuta el script de actualización:**
   ```bash
   cd backend
   node src/database/asociar-audios-nasa.js
   ```

---

### Método 2: Subir desde la Aplicación (Futuro)

Ya está preparada la API en:
```
POST /api/admin/words/:wordId/audio
Body: { language: 'nasa_yuwe', audio: [archivo] }
```

Necesitarías crear una interfaz en el frontend para que administradores puedan subir audios.

---

## 🎙️ Consejos para Grabar Audios de Calidad

### Configuración:
- **Formato:** MP3
- **Bitrate:** 128 kbps (buena calidad, tamaño pequeño)
- **Frecuencia:** 44.1 kHz
- **Mono/Estéreo:** Mono es suficiente

### Al Grabar:
1. Usa un **lugar silencioso**
2. Habla **claro y despacio**
3. Mantén una **distancia constante** del micrófono (15-20cm)
4. Graba cada palabra **2 veces** (elige la mejor)
5. Deja **1 segundo de silencio** al inicio y final

---

## 📋 Lista de Palabras para Grabar

Tienes **388 palabras** distribuidas en:

| Categoría | Palabras | Prioridad |
|-----------|----------|-----------|
| Números | 101 | ⭐⭐⭐ Alta |
| Animales | ~90 | ⭐⭐ Media |
| Alimentos | ~80 | ⭐⭐ Media |
| Naturaleza | ~103 | ⭐ Baja |
| Familia | ~30 | ⭐⭐⭐ Alta |
| Colores | 10 | ⭐⭐⭐ Alta |

**Sugerencia:** Empieza por Números, Colores y Familia (141 palabras)

---

## 🛠️ Script para Asociar Audios (Cuando los tengas)

Guarda este script como: `backend/src/database/asociar-audios-nasa.js`

```javascript
import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function asociarAudios() {
  const audioDir = path.join(__dirname, '../../public/audio');
  const archivos = fs.readdirSync(audioDir);
  const audiosNasa = archivos.filter(f => f.startsWith('nasa_') && f.endsWith('.mp3'));

  let actualizados = 0;

  for (const archivo of audiosNasa) {
    // Extraer nombre de la palabra
    const palabra = archivo.replace('nasa_', '').replace('.mp3', '');
    const audioUrl = `/audio/${archivo}`;

    const result = await pool.query(
      'UPDATE words SET audio_nasa_yuwe = $1 WHERE LOWER(spanish_word) = LOWER($2)',
      [audioUrl, palabra]
    );

    if (result.rowCount > 0) {
      console.log(`✅ ${palabra} → ${archivo}`);
      actualizados++;
    }
  }

  console.log(`\n✅ Total audios asociados: ${actualizados}`);
  process.exit(0);
}

asociarAudios();
```

---

## 📞 Contactos Útiles

**Instituciones que pueden ayudar:**

1. **CRIC** (Consejo Regional Indígena del Cauca)
   - Trabajan con preservación del Nasa Yuwe
   - Pueden tener material educativo

2. **Universidades con programas de lenguas indígenas:**
   - Universidad del Cauca
   - Universidad Nacional

3. **Comunidades Nasa:**
   - Contactar cabildos indígenas
   - Maestros de lengua Nasa Yuwe

---

## ✅ Estado Actual del Sistema

**Español:**
- ✅ 388 audios generados automáticamente
- ✅ Funcionando en la aplicación

**Nasa Yuwe:**
- ⏳ Pendiente de grabar
- ✅ Sistema listo para recibirlos
- ✅ API preparada

---

## 🎯 Recomendación Final

**Para empezar rápido:**
1. Graba solo las **palabras más usadas** (50-100)
2. Enfócate en: Números (0-20), Colores, Familia
3. Agrega más audios gradualmente

**Esto permitirá:**
- Tener contenido útil desde ya
- No abrumar a los grabadores
- Ir mejorando con el tiempo

---

**¿Necesitas ayuda con la grabación o subida de audios?**
Contacta al equipo de desarrollo o revisa la documentación técnica.

---

📅 Última actualización: Noviembre 2025
🌽 Proyecto: Semillas de Maíz - Nasa Yuwe

