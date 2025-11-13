-- ================================================
-- Agregar columnas para audios en español y Nasa Yuwe
-- ================================================

-- Renombrar audio_url a audio_spanish si existe
ALTER TABLE words 
  RENAME COLUMN audio_url TO audio_spanish;

-- Agregar columna para audio en Nasa Yuwe
ALTER TABLE words 
  ADD COLUMN IF NOT EXISTS audio_nasa_yuwe VARCHAR(500);

-- Comentarios
COMMENT ON COLUMN words.audio_spanish IS 'URL del audio de pronunciación en español';
COMMENT ON COLUMN words.audio_nasa_yuwe IS 'URL del audio de pronunciación en Nasa Yuwe';

-- Verificar cambios
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'words' 
  AND column_name LIKE 'audio%'
ORDER BY column_name;

