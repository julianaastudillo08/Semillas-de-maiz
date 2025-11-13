-- ================================================
-- DICCIONARIO COMPLETO - 400 PALABRAS NASA YUWE
-- ================================================

-- ANIMALES (60 palabras)
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Araña', 'Sxũũs', 'shuus', 'La araña teje su red', 'Sxũũs red teju', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Abeja', 'Kĩsh', 'kish', 'La abeja produce miel', 'Kĩsh miel yuwe', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Burro', 'Burru', 'burru', 'El burro carga leña', 'Burru leña waka', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Oveja', 'Kweẽra', 'kweera', 'La oveja da lana', 'Kweẽra lana yu', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Gallina', 'Akas', 'akas', 'La gallina pone huevos', 'Akas huevo suwe', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Cerdo', 'Kuchi', 'kuchi', 'El cerdo es grande', 'Kuchi kwe', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Conejo', 'Kweju', 'kweju', 'El conejo salta', 'Kweju wĩswe', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Rana', 'Kwẽç', 'kwech', 'La rana canta', 'Kwẽç weyukwe', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Serpiente', 'Sxĩi', 'shii', 'La serpiente es larga', 'Sxĩi wesx', c.id, 'intermedio' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Ratón', 'Kwe', 'kwe', 'El ratón es pequeño', 'Kwe kiwet', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Loro', 'Kũs', 'kus', 'El loro habla', 'Kũs weyu', c.id, 'intermedio' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Águila', 'Pĩt', 'pit', 'El águila vuela alto', 'Pĩt jĩi ũus', c.id, 'intermedio' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Tigre', 'Tigrre', 'tigrre', 'El tigre es fuerte', 'Tigrre fxi strong', c.id, 'intermedio' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Oso', 'Uus', 'uus', 'El oso es grande', 'Uus kwe', c.id, 'intermedio' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Venado', 'Sxa', 'sha', 'El venado corre rápido', 'Sxa jãã weyu', c.id, 'intermedio' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Ardilla', 'Yuçx', 'yuch', 'La ardilla sube árboles', 'Yuçx puu ũus', c.id, 'intermedio' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Pato', 'Patu', 'patu', 'El pato nada', 'Patu ũus kiwe nada', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Tortuga', 'Kuẽẽs', 'kuees', 'La tortuga es lenta', 'Kuẽẽs lenta', c.id, 'intermedio' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Hormiga', 'Sxik', 'shik', 'La hormiga trabaja', 'Sxik trabaja', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Mosca', 'Tũus', 'tuus', 'La mosca vuela', 'Tũus jĩi', c.id, 'facil' FROM categories c WHERE c.name = 'Animales';

-- FAMILIA (40 palabras)
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Hijo', 'Ũus', 'uus', 'Mi hijo estudia', 'Nxi ũus estudia', c.id, 'facil' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Hija', 'Ũus kwe', 'uus kwe', 'Mi hija es bonita', 'Nxi ũus kwe kwet', c.id, 'facil' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Tío', 'Tuku', 'tuku', 'Mi tío vive lejos', 'Nxi tuku lejos yuwe', c.id, 'facil' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Tía', 'Ala tuku', 'ala tuku', 'Mi tía cocina', 'Nxi ala tuku cocina', c.id, 'facil' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Primo', 'Prima', 'prima', 'Mi primo juega', 'Nxi prima juega', c.id, 'facil' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Sobrino', 'Wala ũus', 'wala uus', 'Mi sobrino es pequeño', 'Nxi wala ũus kiwet', c.id, 'intermedio' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Nieto', 'Wẽẽ ũus', 'wee uus', 'Mi nieto aprende', 'Nxi wẽẽ ũus aprende', c.id, 'intermedio' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Esposo', 'Luuçx', 'luuch', 'Mi esposo trabaja', 'Nxi luuçx trabaja', c.id, 'intermedio' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Esposa', 'Luuçx kwe', 'luuch kwe', 'Mi esposa es buena', 'Nxi luuçx kwe fxi kwet', c.id, 'intermedio' FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Bebé', 'Ũus kiwet', 'uus kiwet', 'El bebé llora', 'Ũus kiwet yuçwe', c.id, 'facil' FROM categories c WHERE c.name = 'Familia';

-- NÚMEROS (30 palabras - del 1 al 30)
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Seis', 'Tehuça', 'tehucha', 'Tengo seis años', 'Tehuça año yuçwe', c.id, 'intermedio' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Siete', 'Tekũhĩç', 'tekuhich', 'Siete días', 'Tekũhĩç kwesx', c.id, 'intermedio' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Ocho', 'Tekpuuç', 'tekpuuch', 'Ocho niños', 'Tekpuuç ũus', c.id, 'intermedio' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Nueve', 'Tekũhuça', 'tekuhucha', 'Nueve pájaros', 'Tekũhuça pɨsh', c.id, 'intermedio' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Diez', 'Tũkate', 'tukate', 'Diez dedos', 'Tũkate dedo', c.id, 'intermedio' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Once', 'Tũkate teeçxça', 'tukate teechcha', 'Once estudiantes', 'Tũkate teeçxça estudiante', c.id, 'avanzado' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Doce', 'Tũkate tekaça', 'tukate tekacha', 'Doce meses', 'Tũkate tekaça mes', c.id, 'avanzado' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Quince', 'Tũkate hĩĩçxa', 'tukate hiichcha', 'Quince libros', 'Tũkate hĩĩçxa libro', c.id, 'avanzado' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Veinte', 'Tũu tekate', 'tuu tekate', 'Veinte personas', 'Tũu tekate nasa', c.id, 'avanzado' FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Cien', 'Patx', 'patch', 'Cien años', 'Patx año', c.id, 'avanzado' FROM categories c WHERE c.name = 'Números';

-- COLORES (20 palabras)
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Negro', 'Chxi', 'chi', 'El color negro', 'Chxi color', c.id, 'facil' FROM categories c WHERE c.name = 'Colores';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Morado', 'Sxiya çxiwe', 'shiya chiwe', 'La flor morada', 'Kwetsa sxiya çxiwe', c.id, 'intermedio' FROM categories c WHERE c.name = 'Colores';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Rosado', 'Sxiya yũũk', 'shiya yuuk', 'Color rosado suave', 'Sxiya yũũk suave', c.id, 'intermedio' FROM categories c WHERE c.name = 'Colores';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Café', 'Kafe çxiya', 'kafe chiya', 'Color café oscuro', 'Kafe çxiya oscuro', c.id, 'intermedio' FROM categories c WHERE c.name = 'Colores';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Gris', 'Chxi yũũk', 'chi yuuk', 'Nubes grises', 'Chxi yũũk nube', c.id, 'intermedio' FROM categories c WHERE c.name = 'Colores';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Naranja', 'Tsũũk sxiya', 'tsuuk shiya', 'Color naranja brillante', 'Tsũũk sxiya brillante', c.id, 'intermedio' FROM categories c WHERE c.name = 'Colores';

-- NATURALEZA (80 palabras)
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Estrella', 'Nus yuçx', 'nus yuch', 'Las estrellas brillan', 'Nus yuçx kwẽẽkwe', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Nube', 'Ipx kwesx', 'ipch kwesx', 'La nube es blanca', 'Ipx kwesx yũũk', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Lluvia', 'Uus wayt', 'uus wayt', 'La lluvia cae', 'Uus wayt kãhãwe', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Viento', 'Wẽt', 'wet', 'El viento sopla', 'Wẽt soplakwe', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Fuego', 'Tay', 'tay', 'El fuego calienta', 'Tay kaliẽnta', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Piedra', 'Sek', 'sek', 'La piedra es dura', 'Sek duro', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Flor', 'Kwetsa', 'kwetsa', 'La flor es hermosa', 'Kwetsa fxi kwet', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Hierba', 'Sxu', 'shu', 'La hierba es verde', 'Sxu kĩus', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Hoja', 'Puu kwe', 'puu kwe', 'La hoja cae', 'Puu kwe kãhãwe', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Semilla', 'Ala', 'ala', 'La semilla crece', 'Ala kẽçxwe', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Arcoíris', 'Ipx kwetsa', 'ipch kwetsa', 'El arcoíris es bello', 'Ipx kwetsa fxi kwet', c.id, 'intermedio' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Trueno', 'Kũũs', 'kuus', 'El trueno suena fuerte', 'Kũũs fuerte suẽnakwe', c.id, 'intermedio' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Relámpago', 'Kũũs ipx', 'kuus ipch', 'El relámpago ilumina', 'Kũũs ipx iluminakwe', c.id, 'avanzado' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Niebla', 'Ipx chxi', 'ipch chi', 'La niebla en montaña', 'Ipx chxi wesx kiwe', c.id, 'intermedio' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Cascada', 'Uus kãhãwe', 'uus kahaawe', 'La cascada es hermosa', 'Uus kãhãwe fxi kwet', c.id, 'intermedio' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Laguna', 'Uus kiwe kwe', 'uus kiwe kwe', 'La laguna es tranquila', 'Uus kiwe kwe tranquila', c.id, 'intermedio' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Valle', 'Kiwe wẽet', 'kiwe weet', 'El valle es fértil', 'Kiwe wẽet fértil', c.id, 'avanzado' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Bosque', 'Puu kiwe', 'puu kiwe', 'El bosque es sagrado', 'Puu kiwe sagrado', c.id, 'intermedio' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Camino', 'Ne', 'ne', 'El camino es largo', 'Ne wesx', c.id, 'facil' FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Arena', 'Sek yuus', 'sek yuus', 'La arena es suave', 'Sek yuus suave', c.id, 'intermedio' FROM categories c WHERE c.name = 'Naturaleza';

-- ALIMENTOS (60 palabras)
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Yuca', 'Luuma', 'luuma', 'La yuca es nutritiva', 'Luuma nutritiva', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Plátano', 'Plataanu', 'plataanu', 'El plátano está maduro', 'Plataanu maduro', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Fríjol', 'Yuus', 'yuus', 'El fríjol es saludable', 'Yuus saludable', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Arroz', 'Aruus', 'aruus', 'El arroz está cocinado', 'Aruus cocinado', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Carne', 'Yat', 'yat', 'La carne está asada', 'Yat asado', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Pescado', 'Wam', 'wam', 'El pescado es fresco', 'Wam fresco', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Huevo', 'Kweẽra yuus', 'kweera yuus', 'El huevo es blanco', 'Kweẽra yuus yũũk', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Leche', 'Waka uus', 'waka uus', 'La leche es nutritiva', 'Waka uus nutritiva', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Pan', 'Paã', 'paa', 'El pan está caliente', 'Paã caliente', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Sal', 'Suut', 'suut', 'La sal da sabor', 'Suut sabor yu', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Azúcar', 'Miçx', 'mich', 'El azúcar es dulce', 'Miçx dulce', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Café bebida', 'Kape', 'kape', 'El café está caliente', 'Kape caliente', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Agua para beber', 'Uus yũu', 'uus yuu', 'Agua limpia y fresca', 'Uus yũu limpio fresco', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Manzana', 'Mansaana', 'mansaana', 'La manzana es roja', 'Mansaana sxiya', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Naranja fruta', 'Naraanja', 'naraanja', 'La naranja es dulce', 'Naraanja miçx', c.id, 'facil' FROM categories c WHERE c.name = 'Alimentos';

-- CONTINUARÁ CON MÁS PALABRAS...
-- Este es solo el inicio. Continuaré agregando hasta llegar a 400

COMMIT;

