const fs = require('fs');
const readline = require('readline');
const path = require('path');

let videosMp4 = []
const videoDirectoryPath = 'Text';
// Especificar la ruta del fichero y el valor a buscar
const filePath = 'Text/summaries.txt';
const searchValue = 'Twitter';

// Función para leer el listado de ficheros en una carpeta y filtrar por extensión
function listFiles(directoryPath) {
  // Leer el contenido del directorio
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    // Filtrar los ficheros con extensión .mp4
    const mp4Files = files.filter(file => path.extname(file).toLowerCase() === '.mp4');

    // Mostrar los ficheros .mp4
    console.log('MP4 files found:');
    mp4Files.forEach(file => {
        videosMp4.push(file);
    });

    console.log(videosMp4);
  });
}


// Función para leer el fichero y almacenar líneas siguientes a "Twitter"
function readAndStoreFollowingLines(filePath, searchValue) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const storedLines = [];
  let storeNextLine = false;

  rl.on('line', (line) => {
    if (storeNextLine) {
      storedLines.push(line);
      storeNextLine = false;
    }

    if (line.includes(searchValue)) {
      storeNextLine = true;
    }
  });

  rl.on('close', () => {
    console.log('Lines stored following the value "' + searchValue + '":');
    storedLines.forEach((line, index) => {
      console.log(`Line ${index + 1}: ${line}`);
    });
  });
}


// Llamar a la función para leer y almacenar las líneas siguientes
readAndStoreFollowingLines(filePath, searchValue);
listFiles(videoDirectoryPath);
