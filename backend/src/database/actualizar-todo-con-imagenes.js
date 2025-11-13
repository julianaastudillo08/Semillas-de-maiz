import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para actualizar el diccionario y las actividades con las imágenes
 * que están en la carpeta backend/public/images
 */

async function actualizarTodoConImagenes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🌽 ACTUALIZAR DICCIONARIO Y ACTIVIDADES CON IMÁGENES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const imagenesDir = path.join(__dirname, '../../public/images');
  
  // Mapeo extenso de imágenes a palabras en español y Nasa Yuwe
  const mapeoImagenes = {
    // ANIMALES
    'perro.png': { spanish: 'Perro', nasa: "Pʉʉs", category: 'Animales' },
    'gato.png': { spanish: 'Gato', nasa: "Mishi", category: 'Animales' },
    'gallina.png': { spanish: 'Gallina', nasa: "Akas", category: 'Animales' },
    'venado.jpg': { spanish: 'Venado', nasa: "Sxa", category: 'Animales' },
    'serpiente.png': { spanish: 'Serpiente', nasa: "Sxĩi", category: 'Animales' },
    'hormiga.png': { spanish: 'Hormiga', nasa: "Sxik", category: 'Animales' },
    'cucaracha.png': { spanish: 'Cucaracha', nasa: "Kuspe", category: 'Animales' },
    'luciernaga.jpg': { spanish: 'Luciérnaga', nasa: "Kũ'çx", category: 'Animales' },
    'abeja.png': { spanish: 'Abeja', nasa: "Kĩsh", category: 'Animales' },
    'burro.png': { spanish: 'Burro', nasa: "Burru", category: 'Animales' },
    'oveja.png': { spanish: 'Oveja', nasa: "Kweẽra", category: 'Animales' },
    'cerdo.png': { spanish: 'Cerdo', nasa: "Kuchi", category: 'Animales' },
    'conejo.png': { spanish: 'Conejo', nasa: "Kweju", category: 'Animales' },
    'rana.png': { spanish: 'Rana', nasa: "Kwẽç", category: 'Animales' },
    'raton.png': { spanish: 'Ratón', nasa: "Kwe", category: 'Animales' },
    'loro.png': { spanish: 'Loro', nasa: "Kũs", category: 'Animales' },
    'aguila.png': { spanish: 'Águila', nasa: "Pĩt", category: 'Animales' },
    'tigre.png': { spanish: 'Tigre', nasa: "Tigrre", category: 'Animales' },
    'oso.png': { spanish: 'Oso', nasa: "Uus", category: 'Animales' },
    'ardilla.png': { spanish: 'Ardilla', nasa: "Yuçx", category: 'Animales' },
    'pato.png': { spanish: 'Pato', nasa: "Patu", category: 'Animales' },
    'tortuga.png': { spanish: 'Tortuga', nasa: "Kuẽẽs", category: 'Animales' },
    'mosca.png': { spanish: 'Mosca', nasa: "Tũus", category: 'Animales' },
    'vaca.jpg': { spanish: 'Vaca', nasa: "Waka", category: 'Animales' },
    'caballo.jpg': { spanish: 'Caballo', nasa: "Kawalyu", category: 'Animales' },
    'cabra.png': { spanish: 'Cabra', nasa: "Chiba", category: 'Animales' },
    'gallo.png': { spanish: 'Gallo', nasa: "Atɨm", category: 'Animales' },
    'pollo.png': { spanish: 'Pollo', nasa: "Pyu", category: 'Animales' },
    'pavo.png': { spanish: 'Pavo', nasa: "Pispu", category: 'Animales' },
    'pato.png': { spanish: 'Pato', nasa: "Patu", category: 'Animales' },
    'ganso.png': { spanish: 'Ganso', nasa: "Gansu", category: 'Animales' },
    'paloma.png': { spanish: 'Paloma', nasa: "Paluma", category: 'Animales' },
    'buho.png': { spanish: 'Búho', nasa: "Tɨtɨ", category: 'Animales' },
    'tucan.png': { spanish: 'Tucán', nasa: "Dɨɨs", category: 'Animales' },
    'gaviota.png': { spanish: 'Gaviota', nasa: "Gawyuta", category: 'Animales' },
    'cuervo.png': { spanish: 'Cuervo', nasa: "Wãã", category: 'Animales' },
    'canario.png': { spanish: 'Canario', nasa: "Kanaryu", category: 'Animales' },
    'avestruz.png': { spanish: 'Avestruz', nasa: "Awetrus", category: 'Animales' },
    'cocodrilo.png': { spanish: 'Cocodrilo', nasa: "Babɨlla", category: 'Animales' },
    'lagarto.png': { spanish: 'Lagarto', nasa: "Sxii wala", category: 'Animales' },
    'iguana.png': { spanish: 'Iguana', nasa: "Iwana", category: 'Animales' },
    'sapo.png': { spanish: 'Sapo', nasa: "Kwẽç kwe", category: 'Animales' },
    'salamandra.png': { spanish: 'Salamandra', nasa: "Kwẽç dxika", category: 'Animales' },
    'mariposa.png': { spanish: 'Mariposa', nasa: "Pulu", category: 'Animales' },
    'escarabajo.png': { spanish: 'Escarabajo', nasa: "Sxũũ", category: 'Animales' },
    'grillo.png': { spanish: 'Grillo', nasa: "Txitxi", category: 'Animales' },
    'cigarra.png': { spanish: 'Cigarra', nasa: "Txɨtxɨ kwe", category: 'Animales' },
    'saltamonte.png': { spanish: 'Saltamontes', nasa: "Saltamunte", category: 'Animales' },
    'mosquito.png': { spanish: 'Mosquito', nasa: "Muskitu", category: 'Animales' },
    'avispa.png': { spanish: 'Avispa', nasa: "Wispa", category: 'Animales' },
    'libelula.png': { spanish: 'Libélula', nasa: "Pĩpĩ", category: 'Animales' },
    'caracol.png': { spanish: 'Caracol', nasa: "Karaku", category: 'Animales' },
    'leon.png': { spanish: 'León', nasa: "Leun", category: 'Animales' },
    'elefante.png': { spanish: 'Elefante', nasa: "Elefante", category: 'Animales' },
    'jirafa.png': { spanish: 'Jirafa', nasa: "Xirafa", category: 'Animales' },
    'cebra.png': { spanish: 'Cebra', nasa: "Sebra", category: 'Animales' },
    'mono.png': { spanish: 'Mono', nasa: "Manu", category: 'Animales' },
    'gorila.png': { spanish: 'Gorila', nasa: "Gurila", category: 'Animales' },
    'puma.png': { spanish: 'Puma', nasa: "Puma", category: 'Animales' },
    'jaguar.png': { spanish: 'Jaguar', nasa: "Yagwar", category: 'Animales' },
    'zorro.png': { spanish: 'Zorro', nasa: "Surru", category: 'Animales' },
    'lobo.png': { spanish: 'Lobo', nasa: "Lubu", category: 'Animales' },
    'oso.png': { spanish: 'Oso', nasa: "Usu", category: 'Animales' },
    'canguro.png': { spanish: 'Canguro', nasa: "Kanguru", category: 'Animales' },
    'camello.png': { spanish: 'Camello', nasa: "Kamelyu", category: 'Animales' },
    'liebre.png': { spanish: 'Liebre', nasa: "Kweju kwe", category: 'Animales' },
    'armadillo.png': { spanish: 'Armadillo', nasa: "Armadɨlyu", category: 'Animales' },
    'mapache.png': { spanish: 'Mapache', nasa: "Mapache", category: 'Animales' },
    'murcielago.png': { spanish: 'Murciélago', nasa: "Txutxu", category: 'Animales' },
    'pereza.png': { spanish: 'Perezoso', nasa: "Peresu", category: 'Animales' },
    'tapir.png': { spanish: 'Tapir', nasa: "Danta", category: 'Animales' },
    'delfin.png': { spanish: 'Delfín', nasa: "Delfin", category: 'Animales' },
    'ballena.png': { spanish: 'Ballena', nasa: "Wayena", category: 'Animales' },
    'tiburon.png': { spanish: 'Tiburón', nasa: "Tiwurun", category: 'Animales' },
    'pulpo.png': { spanish: 'Pulpo', nasa: "Pulpu", category: 'Animales' },
    'calamar.png': { spanish: 'Calamar', nasa: "Kalama", category: 'Animales' },
    'medusa.png': { spanish: 'Medusa', nasa: "Medusa", category: 'Animales' },
    'estrella_de_mar.png': { spanish: 'Estrella de mar', nasa: "Estreya ũus", category: 'Animales' },
    'cangrejo.png': { spanish: 'Cangrejo', nasa: "Kangreju", category: 'Animales' },
    'camaron.png': { spanish: 'Camarón', nasa: "Kamarun", category: 'Animales' },
    'langosta.png': { spanish: 'Langosta', nasa: "Langusta", category: 'Animales' },
    'mejillon.png': { spanish: 'Mejillón', nasa: "Mexiyun", category: 'Animales' },
    'ostra.png': { spanish: 'Ostra', nasa: "Ustra", category: 'Animales' },
    'caballito_de_mar.png': { spanish: 'Caballito de mar', nasa: "Kawalyu ũus", category: 'Animales' },

    // ALIMENTOS / FRUTAS
    'manzana.png': { spanish: 'Manzana', nasa: "Mansana", category: 'Alimentos' },
    'banana.png': { spanish: 'Banana', nasa: "Platanu", category: 'Alimentos' },
    'banano.png': { spanish: 'Banano', nasa: "Platanu", category: 'Alimentos' },
    'naranja.png': { spanish: 'Naranja', nasa: "Naranxa", category: 'Alimentos' },
    'fresa.png': { spanish: 'Fresa', nasa: "Fresa", category: 'Alimentos' },
    'uva.png': { spanish: 'Uva', nasa: "Uwa", category: 'Alimentos' },
    'pina.png': { spanish: 'Piña', nasa: "Pinya", category: 'Alimentos' },
    'sandia.png': { spanish: 'Sandía', nasa: "Sandiya", category: 'Alimentos' },
    'melon.png': { spanish: 'Melón', nasa: "Melun", category: 'Alimentos' },
    'papaya.png': { spanish: 'Papaya', nasa: "Papaya", category: 'Alimentos' },
    'mango.png': { spanish: 'Mango', nasa: "Mangu", category: 'Alimentos' },
    'guayaba.png': { spanish: 'Guayaba', nasa: "Wayaba", category: 'Alimentos' },
    'maracuya.png': { spanish: 'Maracuyá', nasa: "Marakuya", category: 'Alimentos' },
    'kiwi.png': { spanish: 'Kiwi', nasa: "Kiwi", category: 'Alimentos' },
    'durazno.png': { spanish: 'Durazno', nasa: "Durasnu", category: 'Alimentos' },
    'cereza.png': { spanish: 'Cereza', nasa: "Seresa", category: 'Alimentos' },
    'pera.png': { spanish: 'Pera', nasa: "Pera", category: 'Alimentos' },
    'limon.png': { spanish: 'Limón', nasa: "Limun", category: 'Alimentos' },
    'mandarina.png': { spanish: 'Mandarina', nasa: "Mandarina", category: 'Alimentos' },
    'coco.png': { spanish: 'Coco', nasa: "Kuku", category: 'Alimentos' },
    'mora.png': { spanish: 'Mora', nasa: "Mura", category: 'Alimentos' },

    // VEGETALES
    'tomate.png': { spanish: 'Tomate', nasa: "Tumate", category: 'Alimentos' },
    'papa.png': { spanish: 'Papa', nasa: "Papa", category: 'Alimentos' },
    'yuca.png': { spanish: 'Yuca', nasa: "Yuka", category: 'Alimentos' },
    'zanahoria.png': { spanish: 'Zanahoria', nasa: "Sanaorya", category: 'Alimentos' },
    'cebolla.png': { spanish: 'Cebolla', nasa: "Seboya", category: 'Alimentos' },
    'ajo.png': { spanish: 'Ajo', nasa: "Axu", category: 'Alimentos' },
    'lechuga.png': { spanish: 'Lechuga', nasa: "Lechuga", category: 'Alimentos' },
    'repollo.png': { spanish: 'Repollo', nasa: "Repolyu", category: 'Alimentos' },
    'brocoli.png': { spanish: 'Brócoli', nasa: "Brokoli", category: 'Alimentos' },
    'coliflor.png': { spanish: 'Coliflor', nasa: "Koliflo", category: 'Alimentos' },
    'espinaca.png': { spanish: 'Espinaca', nasa: "Espinaka", category: 'Alimentos' },
    'apio.png': { spanish: 'Apio', nasa: "Apiyu", category: 'Alimentos' },
    'pepino.png': { spanish: 'Pepino', nasa: "Pepinu", category: 'Alimentos' },
    'berenjena.png': { spanish: 'Berenjena', nasa: "Bereñena", category: 'Alimentos' },
    'calabacin.png': { spanish: 'Calabacín', nasa: "Kalabasin", category: 'Alimentos' },
    'pimenton.png': { spanish: 'Pimentón', nasa: "Pimentun", category: 'Alimentos' },
    'remolacha.png': { spanish: 'Remolacha', nasa: "Remolacha", category: 'Alimentos' },

    // GRANOS Y CEREALES
    'maiz.png': { spanish: 'Maíz', nasa: "Ats", category: 'Alimentos' },
    'frijol.png': { spanish: 'Fríjol', nasa: "Frisol", category: 'Alimentos' },
    'arroz.png': { spanish: 'Arroz', nasa: "Arrus", category: 'Alimentos' },
    'trigo.png': { spanish: 'Trigo', nasa: "Trigu", category: 'Alimentos' },
    'avena.png': { spanish: 'Avena', nasa: "Awena", category: 'Alimentos' },
    'lentejas.png': { spanish: 'Lentejas', nasa: "Lentexas", category: 'Alimentos' },
    'garbanzos.png': { spanish: 'Garbanzos', nasa: "Garbansus", category: 'Alimentos' },
    'arvejas.png': { spanish: 'Arvejas', nasa: "Arvexas", category: 'Alimentos' },
    'soja.png': { spanish: 'Soja', nasa: "Suxa", category: 'Alimentos' },
    'habichuelas.png': { spanish: 'Habichuelas', nasa: "Abichuelas", category: 'Alimentos' },

    // CARNES Y PROTEÍNAS
    'pescado.png': { spanish: 'Pescado', nasa: "Neẽ", category: 'Alimentos' },
    'pollo.png': { spanish: 'Pollo', nasa: "Pyu", category: 'Alimentos' },
    'res.png': { spanish: 'Res', nasa: "Waka", category: 'Alimentos' },
    'cerdo.png': { spanish: 'Cerdo', nasa: "Kuchi", category: 'Alimentos' },
    'huevo.png': { spanish: 'Huevo', nasa: "Lulu", category: 'Alimentos' },
    'salmon.png': { spanish: 'Salmón', nasa: "Salmun", category: 'Alimentos' },
    'atun.png': { spanish: 'Atún', nasa: "Atun", category: 'Alimentos' },
    'sardina.png': { spanish: 'Sardina', nasa: "Sardina", category: 'Alimentos' },
    'bagre.png': { spanish: 'Bagre', nasa: "Bagre", category: 'Alimentos' },
    'trucha.png': { spanish: 'Trucha', nasa: "Trucha", category: 'Alimentos' },
    'jamon.png': { spanish: 'Jamón', nasa: "Xamun", category: 'Alimentos' },
    'salchicha.png': { spanish: 'Salchicha', nasa: "Salchicha", category: 'Alimentos' },

    // FAMILIA
    'mama.png': { spanish: 'Madre', nasa: "Mama", category: 'Familia' },
    'padre.png': { spanish: 'Padre', nasa: "Taita", category: 'Familia' },
    'hermana.png': { spanish: 'Hermana', nasa: "Wala", category: 'Familia' },
    'hermanos.png': { spanish: 'Hermanos', nasa: "We'wes", category: 'Familia' },
    'hijo_masculino.png': { spanish: 'Hijo', nasa: "Ũus", category: 'Familia' },
    'hija_fememino.png': { spanish: 'Hija', nasa: "Ũus kwe", category: 'Familia' },
    'hijos.png': { spanish: 'Hijos', nasa: "Ũusxa", category: 'Familia' },
    'abueloMaterno.png': { spanish: 'Abuelo materno', nasa: "Mama sek", category: 'Familia' },
    'abueloPaterno.png': { spanish: 'Abuelo paterno', nasa: "Taita sek", category: 'Familia' },
    'abuela_materna.png': { spanish: 'Abuela materna', nasa: "Mama sek kwe", category: 'Familia' },
    'abuela_paterno.png': { spanish: 'Abuela paterna', nasa: "Taita sek kwe", category: 'Familia' },
    'tioMaterno.png': { spanish: 'Tío materno', nasa: "Mama tuku", category: 'Familia' },
    'tioPaterno.png': { spanish: 'Tío paterno', nasa: "Taita tuku", category: 'Familia' },
    'tiaMaterna.png': { spanish: 'Tía materna', nasa: "Mama ala", category: 'Familia' },
    'tiaPapá.png': { spanish: 'Tía paterna', nasa: "Taita ala", category: 'Familia' },
    'primos.png': { spanish: 'Primos', nasa: "Primas", category: 'Familia' },
    'sobrino.jpg': { spanish: 'Sobrino', nasa: "Wala ũus", category: 'Familia' },
    'Nieto.png': { spanish: 'Nieto', nasa: "Wẽẽ ũus", category: 'Familia' },
    'Nieta.png': { spanish: 'Nieta', nasa: "Wẽẽ ũus kwe", category: 'Familia' },
    'bisNieto.png': { spanish: 'Bisnieto', nasa: "Wẽẽ ũus wala", category: 'Familia' },
    'bisNiet.png': { spanish: 'Bisnieta', nasa: "Wẽẽ ũus kwe wala", category: 'Familia' },
    'bisAbuelo.png': { spanish: 'Bisabuelo', nasa: "Sek wala", category: 'Familia' },
    'bisabuela.png': { spanish: 'Bisabuela', nasa: "Sek kwe wala", category: 'Familia' },
    'esposos.png': { spanish: 'Esposos', nasa: "Luuçxa", category: 'Familia' },
    'novio.png': { spanish: 'Novio', nasa: "Luuçx wala", category: 'Familia' },
    'novia.png': { spanish: 'Novia', nasa: "Luuçx kwe wala", category: 'Familia' },
    'novios.png': { spanish: 'Novios', nasa: "Luuçxa wala", category: 'Familia' },
    'suegro.png': { spanish: 'Suegro', nasa: "Suegru", category: 'Familia' },
    'suegra.png': { spanish: 'Suegra', nasa: "Suegra", category: 'Familia' },
    'companero.jpg': { spanish: 'Compañero', nasa: "Wewes", category: 'Familia' },

    // COLORES
    'rojo.png': { spanish: 'Rojo', nasa: "Sxiya", category: 'Colores' },
    'azul.png': { spanish: 'Azul', nasa: "Çxiwe", category: 'Colores' },
    'amarillo.png': { spanish: 'Amarillo', nasa: "Kĩte", category: 'Colores' },
    'verde.png': { spanish: 'Verde', nasa: "Kĩus", category: 'Colores' },
    'blanco.png': { spanish: 'Blanco', nasa: "Yũũk", category: 'Colores' },
    'negro.png': { spanish: 'Negro', nasa: "Tul", category: 'Colores' },
    'morado.png': { spanish: 'Morado', nasa: "Muradu", category: 'Colores' },
    'rosa.png': { spanish: 'Rosado', nasa: "Ruusa", category: 'Colores' },
    'gris.png': { spanish: 'Gris', nasa: "Gris", category: 'Colores' },
    'marron.png': { spanish: 'Marrón', nasa: "Marrun", category: 'Colores' },

    // NATURALEZA
    'agua.png': { spanish: 'Agua', nasa: "Ũus", category: 'Naturaleza' },
    'sol.jpg': { spanish: 'Sol', nasa: "Sek", category: 'Naturaleza' },
    'luna.jpg': { spanish: 'Luna', nasa: "Nus", category: 'Naturaleza' },
    'estrella.jpg': { spanish: 'Estrella', nasa: "Estreya", category: 'Naturaleza' },
    'arcoiris.png': { spanish: 'Arcoíris', nasa: "Kwẽẽs çxiwe", category: 'Naturaleza' },
    'relampago.jpg': { spanish: 'Relámpago', nasa: "Kũus", category: 'Naturaleza' },
    'lluvia.jpg': { spanish: 'Lluvia', nasa: "Wes", category: 'Naturaleza' },
    'nieve.jpg': { spanish: 'Nieve', nasa: "Niyewe", category: 'Naturaleza' },
    'granizo.jpg': { spanish: 'Granizo', nasa: "Granisu", category: 'Naturaleza' },
    'truenos.jpg': { spanish: 'Trueno', nasa: "Txutx", category: 'Naturaleza' },
    'tormenta.jpg': { spanish: 'Tormenta', nasa: "Turmenta", category: 'Naturaleza' },
    'viento.jpg': { spanish: 'Viento', nasa: "Kẽes", category: 'Naturaleza' },
    'niebla.jpg': { spanish: 'Niebla', nasa: "Piçx", category: 'Naturaleza' },
    'nube.jpg': { spanish: 'Nube', nasa: "Puwes", category: 'Naturaleza' },
    'nubes.JPG': { spanish: 'Nubes', nasa: "Puwes", category: 'Naturaleza' },
    'fuego.jpg': { spanish: 'Fuego', nasa: "Tul", category: 'Naturaleza' },
    'luz.jpg': { spanish: 'Luz', nasa: "Kũu", category: 'Naturaleza' },
    'sombra.jpg': { spanish: 'Sombra', nasa: "Txiwe", category: 'Naturaleza' },
    'tierra.png': { spanish: 'Tierra', nasa: "Kiwe", category: 'Naturaleza' },
    'arena.jpg': { spanish: 'Arena', nasa: "Txipa", category: 'Naturaleza' },
    'piedra.jpg': { spanish: 'Piedra', nasa: "Wala", category: 'Naturaleza' },
    'roca.png': { spanish: 'Roca', nasa: "Wala kwe", category: 'Naturaleza' },
    'rocas.jpg': { spanish: 'Rocas', nasa: "Walaxa", category: 'Naturaleza' },
    'montanas.jpg': { spanish: 'Montaña', nasa: "Kãpi", category: 'Naturaleza' },
    'colina.png': { spanish: 'Colina', nasa: "Kãpi kiwet", category: 'Naturaleza' },
    'valle.jpg': { spanish: 'Valle', nasa: "Wala kiwe", category: 'Naturaleza' },
    'llanura.jpg': { spanish: 'Llanura', nasa: "Txãa", category: 'Naturaleza' },
    'sabana.jpg': { spanish: 'Sabana', nasa: "Sabana", category: 'Naturaleza' },
    'pradera.jpg': { spanish: 'Pradera', nasa: "Pradera", category: 'Naturaleza' },
    'bosque.jpg': { spanish: 'Bosque', nasa: "Tul kiwe", category: 'Naturaleza' },
    'selva.jpg': { spanish: 'Selva', nasa: "Selba", category: 'Naturaleza' },
    'desierto.jpg': { spanish: 'Desierto', nasa: "Desiertu", category: 'Naturaleza' },
    'playa.jpg': { spanish: 'Playa', nasa: "Playa", category: 'Naturaleza' },
    'mar.png': { spanish: 'Mar', nasa: "Atun ũus", category: 'Naturaleza' },
    'oceano.jpg': { spanish: 'Océano', nasa: "Usiyanu", category: 'Naturaleza' },
    'laguna.jpg': { spanish: 'Laguna', nasa: "Laguna", category: 'Naturaleza' },
    'rios.jpg': { spanish: 'Río', nasa: "Wes", category: 'Naturaleza' },
    'cascadas.jpg': { spanish: 'Cascada', nasa: "Wes jĩi", category: 'Naturaleza' },
    'pantano.jpg': { spanish: 'Pantano', nasa: "Pantanu", category: 'Naturaleza' },
    'charco.jpg': { spanish: 'Charco', nasa: "Txarku", category: 'Naturaleza' },
    'isla.png': { spanish: 'Isla', nasa: "Isla", category: 'Naturaleza' },
    'peninsula.jpg': { spanish: 'Península', nasa: "Peninsula", category: 'Naturaleza' },
    'cueva.jpg': { spanish: 'Cueva', nasa: "Kueẽ", category: 'Naturaleza' },
    'volcan.jpg': { spanish: 'Volcán', nasa: "Wulkan", category: 'Naturaleza' },
    'arbol.jpg': { spanish: 'Árbol', nasa: "Tul", category: 'Naturaleza' },
    'planta.jpg': { spanish: 'Planta', nasa: "Yat", category: 'Naturaleza' },
    'plantas.jpg': { spanish: 'Plantas', nasa: "Yatxa", category: 'Naturaleza' },
    'flor.jpg': { spanish: 'Flor', nasa: "Kwetsa", category: 'Naturaleza' },
    'hoja.jpg': { spanish: 'Hoja', nasa: "Wala", category: 'Naturaleza' },
    'raiz.jpg': { spanish: 'Raíz', nasa: "Kus", category: 'Naturaleza' },
    'tronco.jpg': { spanish: 'Tronco', nasa: "Txuçxa", category: 'Naturaleza' },
    'hierba.jpg': { spanish: 'Hierba', nasa: "Pasatu", category: 'Naturaleza' },
    'arbusto.jpg': { spanish: 'Arbusto', nasa: "Arbustu", category: 'Naturaleza' },
    'cactus.jpg': { spanish: 'Cactus', nasa: "Kaktus", category: 'Naturaleza' },
    'palma.jpg': { spanish: 'Palma', nasa: "Palma", category: 'Naturaleza' },
    'pino.jpg': { spanish: 'Pino', nasa: "Pinu", category: 'Naturaleza' },
    'cedro.jpg': { spanish: 'Cedro', nasa: "Sedru", category: 'Naturaleza' },
    'rosa.jpg': { spanish: 'Rosa', nasa: "Ruusa", category: 'Naturaleza' },
    'tulipanes.jpg': { spanish: 'Tulipán', nasa: "Tulipan", category: 'Naturaleza' },
    'girasol.jpg': { spanish: 'Girasol', nasa: "Xirasol", category: 'Naturaleza' },
    'margaritas.jpg': { spanish: 'Margarita', nasa: "Margarita", category: 'Naturaleza' },
    'orquidea.jpg': { spanish: 'Orquídea', nasa: "Urkidiya", category: 'Naturaleza' },
    'lirio.jpg': { spanish: 'Lirio', nasa: "Liriyu", category: 'Naturaleza' },
    'cielo.jpg': { spanish: 'Cielo', nasa: "Ipx", category: 'Naturaleza' },
    'horizonte.jpg': { spanish: 'Horizonte', nasa: "Orisonte", category: 'Naturaleza' },
    'amanecer.jpg': { spanish: 'Amanecer', nasa: "Sek çxiçx", category: 'Naturaleza' },
    'atardecer.jpg': { spanish: 'Atardecer', nasa: "Sek kẽes", category: 'Naturaleza' },
    'aire.jpg': { spanish: 'Aire', nasa: "Kẽes", category: 'Naturaleza' },
    'semillas.jpg': { spanish: 'Semilla', nasa: "Tul wala", category: 'Naturaleza' },
    'fruto.png': { spanish: 'Fruto', nasa: "Frutu", category: 'Naturaleza' },
    'lodo.jpg': { spanish: 'Lodo', nasa: "Ludu", category: 'Naturaleza' },
    'escarcha.jpg': { spanish: 'Escarcha', nasa: "Eskarcha", category: 'Naturaleza' },
    'inundaciones.jpg': { spanish: 'Inundación', nasa: "Inundasiyun", category: 'Naturaleza' },
    'sequia.jpg': { spanish: 'Sequía', nasa: "Sekiya", category: 'Naturaleza' },
    'huracán.jpg': { spanish: 'Huracán', nasa: "Urakan", category: 'Naturaleza' },

    // NÚMEROS (del 0 al 100)
    '0.png': { spanish: 'Cero', nasa: "Seru", category: 'Números' },
    '1.png': { spanish: 'Uno', nasa: "Teeçx", category: 'Números' },
    '2.png': { spanish: 'Dos', nasa: "Teka", category: 'Números' },
    '3.png': { spanish: 'Tres', nasa: "Tekça", category: 'Números' },
    '4.png': { spanish: 'Cuatro', nasa: "Taksa", category: 'Números' },
    '5.png': { spanish: 'Cinco', nasa: "Tehça", category: 'Números' },
    '6.png': { spanish: 'Seis', nasa: "Tehuça", category: 'Números' },
    '7.png': { spanish: 'Siete', nasa: "Tehuka", category: 'Números' },
    '8.png': { spanish: 'Ocho', nasa: "Tehuxa", category: 'Números' },
    '9.png': { spanish: 'Nueve', nasa: "Tehukça", category: 'Números' },
    '10.png': { spanish: 'Diez', nasa: "Tees", category: 'Números' },
    '11.png': { spanish: 'Once', nasa: "Tees teeçx", category: 'Números' },
    '12.png': { spanish: 'Doce', nasa: "Tees teka", category: 'Números' },
    '13.png': { spanish: 'Trece', nasa: "Tees tekça", category: 'Números' },
    '14.png': { spanish: 'Catorce', nasa: "Tees taksa", category: 'Números' },
    '15.png': { spanish: 'Quince', nasa: "Tees tehça", category: 'Números' },
    '16.png': { spanish: 'Dieciséis', nasa: "Tees tehuça", category: 'Números' },
    '17.png': { spanish: 'Diecisiete', nasa: "Tees tehuka", category: 'Números' },
    '18.png': { spanish: 'Dieciocho', nasa: "Tees tehuxa", category: 'Números' },
    '19.png': { spanish: 'Diecinueve', nasa: "Tees tehukça", category: 'Números' },
    '20.png': { spanish: 'Veinte', nasa: "Teka teeswe", category: 'Números' },
    '21.png': { spanish: 'Veintiuno', nasa: "Teka teeswe teeçx", category: 'Números' },
    '22.png': { spanish: 'Veintidós', nasa: "Teka teeswe teka", category: 'Números' },
    '23.png': { spanish: 'Veintitrés', nasa: "Teka teeswe tekça", category: 'Números' },
    '24.png': { spanish: 'Veinticuatro', nasa: "Teka teeswe taksa", category: 'Números' },
    '25.png': { spanish: 'Veinticinco', nasa: "Teka teeswe tehça", category: 'Números' },
    '30.png': { spanish: 'Treinta', nasa: "Tekça teeswe", category: 'Números' },
    '40.png': { spanish: 'Cuarenta', nasa: "Taksa teeswe", category: 'Números' },
    '50.png': { spanish: 'Cincuenta', nasa: "Tehça teeswe", category: 'Números' },
    '60.png': { spanish: 'Sesenta', nasa: "Tehuça teeswe", category: 'Números' },
    '70.png': { spanish: 'Setenta', nasa: "Tehuka teeswe", category: 'Números' },
    '80.png': { spanish: 'Ochenta', nasa: "Tehuxa teeswe", category: 'Números' },
    '90.png': { spanish: 'Noventa', nasa: "Tehukça teeswe", category: 'Números' },
    '100.png': { spanish: 'Cien', nasa: "Patxa", category: 'Números' },
  };

  let actualizadas = 0;
  let sinCoincidencia = [];
  let imagenesProcesadas = new Set();

  console.log('🔍 Procesando imágenes...\n');

  for (const [nombreArchivo, info] of Object.entries(mapeoImagenes)) {
    const imagePath = path.join(imagenesDir, nombreArchivo);
    
    if (fs.existsSync(imagePath)) {
      const imageUrl = `/images/${nombreArchivo}`;
      
      // Actualizar la palabra en español
      const result = await pool.query(
        'UPDATE words SET image_url = $1 WHERE spanish_word = $2',
        [imageUrl, info.spanish]
      );
      
      if (result.rowCount > 0) {
        console.log(`✅ ${info.spanish.padEnd(25)} → ${imageUrl}`);
        actualizadas++;
        imagenesProcesadas.add(nombreArchivo);
      } else {
        // Si no se encontró, intentar también con la palabra en Nasa Yuwe
        const resultNasa = await pool.query(
          'UPDATE words SET image_url = $1 WHERE nasa_yuwe_word = $2',
          [imageUrl, info.nasa]
        );
        
        if (resultNasa.rowCount > 0) {
          console.log(`✅ ${info.spanish.padEnd(25)} (Nasa Yuwe) → ${imageUrl}`);
          actualizadas++;
          imagenesProcesadas.add(nombreArchivo);
        } else {
          sinCoincidencia.push({ archivo: nombreArchivo, palabra: info.spanish, nasa: info.nasa });
        }
      }
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📊 RESUMEN DE ACTUALIZACIÓN');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`   ✅ Palabras actualizadas: ${actualizadas}`);
  console.log(`   ⚠️ Sin coincidencia en BD: ${sinCoincidencia.length}`);
  
  if (sinCoincidencia.length > 0) {
    console.log('\n   📋 Palabras sin coincidencia (verificar si existen en la BD):');
    sinCoincidencia.forEach(item => {
      console.log(`      • ${item.palabra} (${item.nasa}) - ${item.archivo}`);
    });
  }

  // Ahora crear/actualizar actividades con imágenes
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🎮 CREAR ACTIVIDADES CON IMÁGENES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await crearActividadesConImagenes(imagenesProcesadas);
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ✅ PROCESO COMPLETADO');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  process.exit(0);
}

/**
 * Crear actividades de asociar imagen con palabra usando imágenes reales
 */
async function crearActividadesConImagenes(imagenesProcesadas) {
  // Actividad 1: Asociar Animales
  const animalesConImagen = await pool.query(`
    SELECT spanish_word, nasa_yuwe_word, image_url, difficulty_level
    FROM words w
    JOIN categories c ON w.category_id = c.id
    WHERE c.name = 'Animales' AND w.image_url IS NOT NULL
    LIMIT 20
  `);

  if (animalesConImagen.rows.length >= 5) {
    await crearActividadAsociarImagen(
      'Asociar Animales con Imágenes',
      'Relaciona cada animal con su nombre en Nasa Yuwe',
      'facil',
      animalesConImagen.rows.slice(0, 10)
    );
  }

  // Actividad 2: Asociar Frutas
  const frutasConImagen = await pool.query(`
    SELECT spanish_word, nasa_yuwe_word, image_url, difficulty_level
    FROM words w
    JOIN categories c ON w.category_id = c.id
    WHERE c.name = 'Alimentos' AND w.image_url IS NOT NULL
    LIMIT 20
  `);

  if (frutasConImagen.rows.length >= 5) {
    await crearActividadAsociarImagen(
      'Asociar Alimentos con Imágenes',
      'Relaciona cada alimento con su nombre en Nasa Yuwe',
      'facil',
      frutasConImagen.rows.slice(0, 10)
    );
  }

  // Actividad 3: Asociar Familia
  const familiaConImagen = await pool.query(`
    SELECT spanish_word, nasa_yuwe_word, image_url, difficulty_level
    FROM words w
    JOIN categories c ON w.category_id = c.id
    WHERE c.name = 'Familia' AND w.image_url IS NOT NULL
    LIMIT 15
  `);

  if (familiaConImagen.rows.length >= 5) {
    await crearActividadAsociarImagen(
      'Asociar Familia con Imágenes',
      'Relaciona cada miembro de la familia con su nombre en Nasa Yuwe',
      'intermedio',
      familiaConImagen.rows.slice(0, 8)
    );
  }

  // Actividad 4: Asociar Colores
  const coloresConImagen = await pool.query(`
    SELECT spanish_word, nasa_yuwe_word, image_url, difficulty_level
    FROM words w
    JOIN categories c ON w.category_id = c.id
    WHERE c.name = 'Colores' AND w.image_url IS NOT NULL
    LIMIT 10
  `);

  if (coloresConImagen.rows.length >= 5) {
    await crearActividadAsociarImagen(
      'Asociar Colores con Imágenes',
      'Relaciona cada color con su nombre en Nasa Yuwe',
      'facil',
      coloresConImagen.rows
    );
  }

  // Actividad 5: Asociar Naturaleza
  const naturalezaConImagen = await pool.query(`
    SELECT spanish_word, nasa_yuwe_word, image_url, difficulty_level
    FROM words w
    JOIN categories c ON w.category_id = c.id
    WHERE c.name = 'Naturaleza' AND w.image_url IS NOT NULL
    LIMIT 20
  `);

  if (naturalezaConImagen.rows.length >= 5) {
    await crearActividadAsociarImagen(
      'Asociar Naturaleza con Imágenes',
      'Relaciona elementos de la naturaleza con su nombre en Nasa Yuwe',
      'intermedio',
      naturalezaConImagen.rows.slice(0, 12)
    );
  }

  // Actividad 6: Asociar Números
  const numerosConImagen = await pool.query(`
    SELECT spanish_word, nasa_yuwe_word, image_url, difficulty_level
    FROM words w
    JOIN categories c ON w.category_id = c.id
    WHERE c.name = 'Números' AND w.image_url IS NOT NULL
    ORDER BY spanish_word
    LIMIT 15
  `);

  if (numerosConImagen.rows.length >= 5) {
    await crearActividadAsociarImagen(
      'Asociar Números con Imágenes',
      'Relaciona cada número con su representación en Nasa Yuwe',
      'facil',
      numerosConImagen.rows.slice(0, 10)
    );
  }

  // Actividad 7: Quiz con Imágenes - Nivel Intermedio
  await crearQuizConImagenes('intermedio');

  // Actividad 8: Quiz con Imágenes - Nivel Avanzado
  await crearQuizConImagenes('avanzado');
}

/**
 * Crear una actividad de asociar imagen con palabra
 */
async function crearActividadAsociarImagen(titulo, descripcion, nivel, palabras) {
  try {
    // Verificar si ya existe la actividad
    const existente = await pool.query(
      'SELECT id FROM activities WHERE title = $1',
      [titulo]
    );

    let activityId;

    if (existente.rows.length > 0) {
      activityId = existente.rows[0].id;
      // Eliminar preguntas antiguas
      await pool.query('DELETE FROM questions WHERE activity_id = $1', [activityId]);
      console.log(`   ♻️ Actualizando actividad: ${titulo}`);
    } else {
      // Crear nueva actividad
      const activityResult = await pool.query(`
        INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [titulo, descripcion, 'asociar_imagen', nivel, 240, 70, true]);
      
      activityId = activityResult.rows[0].id;
      console.log(`   ✨ Creando actividad: ${titulo}`);
    }

    // Crear preguntas
    for (let i = 0; i < palabras.length; i++) {
      const palabra = palabras[i];
      
      // Crear pregunta con imagen
      const questionResult = await pool.query(`
        INSERT INTO questions (activity_id, question_text, question_type, image_url, correct_answer, points, order_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        activityId,
        `¿Cómo se dice "${palabra.spanish_word}" en Nasa Yuwe?`,
        'image_match',
        palabra.image_url,
        palabra.nasa_yuwe_word,
        1,
        i + 1
      ]);

      const questionId = questionResult.rows[0].id;

      // Crear opciones (respuesta correcta + 2 incorrectas)
      const opcionesIncorrectas = palabras
        .filter((p, idx) => idx !== i && p.nasa_yuwe_word !== palabra.nasa_yuwe_word)
        .slice(0, 2);

      const opciones = [
        { text: palabra.nasa_yuwe_word, label: 'A', correct: true },
        { text: opcionesIncorrectas[0]?.nasa_yuwe_word || 'Otra opción', label: 'B', correct: false },
        { text: opcionesIncorrectas[1]?.nasa_yuwe_word || 'Otra opción más', label: 'C', correct: false }
      ];

      // Mezclar opciones aleatoriamente
      opciones.sort(() => Math.random() - 0.5);
      
      // Re-asignar etiquetas A, B, C
      const labels = ['A', 'B', 'C'];
      opciones.forEach((opcion, idx) => {
        opcion.label = labels[idx];
      });

      for (const opcion of opciones) {
        await pool.query(`
          INSERT INTO question_options (question_id, option_text, option_label, is_correct)
          VALUES ($1, $2, $3, $4)
        `, [questionId, opcion.text, opcion.label, opcion.correct]);
      }
    }

    console.log(`      ✅ ${palabras.length} preguntas creadas`);
  } catch (error) {
    console.error(`      ❌ Error creando actividad "${titulo}":`, error.message);
  }
}

/**
 * Crear quiz con imágenes
 */
async function crearQuizConImagenes(nivel) {
  const titulo = `Quiz con Imágenes - Nivel ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`;
  const descripcion = `Identifica palabras en Nasa Yuwe usando imágenes - Nivel ${nivel}`;

  try {
    const palabrasConImagen = await pool.query(`
      SELECT spanish_word, nasa_yuwe_word, image_url, c.name as category
      FROM words w
      JOIN categories c ON w.category_id = c.id
      WHERE w.image_url IS NOT NULL AND w.difficulty_level = $1
      ORDER BY RANDOM()
      LIMIT 12
    `, [nivel]);

    if (palabrasConImagen.rows.length < 5) {
      console.log(`   ⚠️ No hay suficientes palabras con imágenes para nivel ${nivel}`);
      return;
    }

    // Verificar si ya existe la actividad
    const existente = await pool.query(
      'SELECT id FROM activities WHERE title = $1',
      [titulo]
    );

    let activityId;

    if (existente.rows.length > 0) {
      activityId = existente.rows[0].id;
      await pool.query('DELETE FROM questions WHERE activity_id = $1', [activityId]);
      console.log(`   ♻️ Actualizando actividad: ${titulo}`);
    } else {
      const activityResult = await pool.query(`
        INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [titulo, descripcion, 'quiz', nivel, 360, 75, true]);
      
      activityId = activityResult.rows[0].id;
      console.log(`   ✨ Creando actividad: ${titulo}`);
    }

    // Crear preguntas variadas
    for (let i = 0; i < Math.min(10, palabrasConImagen.rows.length); i++) {
      const palabra = palabrasConImagen.rows[i];
      
      // Alternar entre preguntas con imagen y sin imagen
      const usarImagen = i % 2 === 0;
      
      const questionResult = await pool.query(`
        INSERT INTO questions (activity_id, question_text, question_type, image_url, correct_answer, points, order_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        activityId,
        usarImagen ? `¿Qué palabra en Nasa Yuwe corresponde a esta imagen?` : `¿Cómo se dice "${palabra.spanish_word}" en Nasa Yuwe?`,
        'multiple_choice',
        usarImagen ? palabra.image_url : null,
        palabra.nasa_yuwe_word,
        1,
        i + 1
      ]);

      const questionId = questionResult.rows[0].id;

      // Obtener opciones incorrectas
      const opcionesIncorrectas = palabrasConImagen.rows
        .filter((p, idx) => idx !== i && p.nasa_yuwe_word !== palabra.nasa_yuwe_word)
        .slice(0, 2);

      const opciones = [
        { text: palabra.nasa_yuwe_word, label: 'A', correct: true },
        { text: opcionesIncorrectas[0]?.nasa_yuwe_word || 'Otra opción', label: 'B', correct: false },
        { text: opcionesIncorrectas[1]?.nasa_yuwe_word || 'Otra opción más', label: 'C', correct: false }
      ];

      // Mezclar opciones
      opciones.sort(() => Math.random() - 0.5);
      const labels = ['A', 'B', 'C'];
      opciones.forEach((opcion, idx) => {
        opcion.label = labels[idx];
      });

      for (const opcion of opciones) {
        await pool.query(`
          INSERT INTO question_options (question_id, option_text, option_label, is_correct)
          VALUES ($1, $2, $3, $4)
        `, [questionId, opcion.text, opcion.label, opcion.correct]);
      }
    }

    console.log(`      ✅ Quiz creado con ${Math.min(10, palabrasConImagen.rows.length)} preguntas`);
  } catch (error) {
    console.error(`      ❌ Error creando quiz nivel ${nivel}:`, error.message);
  }
}

// Ejecutar el script
actualizarTodoConImagenes().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

