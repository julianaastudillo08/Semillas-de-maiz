import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SCRIPT COMPLETO: Agregar TODAS las palabras faltantes y asociar las 403 imágenes
 */

// Mapeo completo de TODAS las imágenes a palabras
const mapeoCompleto = {
  // ============================================================
  // NÚMEROS (0-100) - Convertir de número a palabra
  // ============================================================
  '0.png': { spanish: 'Cero', nasa: 'Seru', category: 'Números', difficulty: 'facil' },
  '1.png': { spanish: 'Uno', nasa: 'Teeçx', category: 'Números', difficulty: 'facil' },
  '2.png': { spanish: 'Dos', nasa: 'Teka', category: 'Números', difficulty: 'facil' },
  '3.png': { spanish: 'Tres', nasa: 'Tekça', category: 'Números', difficulty: 'facil' },
  '4.png': { spanish: 'Cuatro', nasa: 'Taksa', category: 'Números', difficulty: 'facil' },
  '5.png': { spanish: 'Cinco', nasa: 'Tehça', category: 'Números', difficulty: 'facil' },
  '6.png': { spanish: 'Seis', nasa: 'Tehuça', category: 'Números', difficulty: 'facil' },
  '7.png': { spanish: 'Siete', nasa: 'Tehuka', category: 'Números', difficulty: 'facil' },
  '8.png': { spanish: 'Ocho', nasa: 'Tehuxa', category: 'Números', difficulty: 'facil' },
  '9.png': { spanish: 'Nueve', nasa: 'Tehukça', category: 'Números', difficulty: 'facil' },
  '10.png': { spanish: 'Diez', nasa: 'Tees', category: 'Números', difficulty: 'facil' },
  '11.png': { spanish: 'Once', nasa: 'Tees teeçx', category: 'Números', difficulty: 'facil' },
  '12.png': { spanish: 'Doce', nasa: 'Tees teka', category: 'Números', difficulty: 'facil' },
  '13.png': { spanish: 'Trece', nasa: 'Tees tekça', category: 'Números', difficulty: 'facil' },
  '14.png': { spanish: 'Catorce', nasa: 'Tees taksa', category: 'Números', difficulty: 'facil' },
  '15.png': { spanish: 'Quince', nasa: 'Tees tehça', category: 'Números', difficulty: 'facil' },
  '16.png': { spanish: 'Dieciséis', nasa: 'Tees tehuça', category: 'Números', difficulty: 'intermedio' },
  '17.png': { spanish: 'Diecisiete', nasa: 'Tees tehuka', category: 'Números', difficulty: 'intermedio' },
  '18.png': { spanish: 'Dieciocho', nasa: 'Tees tehuxa', category: 'Números', difficulty: 'intermedio' },
  '19.png': { spanish: 'Diecinueve', nasa: 'Tees tehukça', category: 'Números', difficulty: 'intermedio' },
  '20.png': { spanish: 'Veinte', nasa: 'Teka teeswe', category: 'Números', difficulty: 'intermedio' },
  '21.png': { spanish: 'Veintiuno', nasa: 'Teka teeswe teeçx', category: 'Números', difficulty: 'intermedio' },
  '22.png': { spanish: 'Veintidós', nasa: 'Teka teeswe teka', category: 'Números', difficulty: 'intermedio' },
  '23.png': { spanish: 'Veintitrés', nasa: 'Teka teeswe tekça', category: 'Números', difficulty: 'intermedio' },
  '24.png': { spanish: 'Veinticuatro', nasa: 'Teka teeswe taksa', category: 'Números', difficulty: 'intermedio' },
  '25.png': { spanish: 'Veinticinco', nasa: 'Teka teeswe tehça', category: 'Números', difficulty: 'intermedio' },
  '26.png': { spanish: 'Veintiséis', nasa: 'Teka teeswe tehuça', category: 'Números', difficulty: 'intermedio' },
  '27.png': { spanish: 'Veintisiete', nasa: 'Teka teeswe tehuka', category: 'Números', difficulty: 'intermedio' },
  '28.png': { spanish: 'Veintiocho', nasa: 'Teka teeswe tehuxa', category: 'Números', difficulty: 'intermedio' },
  '29.png': { spanish: 'Veintinueve', nasa: 'Teka teeswe tehukça', category: 'Números', difficulty: 'intermedio' },
  '30.png': { spanish: 'Treinta', nasa: 'Tekça teeswe', category: 'Números', difficulty: 'intermedio' },
  '31.png': { spanish: 'Treinta y uno', nasa: 'Tekça teeswe teeçx', category: 'Números', difficulty: 'intermedio' },
  '32.png': { spanish: 'Treinta y dos', nasa: 'Tekça teeswe teka', category: 'Números', difficulty: 'intermedio' },
  '33.png': { spanish: 'Treinta y tres', nasa: 'Tekça teeswe tekça', category: 'Números', difficulty: 'intermedio' },
  '34.png': { spanish: 'Treinta y cuatro', nasa: 'Tekça teeswe taksa', category: 'Números', difficulty: 'intermedio' },
  '35.png': { spanish: 'Treinta y cinco', nasa: 'Tekça teeswe tehça', category: 'Números', difficulty: 'intermedio' },
  '36.png': { spanish: 'Treinta y seis', nasa: 'Tekça teeswe tehuça', category: 'Números', difficulty: 'intermedio' },
  '37.png': { spanish: 'Treinta y siete', nasa: 'Tekça teeswe tehuka', category: 'Números', difficulty: 'intermedio' },
  '38.png': { spanish: 'Treinta y ocho', nasa: 'Tekça teeswe tehuxa', category: 'Números', difficulty: 'intermedio' },
  '39.png': { spanish: 'Treinta y nueve', nasa: 'Tekça teeswe tehukça', category: 'Números', difficulty: 'intermedio' },
  '40.png': { spanish: 'Cuarenta', nasa: 'Taksa teeswe', category: 'Números', difficulty: 'intermedio' },
  '41.png': { spanish: 'Cuarenta y uno', nasa: 'Taksa teeswe teeçx', category: 'Números', difficulty: 'avanzado' },
  '42.png': { spanish: 'Cuarenta y dos', nasa: 'Taksa teeswe teka', category: 'Números', difficulty: 'avanzado' },
  '43.png': { spanish: 'Cuarenta y tres', nasa: 'Taksa teeswe tekça', category: 'Números', difficulty: 'avanzado' },
  '44.png': { spanish: 'Cuarenta y cuatro', nasa: 'Taksa teeswe taksa', category: 'Números', difficulty: 'avanzado' },
  '45.png': { spanish: 'Cuarenta y cinco', nasa: 'Taksa teeswe tehça', category: 'Números', difficulty: 'avanzado' },
  '46.png': { spanish: 'Cuarenta y seis', nasa: 'Taksa teeswe tehuça', category: 'Números', difficulty: 'avanzado' },
  '47.png': { spanish: 'Cuarenta y siete', nasa: 'Taksa teeswe tehuka', category: 'Números', difficulty: 'avanzado' },
  '48.png': { spanish: 'Cuarenta y ocho', nasa: 'Taksa teeswe tehuxa', category: 'Números', difficulty: 'avanzado' },
  '49.png': { spanish: 'Cuarenta y nueve', nasa: 'Taksa teeswe tehukça', category: 'Números', difficulty: 'avanzado' },
  '50.png': { spanish: 'Cincuenta', nasa: 'Tehça teeswe', category: 'Números', difficulty: 'avanzado' },
  '51.png': { spanish: 'Cincuenta y uno', nasa: 'Tehça teeswe teeçx', category: 'Números', difficulty: 'avanzado' },
  '52.png': { spanish: 'Cincuenta y dos', nasa: 'Tehça teeswe teka', category: 'Números', difficulty: 'avanzado' },
  '53.png': { spanish: 'Cincuenta y tres', nasa: 'Tehça teeswe tekça', category: 'Números', difficulty: 'avanzado' },
  '54.png': { spanish: 'Cincuenta y cuatro', nasa: 'Tehça teeswe taksa', category: 'Números', difficulty: 'avanzado' },
  '55.png': { spanish: 'Cincuenta y cinco', nasa: 'Tehça teeswe tehça', category: 'Números', difficulty: 'avanzado' },
  '56.png': { spanish: 'Cincuenta y seis', nasa: 'Tehça teeswe tehuça', category: 'Números', difficulty: 'avanzado' },
  '57.png': { spanish: 'Cincuenta y siete', nasa: 'Tehça teeswe tehuka', category: 'Números', difficulty: 'avanzado' },
  '58.png': { spanish: 'Cincuenta y ocho', nasa: 'Tehça teeswe tehuxa', category: 'Números', difficulty: 'avanzado' },
  '59.png': { spanish: 'Cincuenta y nueve', nasa: 'Tehça teeswe tehukça', category: 'Números', difficulty: 'avanzado' },
  '60.png': { spanish: 'Sesenta', nasa: 'Tehuça teeswe', category: 'Números', difficulty: 'avanzado' },
  '61.png': { spanish: 'Sesenta y uno', nasa: 'Tehuça teeswe teeçx', category: 'Números', difficulty: 'avanzado' },
  '62.png': { spanish: 'Sesenta y dos', nasa: 'Tehuça teeswe teka', category: 'Números', difficulty: 'avanzado' },
  '63.png': { spanish: 'Sesenta y tres', nasa: 'Tehuça teeswe tekça', category: 'Números', difficulty: 'avanzado' },
  '64.png': { spanish: 'Sesenta y cuatro', nasa: 'Tehuça teeswe taksa', category: 'Números', difficulty: 'avanzado' },
  '65.png': { spanish: 'Sesenta y cinco', nasa: 'Tehuça teeswe tehça', category: 'Números', difficulty: 'avanzado' },
  '66.png': { spanish: 'Sesenta y seis', nasa: 'Tehuça teeswe tehuça', category: 'Números', difficulty: 'avanzado' },
  '67.png': { spanish: 'Sesenta y siete', nasa: 'Tehuça teeswe tehuka', category: 'Números', difficulty: 'avanzado' },
  '68.png': { spanish: 'Sesenta y ocho', nasa: 'Tehuça teeswe tehuxa', category: 'Números', difficulty: 'avanzado' },
  '69.png': { spanish: 'Sesenta y nueve', nasa: 'Tehuça teeswe tehukça', category: 'Números', difficulty: 'avanzado' },
  '70.png': { spanish: 'Setenta', nasa: 'Tehuka teeswe', category: 'Números', difficulty: 'avanzado' },
  '71.png': { spanish: 'Setenta y uno', nasa: 'Tehuka teeswe teeçx', category: 'Números', difficulty: 'avanzado' },
  '72.png': { spanish: 'Setenta y dos', nasa: 'Tehuka teeswe teka', category: 'Números', difficulty: 'avanzado' },
  '73.png': { spanish: 'Setenta y tres', nasa: 'Tehuka teeswe tekça', category: 'Números', difficulty: 'avanzado' },
  '74.png': { spanish: 'Setenta y cuatro', nasa: 'Tehuka teeswe taksa', category: 'Números', difficulty: 'avanzado' },
  '75.png': { spanish: 'Setenta y cinco', nasa: 'Tehuka teeswe tehça', category: 'Números', difficulty: 'avanzado' },
  '76.png': { spanish: 'Setenta y seis', nasa: 'Tehuka teeswe tehuça', category: 'Números', difficulty: 'avanzado' },
  '77.png': { spanish: 'Setenta y siete', nasa: 'Tehuka teeswe tehuka', category: 'Números', difficulty: 'avanzado' },
  '78.png': { spanish: 'Setenta y ocho', nasa: 'Tehuka teeswe tehuxa', category: 'Números', difficulty: 'avanzado' },
  '79.png': { spanish: 'Setenta y nueve', nasa: 'Tehuka teeswe tehukça', category: 'Números', difficulty: 'avanzado' },
  '80.png': { spanish: 'Ochenta', nasa: 'Tehuxa teeswe', category: 'Números', difficulty: 'avanzado' },
  '81.png': { spanish: 'Ochenta y uno', nasa: 'Tehuxa teeswe teeçx', category: 'Números', difficulty: 'avanzado' },
  '82.png': { spanish: 'Ochenta y dos', nasa: 'Tehuxa teeswe teka', category: 'Números', difficulty: 'avanzado' },
  '83.png': { spanish: 'Ochenta y tres', nasa: 'Tehuxa teeswe tekça', category: 'Números', difficulty: 'avanzado' },
  '84.png': { spanish: 'Ochenta y cuatro', nasa: 'Tehuxa teeswe taksa', category: 'Números', difficulty: 'avanzado' },
  '85.png': { spanish: 'Ochenta y cinco', nasa: 'Tehuxa teeswe tehça', category: 'Números', difficulty: 'avanzado' },
  '86.png': { spanish: 'Ochenta y seis', nasa: 'Tehuxa teeswe tehuça', category: 'Números', difficulty: 'avanzado' },
  '87.png': { spanish: 'Ochenta y siete', nasa: 'Tehuxa teeswe tehuka', category: 'Números', difficulty: 'avanzado' },
  '88.png': { spanish: 'Ochenta y ocho', nasa: 'Tehuxa teeswe tehuxa', category: 'Números', difficulty: 'avanzado' },
  '89.png': { spanish: 'Ochenta y nueve', nasa: 'Tehuxa teeswe tehukça', category: 'Números', difficulty: 'avanzado' },
  '90.png': { spanish: 'Noventa', nasa: 'Tehukça teeswe', category: 'Números', difficulty: 'avanzado' },
  '91.png': { spanish: 'Noventa y uno', nasa: 'Tehukça teeswe teeçx', category: 'Números', difficulty: 'avanzado' },
  '92.png': { spanish: 'Noventa y dos', nasa: 'Tehukça teeswe teka', category: 'Números', difficulty: 'avanzado' },
  '93.png': { spanish: 'Noventa y tres', nasa: 'Tehukça teeswe tekça', category: 'Números', difficulty: 'avanzado' },
  '94.png': { spanish: 'Noventa y cuatro', nasa: 'Tehukça teeswe taksa', category: 'Números', difficulty: 'avanzado' },
  '95.png': { spanish: 'Noventa y cinco', nasa: 'Tehukça teeswe tehça', category: 'Números', difficulty: 'avanzado' },
  '96.png': { spanish: 'Noventa y seis', nasa: 'Tehukça teeswe tehuça', category: 'Números', difficulty: 'avanzado' },
  '97.png': { spanish: 'Noventa y siete', nasa: 'Tehukça teeswe tehuka', category: 'Números', difficulty: 'avanzado' },
  '98.png': { spanish: 'Noventa y ocho', nasa: 'Tehukça teeswe tehuxa', category: 'Números', difficulty: 'avanzado' },
  '99.png': { spanish: 'Noventa y nueve', nasa: 'Tehukça teeswe tehukça', category: 'Números', difficulty: 'avanzado' },
  '100.png': { spanish: 'Cien', nasa: 'Patxa', category: 'Números', difficulty: 'avanzado' },

  // ============================================================
  // ANIMALES
  // ============================================================
  'perro.png': { spanish: 'Perro', nasa: 'Pʉʉs', category: 'Animales', difficulty: 'facil' },
  'gato.png': { spanish: 'Gato', nasa: 'Mishi', category: 'Animales', difficulty: 'facil' },
  'gallina.png': { spanish: 'Gallina', nasa: 'Akas', category: 'Animales', difficulty: 'facil' },
  'venado.jpg': { spanish: 'Venado', nasa: 'Sxa', category: 'Animales', difficulty: 'intermedio' },
  'serpiente.png': { spanish: 'Serpiente', nasa: 'Sxĩi', category: 'Animales', difficulty: 'intermedio' },
  'hormiga.png': { spanish: 'Hormiga', nasa: 'Sxik', category: 'Animales', difficulty: 'facil' },
  'cucaracha.png': { spanish: 'Cucaracha', nasa: 'Kuspe', category: 'Animales', difficulty: 'facil' },
  'abeja.png': { spanish: 'Abeja', nasa: 'Kĩsh', category: 'Animales', difficulty: 'facil' },
  'burro.png': { spanish: 'Burro', nasa: 'Burru', category: 'Animales', difficulty: 'facil' },
  'oveja.png': { spanish: 'Oveja', nasa: 'Kweẽra', category: 'Animales', difficulty: 'facil' },
  'cerdo.png': { spanish: 'Cerdo', nasa: 'Kuchi', category: 'Animales', difficulty: 'facil' },
  'conejo.png': { spanish: 'Conejo', nasa: 'Kweju', category: 'Animales', difficulty: 'facil' },
  'rana.png': { spanish: 'Rana', nasa: 'Kwẽç', category: 'Animales', difficulty: 'facil' },
  'raton.png': { spanish: 'Ratón', nasa: 'Kwe', category: 'Animales', difficulty: 'facil' },
  'loro.png': { spanish: 'Loro', nasa: 'Kũs', category: 'Animales', difficulty: 'intermedio' },
  'aguila.png': { spanish: 'Águila', nasa: 'Pĩt', category: 'Animales', difficulty: 'intermedio' },
  'tigre.png': { spanish: 'Tigre', nasa: 'Tigrre', category: 'Animales', difficulty: 'intermedio' },
  'oso.png': { spanish: 'Oso', nasa: 'Uus', category: 'Animales', difficulty: 'intermedio' },
  'ardilla.png': { spanish: 'Ardilla', nasa: 'Yuçx', category: 'Animales', difficulty: 'intermedio' },
  'pato.png': { spanish: 'Pato', nasa: 'Patu', category: 'Animales', difficulty: 'facil' },
  'tortuga.png': { spanish: 'Tortuga', nasa: 'Kuẽẽs', category: 'Animales', difficulty: 'intermedio' },
  'mosca.png': { spanish: 'Mosca', nasa: 'Tũus', category: 'Animales', difficulty: 'facil' },
  'vaca.jpg': { spanish: 'Vaca', nasa: 'Waka', category: 'Animales', difficulty: 'facil' },
  'caballo.jpg': { spanish: 'Caballo', nasa: 'Kawalyu', category: 'Animales', difficulty: 'facil' },
  'cabra.png': { spanish: 'Cabra', nasa: 'Chiba', category: 'Animales', difficulty: 'facil' },
  'gallo.png': { spanish: 'Gallo', nasa: 'Atɨm', category: 'Animales', difficulty: 'facil' },
  'pollo.png': { spanish: 'Pollo', nasa: 'Pyu', category: 'Animales', difficulty: 'facil' },
  'pavo.png': { spanish: 'Pavo', nasa: 'Pispu', category: 'Animales', difficulty: 'facil' },
  'ganso.png': { spanish: 'Ganso', nasa: 'Gansu', category: 'Animales', difficulty: 'intermedio' },
  'paloma.png': { spanish: 'Paloma', nasa: 'Paluma', category: 'Animales', difficulty: 'facil' },
  'buho.png': { spanish: 'Búho', nasa: 'Tɨtɨ', category: 'Animales', difficulty: 'intermedio' },
  'tucan.png': { spanish: 'Tucán', nasa: 'Dɨɨs', category: 'Animales', difficulty: 'intermedio' },
  'tucán.png': { spanish: 'Tucán', nasa: 'Dɨɨs', category: 'Animales', difficulty: 'intermedio' },
  'gaviota.png': { spanish: 'Gaviota', nasa: 'Gawyuta', category: 'Animales', difficulty: 'intermedio' },
  'cuervo.png': { spanish: 'Cuervo', nasa: 'Wãã', category: 'Animales', difficulty: 'intermedio' },
  'canario.png': { spanish: 'Canario', nasa: 'Kanaryu', category: 'Animales', difficulty: 'intermedio' },
  'avestruz.png': { spanish: 'Avestruz', nasa: 'Awetrus', category: 'Animales', difficulty: 'avanzado' },
  'cocodrilo.png': { spanish: 'Cocodrilo', nasa: 'Babɨlla', category: 'Animales', difficulty: 'avanzado' },
  'lagarto.png': { spanish: 'Lagarto', nasa: 'Sxii wala', category: 'Animales', difficulty: 'intermedio' },
  'iguana.png': { spanish: 'Iguana', nasa: 'Iwana', category: 'Animales', difficulty: 'intermedio' },
  'sapo.png': { spanish: 'Sapo', nasa: 'Kwẽç kwe', category: 'Animales', difficulty: 'facil' },
  'salamandra.png': { spanish: 'Salamandra', nasa: 'Kwẽç dxika', category: 'Animales', difficulty: 'avanzado' },
  'camaleon.png': { spanish: 'Camaleón', nasa: 'Kamaleyun', category: 'Animales', difficulty: 'avanzado' },
  'mariposa.png': { spanish: 'Mariposa', nasa: 'Pulu', category: 'Animales', difficulty: 'facil' },
  'escarabajo.png': { spanish: 'Escarabajo', nasa: 'Sxũũ', category: 'Animales', difficulty: 'intermedio' },
  'grillo.png': { spanish: 'Grillo', nasa: 'Txitxi', category: 'Animales', difficulty: 'facil' },
  'cigarra.png': { spanish: 'Cigarra', nasa: 'Txɨtxɨ kwe', category: 'Animales', difficulty: 'intermedio' },
  'saltamonte.png': { spanish: 'Saltamontes', nasa: 'Saltamunte', category: 'Animales', difficulty: 'intermedio' },
  'mosquito.png': { spanish: 'Mosquito', nasa: 'Muskitu', category: 'Animales', difficulty: 'facil' },
  'avispa.png': { spanish: 'Avispa', nasa: 'Wispa', category: 'Animales', difficulty: 'facil' },
  'libelula.png': { spanish: 'Libélula', nasa: 'Pĩpĩ', category: 'Animales', difficulty: 'intermedio' },
  'caracol.png': { spanish: 'Caracol', nasa: 'Karaku', category: 'Animales', difficulty: 'facil' },
  'leon.png': { spanish: 'León', nasa: 'Leun', category: 'Animales', difficulty: 'facil' },
  'elefante.png': { spanish: 'Elefante', nasa: 'Elefante', category: 'Animales', difficulty: 'facil' },
  'girafa.png': { spanish: 'Jirafa', nasa: 'Xirafa', category: 'Animales', difficulty: 'facil' },
  'cebra.png': { spanish: 'Cebra', nasa: 'Sebra', category: 'Animales', difficulty: 'facil' },
  'mono.png': { spanish: 'Mono', nasa: 'Manu', category: 'Animales', difficulty: 'facil' },
  'mono_aullador.png': { spanish: 'Mono aullador', nasa: 'Manu weyuwe', category: 'Animales', difficulty: 'avanzado' },
  'puma.png': { spanish: 'Puma', nasa: 'Puma', category: 'Animales', difficulty: 'intermedio' },
  'jaguar.png': { spanish: 'Jaguar', nasa: 'Yagwar', category: 'Animales', difficulty: 'intermedio' },
  'zorro.png': { spanish: 'Zorro', nasa: 'Surru', category: 'Animales', difficulty: 'facil' },
  'lobo.png': { spanish: 'Lobo', nasa: 'Lubu', category: 'Animales', difficulty: 'intermedio' },
  'canguro.png': { spanish: 'Canguro', nasa: 'Kanguru', category: 'Animales', difficulty: 'intermedio' },
  'camello.png': { spanish: 'Camello', nasa: 'Kamelyu', category: 'Animales', difficulty: 'intermedio' },
  'liebre.png': { spanish: 'Liebre', nasa: 'Kweju kwe', category: 'Animales', difficulty: 'intermedio' },
  'armadillo.png': { spanish: 'Armadillo', nasa: 'Armadɨlyu', category: 'Animales', difficulty: 'avanzado' },
  'mapache.png': { spanish: 'Mapache', nasa: 'Mapache', category: 'Animales', difficulty: 'intermedio' },
  'murcielago.png': { spanish: 'Murciélago', nasa: 'Txutxu', category: 'Animales', difficulty: 'intermedio' },
  'pereza.png': { spanish: 'Perezoso', nasa: 'Peresu', category: 'Animales', difficulty: 'intermedio' },
  'tapir.png': { spanish: 'Tapir', nasa: 'Danta', category: 'Animales', difficulty: 'avanzado' },
  'ciervo.png': { spanish: 'Ciervo', nasa: 'Sxa kwe', category: 'Animales', difficulty: 'intermedio' },
  'delfin.png': { spanish: 'Delfín', nasa: 'Delfin', category: 'Animales', difficulty: 'intermedio' },
  'ballena.png': { spanish: 'Ballena', nasa: 'Wayena', category: 'Animales', difficulty: 'intermedio' },
  'tibron.png': { spanish: 'Tiburón', nasa: 'Tiwurun', category: 'Animales', difficulty: 'intermedio' },
  'pulpo.png': { spanish: 'Pulpo', nasa: 'Pulpu', category: 'Animales', difficulty: 'facil' },
  'calamar.png': { spanish: 'Calamar', nasa: 'Kalama', category: 'Animales', difficulty: 'intermedio' },
  'medusa.png': { spanish: 'Medusa', nasa: 'Medusa', category: 'Animales', difficulty: 'intermedio' },
  'estrella_de_mar.png': { spanish: 'Estrella de mar', nasa: 'Estreya ũus', category: 'Animales', difficulty: 'intermedio' },
  'cangrejo.png': { spanish: 'Cangrejo', nasa: 'Kangreju', category: 'Animales', difficulty: 'facil' },
  'canguerejo.png': { spanish: 'Cangrejo', nasa: 'Kangreju', category: 'Animales', difficulty: 'facil' },
  'camaron.png': { spanish: 'Camarón', nasa: 'Kamarun', category: 'Animales', difficulty: 'facil' },
  'langosta.png': { spanish: 'Langosta', nasa: 'Langusta', category: 'Animales', difficulty: 'intermedio' },
  'mejillon.png': { spanish: 'Mejillón', nasa: 'Mexiyun', category: 'Animales', difficulty: 'intermedio' },
  'ostra.png': { spanish: 'Ostra', nasa: 'Ustra', category: 'Animales', difficulty: 'intermedio' },
  'caballito_de_mar.png': { spanish: 'Caballito de mar', nasa: 'Kawalyu ũus', category: 'Animales', difficulty: 'intermedio' },
  'pez.jpg': { spanish: 'Pez', nasa: 'Neẽ', category: 'Animales', difficulty: 'facil' },
  'pez_dorado.png': { spanish: 'Pez dorado', nasa: 'Neẽ kĩte', category: 'Animales', difficulty: 'intermedio' },
  'pez_payaso.png': { spanish: 'Pez payaso', nasa: 'Neẽ payasu', category: 'Animales', difficulty: 'intermedio' },
  'piraña.png': { spanish: 'Piraña', nasa: 'Piranya', category: 'Animales', difficulty: 'avanzado' },
  'bagre.png': { spanish: 'Bagre', nasa: 'Bagre', category: 'Animales', difficulty: 'intermedio' },
  'mero.png': { spanish: 'Mero', nasa: 'Meru', category: 'Animales', difficulty: 'avanzado' },
  'triton.png': { spanish: 'Tritón', nasa: 'Tritun', category: 'Animales', difficulty: 'avanzado' },
  'culibri.png': { spanish: 'Colibrí', nasa: 'Kulibri', category: 'Animales', difficulty: 'intermedio' },
  'hacon.png': { spanish: 'Halcón', nasa: 'Alkun', category: 'Animales', difficulty: 'intermedio' },
  'dragon.png': { spanish: 'Dragón', nasa: 'Dragun', category: 'Animales', difficulty: 'avanzado' },
  'Toro.png': { spanish: 'Toro', nasa: 'Turu', category: 'Animales', difficulty: 'facil' },

  // Categorías de animales
  'animal.jpg': { spanish: 'Animal', nasa: 'Kiçxa', category: 'Animales', difficulty: 'facil' },
  'mamifero.jpg': { spanish: 'Mamífero', nasa: 'Mamiferu', category: 'Animales', difficulty: 'avanzado' },
  'ave.jpg': { spanish: 'Ave', nasa: 'Pɨsh', category: 'Animales', difficulty: 'intermedio' },
  'reptil.jpg': { spanish: 'Reptil', nasa: 'Reptil', category: 'Animales', difficulty: 'avanzado' },
  'anfibio.jpg': { spanish: 'Anfibio', nasa: 'Anfibiyu', category: 'Animales', difficulty: 'avanzado' },
  'insecto.jpg': { spanish: 'Insecto', nasa: 'Insektu', category: 'Animales', difficulty: 'intermedio' },
  'microorganismos.jpg': { spanish: 'Microorganismo', nasa: 'Mikruorganismu', category: 'Animales', difficulty: 'avanzado' },
  'persona.jpg': { spanish: 'Persona', nasa: 'Nasa', category: 'Animales', difficulty: 'facil' },

  // ============================================================
  // ALIMENTOS
  // ============================================================
  // Frutas
  'manzana.png': { spanish: 'Manzana', nasa: 'Mansana', category: 'Alimentos', difficulty: 'facil' },
  'MANZNA-ROJA.jpg': { spanish: 'Manzana roja', nasa: 'Mansana sxiya', category: 'Alimentos', difficulty: 'facil' },
  'banana.png': { spanish: 'Banana', nasa: 'Platanu', category: 'Alimentos', difficulty: 'facil' },
  'banano.png': { spanish: 'Banano', nasa: 'Platanu', category: 'Alimentos', difficulty: 'facil' },
  'Platano.png': { spanish: 'Plátano', nasa: 'Platanu', category: 'Alimentos', difficulty: 'facil' },
  'naranja.png': { spanish: 'Naranja', nasa: 'Naranxa', category: 'Alimentos', difficulty: 'facil' },
  'naranja.jpg': { spanish: 'Naranja', nasa: 'Naranxa', category: 'Alimentos', difficulty: 'facil' },
  'fresa.png': { spanish: 'Fresa', nasa: 'Fresa', category: 'Alimentos', difficulty: 'facil' },
  'fresa.jpg': { spanish: 'Fresa', nasa: 'Fresa', category: 'Alimentos', difficulty: 'facil' },
  'uva.png': { spanish: 'Uva', nasa: 'Uwa', category: 'Alimentos', difficulty: 'facil' },
  'uva_morada.jpg': { spanish: 'Uva morada', nasa: 'Uwa muradu', category: 'Alimentos', difficulty: 'intermedio' },
  'pina.png': { spanish: 'Piña', nasa: 'Pinya', category: 'Alimentos', difficulty: 'facil' },
  'piña.jpg': { spanish: 'Piña', nasa: 'Pinya', category: 'Alimentos', difficulty: 'facil' },
  'sandia.png': { spanish: 'Sandía', nasa: 'Sandiya', category: 'Alimentos', difficulty: 'facil' },
  'sandia.jpg': { spanish: 'Sandía', nasa: 'Sandiya', category: 'Alimentos', difficulty: 'facil' },
  'melon.png': { spanish: 'Melón', nasa: 'Melun', category: 'Alimentos', difficulty: 'facil' },
  'melonpng.png': { spanish: 'Melón', nasa: 'Melun', category: 'Alimentos', difficulty: 'facil' },
  'papaya.png': { spanish: 'Papaya', nasa: 'Papaya', category: 'Alimentos', difficulty: 'facil' },
  'papaya.jpg': { spanish: 'Papaya', nasa: 'Papaya', category: 'Alimentos', difficulty: 'facil' },
  'mango.png': { spanish: 'Mango', nasa: 'Mangu', category: 'Alimentos', difficulty: 'facil' },
  'Mango.jpg': { spanish: 'Mango', nasa: 'Mangu', category: 'Alimentos', difficulty: 'facil' },
  'guayaba.png': { spanish: 'Guayaba', nasa: 'Wayaba', category: 'Alimentos', difficulty: 'facil' },
  'Guayaba.jpg': { spanish: 'Guayaba', nasa: 'Wayaba', category: 'Alimentos', difficulty: 'facil' },
  'maracuya.png': { spanish: 'Maracuyá', nasa: 'Marakuya', category: 'Alimentos', difficulty: 'intermedio' },
  'maracuya.jpg': { spanish: 'Maracuyá', nasa: 'Marakuya', category: 'Alimentos', difficulty: 'intermedio' },
  'kiwi.png': { spanish: 'Kiwi', nasa: 'Kiwi', category: 'Alimentos', difficulty: 'facil' },
  'Kiwis.png': { spanish: 'Kiwis', nasa: 'Kiwis', category: 'Alimentos', difficulty: 'facil' },
  'durazno.png': { spanish: 'Durazno', nasa: 'Durasnu', category: 'Alimentos', difficulty: 'facil' },
  'durazno-p.jpg': { spanish: 'Durazno', nasa: 'Durasnu', category: 'Alimentos', difficulty: 'facil' },
  'melocoton.png': { spanish: 'Melocotón', nasa: 'Melukutun', category: 'Alimentos', difficulty: 'intermedio' },
  'cereza.png': { spanish: 'Cereza', nasa: 'Seresa', category: 'Alimentos', difficulty: 'facil' },
  'ceresa.jpg': { spanish: 'Cereza', nasa: 'Seresa', category: 'Alimentos', difficulty: 'facil' },
  'Pera.png': { spanish: 'Pera', nasa: 'Pera', category: 'Alimentos', difficulty: 'facil' },
  'limon.png': { spanish: 'Limón', nasa: 'Limun', category: 'Alimentos', difficulty: 'facil' },
  'limon.jpg': { spanish: 'Limón', nasa: 'Limun', category: 'Alimentos', difficulty: 'facil' },
  'Limon.png': { spanish: 'Limón', nasa: 'Limun', category: 'Alimentos', difficulty: 'facil' },
  'mandarina.png': { spanish: 'Mandarina', nasa: 'Mandarina', category: 'Alimentos', difficulty: 'facil' },
  'Mandarina.jpg': { spanish: 'Mandarina', nasa: 'Mandarina', category: 'Alimentos', difficulty: 'facil' },
  'coco.png': { spanish: 'Coco', nasa: 'Kuku', category: 'Alimentos', difficulty: 'facil' },
  'coco.jpg': { spanish: 'Coco', nasa: 'Kuku', category: 'Alimentos', difficulty: 'facil' },
  'mora.png': { spanish: 'Mora', nasa: 'Mura', category: 'Alimentos', difficulty: 'facil' },

  // Vegetales
  'tomate.png': { spanish: 'Tomate', nasa: 'Tumate', category: 'Alimentos', difficulty: 'facil' },
  'papa.png': { spanish: 'Papa', nasa: 'Papa', category: 'Alimentos', difficulty: 'facil' },
  'yuca.png': { spanish: 'Yuca', nasa: 'Yuka', category: 'Alimentos', difficulty: 'facil' },
  'zanahorias.png': { spanish: 'Zanahoria', nasa: 'Sanaorya', category: 'Alimentos', difficulty: 'facil' },
  'cebolla.png': { spanish: 'Cebolla', nasa: 'Seboya', category: 'Alimentos', difficulty: 'facil' },
  'ajo.png': { spanish: 'Ajo', nasa: 'Axu', category: 'Alimentos', difficulty: 'facil' },
  'lechuga.png': { spanish: 'Lechuga', nasa: 'Lechuga', category: 'Alimentos', difficulty: 'facil' },
  'repollo.png': { spanish: 'Repollo', nasa: 'Repolyu', category: 'Alimentos', difficulty: 'facil' },
  'brocoli.png': { spanish: 'Brócoli', nasa: 'Brokoli', category: 'Alimentos', difficulty: 'facil' },
  'coliflor.png': { spanish: 'Coliflor', nasa: 'Koliflo', category: 'Alimentos', difficulty: 'intermedio' },
  'espinaca.png': { spanish: 'Espinaca', nasa: 'Espinaka', category: 'Alimentos', difficulty: 'facil' },
  'apio.png': { spanish: 'Apio', nasa: 'Apiyu', category: 'Alimentos', difficulty: 'intermedio' },
  'pepino.png': { spanish: 'Pepino', nasa: 'Pepinu', category: 'Alimentos', difficulty: 'facil' },
  'berenjena.png': { spanish: 'Berenjena', nasa: 'Bereñena', category: 'Alimentos', difficulty: 'intermedio' },
  'calabacín.png': { spanish: 'Calabacín', nasa: 'Kalabasin', category: 'Alimentos', difficulty: 'intermedio' },
  'pimenton.png': { spanish: 'Pimentón', nasa: 'Pimentun', category: 'Alimentos', difficulty: 'intermedio' },
  'remolacha.png': { spanish: 'Remolacha', nasa: 'Remolacha', category: 'Alimentos', difficulty: 'intermedio' },

  // Granos y cereales
  'maiz.png': { spanish: 'Maíz', nasa: 'Ats', category: 'Alimentos', difficulty: 'facil' },
  'frijol.png': { spanish: 'Fríjol', nasa: 'Frisol', category: 'Alimentos', difficulty: 'facil' },
  'arroz.png': { spanish: 'Arroz', nasa: 'Arrus', category: 'Alimentos', difficulty: 'facil' },
  'trigo.png': { spanish: 'Trigo', nasa: 'Trigu', category: 'Alimentos', difficulty: 'intermedio' },
  'avena.png': { spanish: 'Avena', nasa: 'Awena', category: 'Alimentos', difficulty: 'intermedio' },
  'lentejas.png': { spanish: 'Lentejas', nasa: 'Lentexas', category: 'Alimentos', difficulty: 'intermedio' },
  'garbanzo.png': { spanish: 'Garbanzo', nasa: 'Garbansus', category: 'Alimentos', difficulty: 'intermedio' },
  'arvejas.png': { spanish: 'Arvejas', nasa: 'Arvexas', category: 'Alimentos', difficulty: 'intermedio' },
  'soja.png': { spanish: 'Soja', nasa: 'Suxa', category: 'Alimentos', difficulty: 'avanzado' },
  'habichuelas.png': { spanish: 'Habichuelas', nasa: 'Abichuelas', category: 'Alimentos', difficulty: 'intermedio' },

  // Carnes y proteínas
  'pescado.png': { spanish: 'Pescado', nasa: 'Neẽ', category: 'Alimentos', difficulty: 'facil' },
  'res.png': { spanish: 'Res', nasa: 'Waka', category: 'Alimentos', difficulty: 'facil' },
  'huevo.png': { spanish: 'Huevo', nasa: 'Lulu', category: 'Alimentos', difficulty: 'facil' },
  'salmon.png': { spanish: 'Salmón', nasa: 'Salmun', category: 'Alimentos', difficulty: 'intermedio' },
  'atun.png': { spanish: 'Atún', nasa: 'Atun', category: 'Alimentos', difficulty: 'intermedio' },
  'atún.png': { spanish: 'Atún', nasa: 'Atun', category: 'Alimentos', difficulty: 'intermedio' },
  'sardina.png': { spanish: 'Sardina', nasa: 'Sardina', category: 'Alimentos', difficulty: 'intermedio' },
  'jamon.png': { spanish: 'Jamón', nasa: 'Xamun', category: 'Alimentos', difficulty: 'facil' },
  'salchicha.png': { spanish: 'Salchicha', nasa: 'Salchicha', category: 'Alimentos', difficulty: 'facil' },
  'mariscos.png': { spanish: 'Mariscos', nasa: 'Mariskas', category: 'Alimentos', difficulty: 'intermedio' },
  'cena-de-navidad.png': { spanish: 'Cena de Navidad', nasa: 'Nawida kumun', category: 'Alimentos', difficulty: 'avanzado' },

  // ============================================================
  // FAMILIA
  // ============================================================
  'mamá.png': { spanish: 'Madre', nasa: 'Mama', category: 'Familia', difficulty: 'facil' },
  'padre.png': { spanish: 'Padre', nasa: 'Taita', category: 'Familia', difficulty: 'facil' },
  'hermana.png': { spanish: 'Hermana', nasa: 'Wala', category: 'Familia', difficulty: 'facil' },
  'hermanos.png': { spanish: 'Hermanos', nasa: "We'wes", category: 'Familia', difficulty: 'facil' },
  'hijo_masculino.png': { spanish: 'Hijo', nasa: 'Ũus', category: 'Familia', difficulty: 'facil' },
  'hija_fememino.png': { spanish: 'Hija', nasa: 'Ũus kwe', category: 'Familia', difficulty: 'facil' },
  'hijos.png': { spanish: 'Hijos', nasa: 'Ũusxa', category: 'Familia', difficulty: 'facil' },
  'abueloMaterno.png': { spanish: 'Abuelo materno', nasa: 'Mama sek', category: 'Familia', difficulty: 'intermedio' },
  'abueloPaterno.png': { spanish: 'Abuelo paterno', nasa: 'Taita sek', category: 'Familia', difficulty: 'intermedio' },
  'abuela_materna.png': { spanish: 'Abuela materna', nasa: 'Mama sek kwe', category: 'Familia', difficulty: 'intermedio' },
  'abuela_paterno.png': { spanish: 'Abuela paterna', nasa: 'Taita sek kwe', category: 'Familia', difficulty: 'intermedio' },
  'tioMaterno.png': { spanish: 'Tío materno', nasa: 'Mama tuku', category: 'Familia', difficulty: 'intermedio' },
  'tioPaterno.png': { spanish: 'Tío paterno', nasa: 'Taita tuku', category: 'Familia', difficulty: 'intermedio' },
  'tiaMaterna.png': { spanish: 'Tía materna', nasa: 'Mama ala', category: 'Familia', difficulty: 'intermedio' },
  'tiaPapá.png': { spanish: 'Tía paterna', nasa: 'Taita ala', category: 'Familia', difficulty: 'intermedio' },
  'primos.png': { spanish: 'Primos', nasa: 'Primas', category: 'Familia', difficulty: 'facil' },
  'Nieto.png': { spanish: 'Nieto', nasa: 'Wẽẽ ũus', category: 'Familia', difficulty: 'intermedio' },
  'Nieta.png': { spanish: 'Nieta', nasa: 'Wẽẽ ũus kwe', category: 'Familia', difficulty: 'intermedio' },
  'bisNieto.png': { spanish: 'Bisnieto', nasa: 'Wẽẽ ũus wala', category: 'Familia', difficulty: 'avanzado' },
  'bisNiet.png': { spanish: 'Bisnieta', nasa: 'Wẽẽ ũus kwe wala', category: 'Familia', difficulty: 'avanzado' },
  'bisAbuelo.png': { spanish: 'Bisabuelo', nasa: 'Sek wala', category: 'Familia', difficulty: 'avanzado' },
  'bisabuela.png': { spanish: 'Bisabuela', nasa: 'Sek kwe wala', category: 'Familia', difficulty: 'avanzado' },
  'esposos.png': { spanish: 'Esposos', nasa: 'Luuçxa', category: 'Familia', difficulty: 'intermedio' },
  'novio.png': { spanish: 'Novio', nasa: 'Luuçx wala', category: 'Familia', difficulty: 'intermedio' },
  'novia.png': { spanish: 'Novia', nasa: 'Luuçx kwe wala', category: 'Familia', difficulty: 'intermedio' },
  'novios.png': { spanish: 'Novios', nasa: 'Luuçxa wala', category: 'Familia', difficulty: 'intermedio' },
  'novios2.png': { spanish: 'Novios', nasa: 'Luuçxa wala', category: 'Familia', difficulty: 'intermedio' },
  'suegro.png': { spanish: 'Suegro', nasa: 'Suegru', category: 'Familia', difficulty: 'intermedio' },
  'suegra.png': { spanish: 'Suegra', nasa: 'Suegra', category: 'Familia', difficulty: 'intermedio' },

  // ============================================================
  // COLORES
  // ============================================================
  'rojo.png': { spanish: 'Rojo', nasa: 'Sxiya', category: 'Colores', difficulty: 'facil' },
  'azul.png': { spanish: 'Azul', nasa: 'Çxiwe', category: 'Colores', difficulty: 'facil' },
  'amarillo.png': { spanish: 'Amarillo', nasa: 'Kĩte', category: 'Colores', difficulty: 'facil' },
  'verde.png': { spanish: 'Verde', nasa: 'Kĩus', category: 'Colores', difficulty: 'facil' },
  'blanco.png': { spanish: 'Blanco', nasa: 'Yũũk', category: 'Colores', difficulty: 'facil' },
  'negro.png': { spanish: 'Negro', nasa: 'Tul', category: 'Colores', difficulty: 'facil' },
  'morado.png': { spanish: 'Morado', nasa: 'Muradu', category: 'Colores', difficulty: 'facil' },
  'rosa.png': { spanish: 'Rosado', nasa: 'Ruusa', category: 'Colores', difficulty: 'facil' },
  'gris.png': { spanish: 'Gris', nasa: 'Gris', category: 'Colores', difficulty: 'facil' },
  'marron.png': { spanish: 'Marrón', nasa: 'Marrun', category: 'Colores', difficulty: 'facil' },
  'circulo.png': { spanish: 'Círculo', nasa: 'Sirkulu', category: 'Colores', difficulty: 'intermedio' },

  // ============================================================
  // NATURALEZA
  // ============================================================
  'agua.png': { spanish: 'Agua', nasa: 'Ũus', category: 'Naturaleza', difficulty: 'facil' },
  'sol.jpg': { spanish: 'Sol', nasa: 'Sek', category: 'Naturaleza', difficulty: 'facil' },
  'luna.jpg': { spanish: 'Luna', nasa: 'Nus', category: 'Naturaleza', difficulty: 'facil' },
  'estrella.jpg': { spanish: 'Estrella', nasa: 'Estreya', category: 'Naturaleza', difficulty: 'facil' },
  'arcoiris.png': { spanish: 'Arcoíris', nasa: 'Kwẽẽs çxiwe', category: 'Naturaleza', difficulty: 'intermedio' },
  'relampago.jpg': { spanish: 'Relámpago', nasa: 'Kũus', category: 'Naturaleza', difficulty: 'intermedio' },
  'lluvia.jpg': { spanish: 'Lluvia', nasa: 'Wes', category: 'Naturaleza', difficulty: 'facil' },
  'nieve de montaña.jpg': { spanish: 'Nieve', nasa: 'Niyewe', category: 'Naturaleza', difficulty: 'intermedio' },
  'granizo.jpg': { spanish: 'Granizo', nasa: 'Granisu', category: 'Naturaleza', difficulty: 'intermedio' },
  'truenos.jpg': { spanish: 'Trueno', nasa: 'Txutx', category: 'Naturaleza', difficulty: 'intermedio' },
  'tormenta.jpg': { spanish: 'Tormenta', nasa: 'Turmenta', category: 'Naturaleza', difficulty: 'intermedio' },
  'viento.jpg': { spanish: 'Viento', nasa: 'Kẽes', category: 'Naturaleza', difficulty: 'facil' },
  'niebla.jpg': { spanish: 'Niebla', nasa: 'Piçx', category: 'Naturaleza', difficulty: 'intermedio' },
  'nubes..JPG': { spanish: 'Nubes', nasa: 'Puwes', category: 'Naturaleza', difficulty: 'facil' },
  'fuego.jpg': { spanish: 'Fuego', nasa: 'Tul', category: 'Naturaleza', difficulty: 'facil' },
  'luz.jpg': { spanish: 'Luz', nasa: 'Kũu', category: 'Naturaleza', difficulty: 'intermedio' },
  'sombra.jpg': { spanish: 'Sombra', nasa: 'Txiwe', category: 'Naturaleza', difficulty: 'intermedio' },
  'tierra.png': { spanish: 'Tierra', nasa: 'Kiwe', category: 'Naturaleza', difficulty: 'facil' },
  'tierrafertil.jpg': { spanish: 'Tierra fértil', nasa: 'Kiwe fxiza', category: 'Naturaleza', difficulty: 'avanzado' },
  'Arena.jpg': { spanish: 'Arena', nasa: 'Txipa', category: 'Naturaleza', difficulty: 'facil' },
  'arenadelmar.jpg': { spanish: 'Arena del mar', nasa: 'Txipa ũus', category: 'Naturaleza', difficulty: 'intermedio' },
  'piedra.jpg': { spanish: 'Piedra', nasa: 'Wala', category: 'Naturaleza', difficulty: 'facil' },
  'roca.png': { spanish: 'Roca', nasa: 'Wala kwe', category: 'Naturaleza', difficulty: 'facil' },
  'rocas.jpg': { spanish: 'Rocas', nasa: 'Walaxa', category: 'Naturaleza', difficulty: 'facil' },
  'minerales.png': { spanish: 'Minerales', nasa: 'Minerales', category: 'Naturaleza', difficulty: 'avanzado' },
  'montanas.jpg': { spanish: 'Montaña', nasa: 'Kãpi', category: 'Naturaleza', difficulty: 'facil' },
  'colina.png': { spanish: 'Colina', nasa: 'Kãpi kiwet', category: 'Naturaleza', difficulty: 'intermedio' },
  'valIe.jpg': { spanish: 'Valle', nasa: 'Wala kiwe', category: 'Naturaleza', difficulty: 'intermedio' },
  'llanura.jpg': { spanish: 'Llanura', nasa: 'Txãa', category: 'Naturaleza', difficulty: 'intermedio' },
  'sabana.jpg': { spanish: 'Sabana', nasa: 'Sabana', category: 'Naturaleza', difficulty: 'intermedio' },
  'pradera.jpg': { spanish: 'Pradera', nasa: 'Pradera', category: 'Naturaleza', difficulty: 'intermedio' },
  'bosque.jpg': { spanish: 'Bosque', nasa: 'Tul kiwe', category: 'Naturaleza', difficulty: 'facil' },
  'selva.jpg': { spanish: 'Selva', nasa: 'Selba', category: 'Naturaleza', difficulty: 'intermedio' },
  'desierto.jpg': { spanish: 'Desierto', nasa: 'Desiertu', category: 'Naturaleza', difficulty: 'intermedio' },
  'playa.jpg': { spanish: 'Playa', nasa: 'Playa', category: 'Naturaleza', difficulty: 'facil' },
  'mar.png': { spanish: 'Mar', nasa: 'Atun ũus', category: 'Naturaleza', difficulty: 'facil' },
  'océano.jpg': { spanish: 'Océano', nasa: 'Usiyanu', category: 'Naturaleza', difficulty: 'intermedio' },
  'laguna.jpg': { spanish: 'Laguna', nasa: 'Laguna', category: 'Naturaleza', difficulty: 'intermedio' },
  'rios.jpg': { spanish: 'Río', nasa: 'Wes', category: 'Naturaleza', difficulty: 'facil' },
  'cascadas.jpg': { spanish: 'Cascada', nasa: 'Wes jĩi', category: 'Naturaleza', difficulty: 'intermedio' },
  'Quebradas.jpg': { spanish: 'Quebrada', nasa: 'Wes kiwet', category: 'Naturaleza', difficulty: 'intermedio' },
  'pantano.jpg': { spanish: 'Pantano', nasa: 'Pantanu', category: 'Naturaleza', difficulty: 'intermedio' },
  'charco.jpg': { spanish: 'Charco', nasa: 'Txarku', category: 'Naturaleza', difficulty: 'facil' },
  'isla.png': { spanish: 'Isla', nasa: 'Isla', category: 'Naturaleza', difficulty: 'intermedio' },
  'Peninsula.jpg': { spanish: 'Península', nasa: 'Peninsula', category: 'Naturaleza', difficulty: 'avanzado' },
  'cueva.jpg': { spanish: 'Cueva', nasa: 'Kueẽ', category: 'Naturaleza', difficulty: 'intermedio' },
  'cañon.jpg': { spanish: 'Cañón', nasa: 'Kanyun', category: 'Naturaleza', difficulty: 'avanzado' },
  'volcan.jpg': { spanish: 'Volcán', nasa: 'Wulkan', category: 'Naturaleza', difficulty: 'intermedio' },
  'humoVolcan.jpg': { spanish: 'Humo de volcán', nasa: 'Wulkan txuswe', category: 'Naturaleza', difficulty: 'avanzado' },
  'arbol.jpg': { spanish: 'Árbol', nasa: 'Tul', category: 'Naturaleza', difficulty: 'facil' },
  'planta.jpg': { spanish: 'Planta', nasa: 'Yat', category: 'Naturaleza', difficulty: 'facil' },
  'plantas.jpg': { spanish: 'Plantas', nasa: 'Yatxa', category: 'Naturaleza', difficulty: 'facil' },
  'flor.jpg': { spanish: 'Flor', nasa: 'Kwetsa', category: 'Naturaleza', difficulty: 'facil' },
  'hoja.jpg': { spanish: 'Hoja', nasa: 'Wala', category: 'Naturaleza', difficulty: 'facil' },
  'raiz.jpg': { spanish: 'Raíz', nasa: 'Kus', category: 'Naturaleza', difficulty: 'intermedio' },
  'tronco.jpg': { spanish: 'Tronco', nasa: 'Txuçxa', category: 'Naturaleza', difficulty: 'intermedio' },
  'hierba.jpg': { spanish: 'Hierba', nasa: 'Pasatu', category: 'Naturaleza', difficulty: 'facil' },
  'arbusto.jpg': { spanish: 'Arbusto', nasa: 'Arbustu', category: 'Naturaleza', difficulty: 'intermedio' },
  'cactus.jpg': { spanish: 'Cactus', nasa: 'Kaktus', category: 'Naturaleza', difficulty: 'intermedio' },
  'palma.jpg': { spanish: 'Palma', nasa: 'Palma', category: 'Naturaleza', difficulty: 'intermedio' },
  'pino.jpg': { spanish: 'Pino', nasa: 'Pinu', category: 'Naturaleza', difficulty: 'intermedio' },
  'cedro.jpg': { spanish: 'Cedro', nasa: 'Sedru', category: 'Naturaleza', difficulty: 'intermedio' },
  'rosa.jpg': { spanish: 'Rosa', nasa: 'Ruusa', category: 'Naturaleza', difficulty: 'facil' },
  'tulipanes.jpg': { spanish: 'Tulipán', nasa: 'Tulipan', category: 'Naturaleza', difficulty: 'intermedio' },
  'girasol.jpg': { spanish: 'Girasol', nasa: 'Xirasol', category: 'Naturaleza', difficulty: 'intermedio' },
  'margaritas.jpg': { spanish: 'Margarita', nasa: 'Margarita', category: 'Naturaleza', difficulty: 'intermedio' },
  'orquidea.jpg': { spanish: 'Orquídea', nasa: 'Urkidiya', category: 'Naturaleza', difficulty: 'intermedio' },
  'lirio.jpg': { spanish: 'Lirio', nasa: 'Liriyu', category: 'Naturaleza', difficulty: 'intermedio' },
  'cielo.jpg': { spanish: 'Cielo', nasa: 'Ipx', category: 'Naturaleza', difficulty: 'facil' },
  'horizonte.jpg': { spanish: 'Horizonte', nasa: 'Orisonte', category: 'Naturaleza', difficulty: 'avanzado' },
  'amanecer.jpg': { spanish: 'Amanecer', nasa: 'Sek çxiçx', category: 'Naturaleza', difficulty: 'intermedio' },
  'atardecer.jpg': { spanish: 'Atardecer', nasa: 'Sek kẽes', category: 'Naturaleza', difficulty: 'intermedio' },
  'aire.jpg': { spanish: 'Aire', nasa: 'Kẽes', category: 'Naturaleza', difficulty: 'facil' },
  'Semillas.jpg': { spanish: 'Semilla', nasa: 'Tul wala', category: 'Naturaleza', difficulty: 'facil' },
  'fruto.png': { spanish: 'Fruto', nasa: 'Frutu', category: 'Naturaleza', difficulty: 'facil' },
  'lodo.jpg': { spanish: 'Lodo', nasa: 'Ludu', category: 'Naturaleza', difficulty: 'facil' },
  'escarcha.jpg': { spanish: 'Escarcha', nasa: 'Eskarcha', category: 'Naturaleza', difficulty: 'avanzado' },
  'inundaciones.jpg': { spanish: 'Inundación', nasa: 'Inundasiyun', category: 'Naturaleza', difficulty: 'avanzado' },
  'sequia.jpg': { spanish: 'Sequía', nasa: 'Sekiya', category: 'Naturaleza', difficulty: 'avanzado' },
  'huracán.jpg': { spanish: 'Huracán', nasa: 'Urakan', category: 'Naturaleza', difficulty: 'avanzado' },
  'image.jpg': { spanish: 'Imagen', nasa: 'Imaxen', category: 'Naturaleza', difficulty: 'avanzado' },
};

async function completarDiccionario() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🌽 COMPLETAR DICCIONARIO CON TODAS LAS IMÁGENES (403)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const imagenesDir = path.join(__dirname, '../../public/images');
  
  let palabrasInsertadas = 0;
  let palabrasActualizadas = 0;
  let errores = 0;

  // Obtener IDs de categorías
  const categoriesResult = await pool.query('SELECT id, name FROM categories');
  const categoryMap = {};
  categoriesResult.rows.forEach(cat => {
    categoryMap[cat.name] = cat.id;
  });

  console.log('🔍 Procesando TODAS las imágenes...\n');

  for (const [nombreArchivo, info] of Object.entries(mapeoCompleto)) {
    const imagePath = path.join(imagenesDir, nombreArchivo);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️ Imagen no encontrada: ${nombreArchivo}`);
      continue;
    }

    const imageUrl = `/images/${nombreArchivo}`;
    const categoryId = categoryMap[info.category];

    if (!categoryId) {
      console.log(`⚠️ Categoría no encontrada: ${info.category} para ${info.spanish}`);
      continue;
    }

    try {
      // Verificar si la palabra ya existe
      const existeResult = await pool.query(
        'SELECT id, image_url FROM words WHERE spanish_word = $1',
        [info.spanish]
      );

      if (existeResult.rows.length > 0) {
        // Actualizar la imagen si no tiene o es diferente
        const wordId = existeResult.rows[0].id;
        const currentImage = existeResult.rows[0].image_url;
        
        if (!currentImage || currentImage !== imageUrl) {
          await pool.query(
            'UPDATE words SET image_url = $1 WHERE id = $2',
            [imageUrl, wordId]
          );
          console.log(`✅ Actualizada: ${info.spanish.padEnd(30)} → ${imageUrl}`);
          palabrasActualizadas++;
        }
      } else {
        // Insertar nueva palabra
        await pool.query(`
          INSERT INTO words (spanish_word, nasa_yuwe_word, category_id, difficulty_level, image_url)
          VALUES ($1, $2, $3, $4, $5)
        `, [info.spanish, info.nasa, categoryId, info.difficulty, imageUrl]);
        
        console.log(`🆕 Insertada: ${info.spanish.padEnd(30)} (${info.nasa}) → ${imageUrl}`);
        palabrasInsertadas++;
      }
    } catch (error) {
      console.error(`❌ Error con ${info.spanish}:`, error.message);
      errores++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📊 RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`   🆕 Palabras nuevas insertadas: ${palabrasInsertadas}`);
  console.log(`   ✅ Palabras actualizadas: ${palabrasActualizadas}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log(`   📸 Total procesado: ${palabrasInsertadas + palabrasActualizadas}`);

  // Verificar total en la BD
  const totalResult = await pool.query('SELECT COUNT(*) as total FROM words WHERE image_url IS NOT NULL');
  console.log(`\n   📚 Total palabras con imagen en BD: ${totalResult.rows[0].total}`);

  console.log('\n═══════════════════════════════════════════════════════════════\n');
  
  process.exit(0);
}

// Ejecutar
completarDiccionario().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

