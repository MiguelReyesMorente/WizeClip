const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const fs = require('fs');

const consumer_key = 'i0NVGo12wixVEUWxMB7YToN0v';
const consumer_secret = 'tzqRcGPsgEntD5hVX1T1l5ko2xgHGEX8FMqx1dO19jQyimtaAf';
const accessToken = '1811327010787971073-oUTun779t0evj1LmNY6TY5gOcd0lum';
const accessTokenSecret = 'z79zZ8qHQYIdhrlAHcLFhwYRXKPaitq4GzxcsUrteMYgw';

// Configuración de OAuth
const oauth = OAuth({
  consumer: {
    key: 'i0NVGo12wixVEUWxMB7YToN0v',
    secret: 'tzqRcGPsgEntD5hVX1T1l5ko2xgHGEX8FMqx1dO19jQyimtaAf',
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

const token = {
  key: '1811327010787971073-oUTun779t0evj1LmNY6TY5gOcd0lum',
  secret: 'z79zZ8qHQYIdhrlAHcLFhwYRXKPaitq4GzxcsUrteMYgw',
};

// Función para iniciar la subida de medios
async function initUpload(mediaSize, mediaType) {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  const requestData = {
    url: url,
    method: 'POST',
    params: {
      command: 'INIT',
      media_category: "tweet_video",
      total_bytes: mediaSize,
      media_type: mediaType,
    }
  };

  const headers = oauth.toHeader(oauth.authorize({url: url, method: "POST"}, token));

  try {
    const response = await axios.post(url, requestData.params, {      
      headers: {
        ...headers,
      "Content-Type": "multipart/form-data"
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error initiating upload:', error.response ? error.response.data : error.message);
  }
}

// Función para subir una parte del archivo
async function appendUpload(mediaId, mediaData, segmentIndex) {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  const requestData = {
    url: url,
    method: 'POST',
    params: {
      command: 'APPEND',
      media_id: mediaId,
      segment_index: segmentIndex,
    }
  };

  const headers = oauth.toHeader(oauth.authorize({url: url, method: "POST"}, token));

  try {
    await axios.post(url, mediaData, {
      params: requestData.params,
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error appending upload:', error.response ? error.response.data : error.message);
  }
}

// Función para finalizar la subida de medios
async function finalizeUpload(mediaId) {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  const requestData = {
    url: url,
    method: 'POST',
    params: {
      command: 'FINALIZE',
      media_id: mediaId,
    }
  };

  const headers = oauth.toHeader(oauth.authorize({url: url, method: "POST"}, token));

  try {
    const response = await axios.post(url, null, {
      params: requestData.params,
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error finalizing upload:', error.response ? error.response.data : error.message);
  }
}

// Función para publicar el tweet
async function postTweet(status, mediaId) {
    const url = 'https://api.twitter.com/1.1/statuses/update.json';
    const requestData = {
      url: url,
      method: 'POST',
      params: {
        status: status,
        media_ids: mediaId,
      }
    };
  
    const headers = oauth.toHeader(oauth.authorize({url: url, method: "POST"}, token));
  
    try {
      const response = await axios.post(url, null, {
        params: requestData.params,
        headers: headers,
      });
      console.log('Tweet posted successfully:', response.data);
    } catch (error) {
      console.error('Error posting tweet:', error.response ? error.response.data : error.message);
    }
  }
  
  // Ejemplo de uso
  (async () => {
    const mediaFilePath = 'Video/newVideo.mp4';
    const mediaData = fs.readFileSync(mediaFilePath);
    const mediaSize = mediaData.length;
    const mediaType = 'video/mp4';
  
    // Iniciar la subida
    const initResponse = await initUpload(mediaSize, mediaType);
    if (!initResponse) return;
  
    const mediaId = initResponse.media_id_string;
  
    // Subir el archivo en partes
    const segmentSize = 5 * 1024 * 1024; // 5 MB
    let segmentIndex = 0;
    for (let i = 0; i < mediaSize; i += segmentSize) {
      const segmentData = mediaData.slice(i, i + segmentSize);
      await appendUpload(mediaId, segmentData, segmentIndex);
      segmentIndex++;
    }
  
    // Finalizar la subida
    const finalizeResponse = await finalizeUpload(mediaId);
    if (!finalizeResponse) return;
  
    // Publicar el tweet
    await postTweet('Your tweet text with video', mediaId);
  })();