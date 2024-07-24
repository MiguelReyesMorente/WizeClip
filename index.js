const got = (...args) => import('got').then(({ default: got }) => got(...args))
const crypto = require('crypto');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const qs = require('querystring');
const util = require('util')
const fs = require('fs');
const { text } = require('express');
const FormData = require('form-data');
const readline = require('readline');
const path = require('path');
const otrofs = require('fs').promises;

const pathToTextFile = "Text/summaries.txt";

const videoDirectoryPath = 'Text';
const searchValue = 'Twitter';


const readline1 = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const consumer_key = 'i0NVGo12wixVEUWxMB7YToN0v';
const consumer_secret = 'tzqRcGPsgEntD5hVX1T1l5ko2xgHGEX8FMqx1dO19jQyimtaAf';
const accessToken = '1811327010787971073-oUTun779t0evj1LmNY6TY5gOcd0lum';
const accessTokenSecret = 'z79zZ8qHQYIdhrlAHcLFhwYRXKPaitq4GzxcsUrteMYgw';

const endpointURL = `https://api.twitter.com/2/tweets`;
const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
const uploadMediaURL = 'https://upload.twitter.com/1.1/media/upload.json';


const oauth = OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
});

const token = {
  key: accessToken,
  secret: accessTokenSecret,
};

// Función INIT para empezar el proceso de subir el archivo multimedia
async function initVideo(total_bytes) {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  //const fileData = fs.readFileSync(filePath);
  const mediaType = 'video/mp4'; // Cambia esto al tipo correcto si no es un vídeo
  const command = 'INIT';
  //const total_bytes = '4108214';
  const media_category = 'tweet_video';

  const request_data = {
    url: url,
    method: 'POST',
    data: {
      command: command,
      total_bytes: total_bytes,
      media_category: media_category,
      media_type: mediaType,
    }
  };
  const headers = oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token));
  try {    
    const response = await axios.post(url, request_data.data, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    console.log("MEDIA CONVERTIDA -> " + String(response.data.media_id));
    return response.data.media_id_string;
  } catch (error) {
    console.error('Error uploading media en INIT:', error.response.data);
    process.exit(-1);
  }
}

// Función APPEND para seguir con la subida el archivo multimedia
async function appendVideo(filePath, el_media_id) {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  const media = fs.readFileSync(filePath);

  
  //const media = fs.createReadStream(filePath);
  
  const command = 'APPEND';
  const segment_index = '0';
  const media_id = el_media_id;
  const request_data = {
    url: url,
    method: 'POST',
    data: {
      command: command,
      media: media,
      segment_index: segment_index,
      media_id: media_id,
    }
  };
  const headers = oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token));
  try {
    console.log(request_data);
    const response = await axios.post(url, request_data.data, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return;
  } catch (error) {
    console.error('Error uploading media en APPEND:', error.response.data);
    process.exit(-1);
  }
}

// Función FINALIZE para seguir con la subida el archivo multimedia
async function finalizeVideo(el_media_id, total_bytes) {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  //const fileData = fs.readFileSync(filePath);
  const command = 'FINALIZE';
  //const total_bytes = '4108214';  
  const media_id = el_media_id;
  const request_data = {
    url: url,
    method: 'POST',
    data: {
      command: command,
      total_bytes: total_bytes,
      media_id: media_id,
    },
  };
  const headers = oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token));
  try {
    const response = await axios.post(url, request_data.data, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    console.log("MEDIA CONVERTIDA -> " + String(response.data.media_id));
    return response.data.media_id_string;
  } catch (error) {
    console.error('Error uploading media en FINALIZE:', error.response.data);
    process.exit(-1);
  }
}

// Función POSTEAR video y texto
async function postVideo(media_id, texto) {
  const url = 'https://api.twitter.com/2/tweets';
  const request_data = {
    url: url,
    method: 'POST',
    data: {
      text: texto,
      media: {media_ids: [media_id]}
    }
  };
  const headers = oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token));
  try {
    console.log(request_data);
    const response = await axios.post(url, request_data.data, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return;
  } catch (error) {
    console.error('Error uploading media en POSTING TWEET:', error.response.data);
    process.exit(-1);
  }
}

async function listFiles(directoryPath) {
  // Leer el contenido del directorio
  try{
    return new Promise((resolve) =>{
      fs.readdir(directoryPath, (err, files) => {
        let videosMp4 = [];
        if (err) {
          console.error(`Error reading directory: ${err}`);
          return;
        }
        
        // Filtrar los ficheros con extensión .mp4
        const mp4Files = files.filter(file => path.extname(file).toLowerCase() === '.mp4');
    
        // Mostrar los ficheros .mp4
        console.log('MP4 files found:');
        mp4Files.forEach(file => {
            console.log(file);
            videosMp4.push(file);
        });

        resolve(videosMp4[0]);
    })
  });

    
  }catch(error){
    console.error(error);
  }

}

async function getFileSize(filePath){
  try{
    const stats = await otrofs.stat(filePath);
    return String(stats.size);
  } catch (error){
    console.error(error);
  }
  
}

async function readAndStoreFollowingLines(filePath, searchValue) {

  try{

    return new Promise((resolve) => {
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
        /*
        console.log('Lines stored following the value "' + searchValue + '":');
        
        storedLines.forEach((line, index) => {
          console.log(`Line ${index + 1}: ${line}`);
        });
        */
        console.log(storedLines[0])
        //return storedLines[0];
        resolve(storedLines[0]);
      });});
      
    

  }catch(error){
    console.error(error);
  }

}

async function main() {

    try{
 
  const texto = await readAndStoreFollowingLines(pathToTextFile, searchValue);
  const video = await listFiles(videoDirectoryPath)
  const videoSize = await getFileSize(videoDirectoryPath+"/"+video);
    //const filePath = 'Video/newVideo.mp4'; // Cambia esto a la ruta de tu archivo
    console.log(videoSize);
  const mediaId = await initVideo(videoSize);
  if (mediaId) {
    
    //await postTweetWithMedia(mediaId, status);
    await appendVideo(videoDirectoryPath+"/"+video, mediaId);
    const media_last_id = await finalizeVideo(mediaId, videoSize);
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms)) 
    await delay(10000) 
    await postVideo(media_last_id, texto);
    process.exit(-1);
  }

  }catch(error){
    console.error(error);
    process.exit(-1);
  }
}
main();