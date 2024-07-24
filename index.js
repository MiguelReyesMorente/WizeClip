/*const got = (...args) => import('got').then(({ default: got }) => got(...args))
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const qs = require('querystring');
const fs = require('fs');
const { text } = require('express');
const pathToTextFile = "Text/summaries.txt";
const pathToVideoFile = "Video/newVideo.mp4";

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


// The code below sets the consumer key and consumer secret from your environment variables
// To set environment variables on macOS or Linux, run the export commands below from the terminal:
// export CONSUMER_KEY='YOUR-KEY'
// export CONSUMER_SECRET='YOUR-SECRET'
//const consumer_key = process.env.CONSUMER_KEY;
//const consumer_secret = process.env.CONSUMER_SECRET;

const consumer_key = 'i0NVGo12wixVEUWxMB7YToN0v';
const consumer_secret = 'tzqRcGPsgEntD5hVX1T1l5ko2xgHGEX8FMqx1dO19jQyimtaAf';


// Be sure to add replace the text of the with the text you wish to Tweet.
// You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.
// let reader = fs.createReadStream(pathToTextFile, {
//   flag: 'a+',
//   encoding: 'UTF-8',
//   start: 3,
//   end: 6
// });
// fs.createReadStream(pathToTextFile)

// const data = {
//   "text": ""
// };

const endpointURL = `https://api.twitter.com/2/tweets`;

// this example uses PIN-based OAuth to authorize the user
const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';

const oauth = OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function input(prompt) {
  return new Promise(async (resolve, reject) => {
    readline.question(prompt, (out) => {
      readline.close();
      resolve(out);
    });
  });
}

async function requestToken() {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: requestTokenURL,
    method: 'POST'
  }));

  const req = await got(requestTokenURL, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}


async function accessToken({
  oauth_token,
  oauth_token_secret
}, verifier) {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: accessTokenURL,
    method: 'POST'
  }));
  const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
  const req = await got(path, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    let result = '';
    stream.on("data", (d) => {
      result += d.toString();
    })
    stream.on("end", () => {
      resolve(result);
    })
    stream.on("error", () => {
      console.log('error')
      reject();
    })
  })
}

async function getRequest({
  oauth_token,
  oauth_token_secret
}) {

  const token = {
    key: oauth_token,
    secret: oauth_token_secret
  };

  const authHeader = oauth.toHeader(oauth.authorize({
    url: endpointURL,
    method: 'POST'
  }, token));

  let reader = fs.createReadStream(pathToTextFile, {
    start: 23,
    end: 211
  });

  const data = {
    "text": await streamToString(reader)
  };


  const req = await got(endpointURL, {
    method: "POST",
    json: data,
    responseType: 'json',
    headers: {
      Authorization: authHeader["Authorization"],
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    }
  });
  if (req.body) {
    return req.body;
  } else {
    throw new Error('Unsuccessful request');
  }
}


(async () => {
  try {
    // Get request token
    const oAuthRequestToken = await requestToken();
    // Get authorization
    authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);
    console.log('Please go here and authorize:', authorizeURL.href);
    const pin = await input('Paste the PIN here: ');
    // Get the access token
    const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
    // Make the request
    const response = await getRequest(oAuthAccessToken);
    console.dir(response, {
      depth: null
    });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();*/

const got = (...args) => import('got').then(({ default: got }) => got(...args))
const crypto = require('crypto');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const qs = require('querystring');
const fs = require('fs');
const { text } = require('express');
const FormData = require('form-data');

const pathToTextFile = "Text/summaries.txt";
const pathToVideoFile = "Video/newVideo.mp4";

const readline = require('readline').createInterface({
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
async function initVideo() {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  //const fileData = fs.readFileSync(filePath);
  const mediaType = 'video/mp4'; // Cambia esto al tipo correcto si no es un vídeo
  const command = 'INIT';
  const total_bytes = '254582';
  const media_category = 'tweet_video';
  const form = new FormData();
  form.append("command", command);
  form.append("total_bytes", total_bytes);
  form.append("media_category", media_category);
  form.append("media_type", mediaType);

  const request_data = {
    url: url,
    method: 'POST',
    data: {
      command: command,
      total_bytes: total_bytes,
      media_category: media_category,
      media_type: mediaType,
    },
  };
  const headers = oauth.toHeader(oauth.authorize({url:url, method:'POST'}, token));
  try {
    const response = await axios.post(url, form, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return String(response.data.media_id);
  } catch (error) {
    console.error('Error uploading media en INIT:', error.response.data);
    process.exit(-1);
  }
}

// Función APPEND para seguir con la subida el archivo multimedia
async function appendVideo(filePath, el_media_id) {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  //const fileData = fs.readFileSync(filePath);
  const media = fs.readFileSync(filePath);
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
    },
  };
  const headers = oauth.toHeader(oauth.authorize({url:url, method:'POST'}, token));
  try {
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
async function finalizeVideo(el_media_id) {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  //const fileData = fs.readFileSync(filePath);
  const command = 'FINALIZE';
  const total_bytes = '254582';
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
  const headers = oauth.toHeader(oauth.authorize({url:url, method:'POST'}, token));
  try {
    const response = await axios.post(url, request_data.data, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return String(response.data.media_id);
  } catch (error) {
    console.error('Error uploading media en FINALIZE:', error.response.data);
    process.exit(-1);
  }
}

// Función POSTEAR video y texto
async function postVideo(media_id) {
  const url = 'https://api.twitter.com/2/tweets';
  const request_data = {
    url: url,
    method: 'POST',
    data: {
      text: "Hola new video in sesion",
      media: {media_ids: [media_id]}
    }
  };
  const headers = oauth.toHeader(oauth.authorize({url:url, method:'POST'}, token));
  try {
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
/*
// Función para publicar el tweet
async function postTweetWithMedia(mediaId, status) {
  const url = 'https://api.twitter.com/2/tweets';
  const request_data = {
    url: url,
    method: 'POST',
    data: {
      status: status,
      media_ids: mediaId,
    },
  };
  const headers = oauth.toHeader(oauth.authorize(request_data, token));
  try {
    const response = await axios.post(url, request_data.data, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',

      },
    });
    console.log('Tweet posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting tweet:', error.response.data);
    process.exit(-1);
  }
}*/

async function main() {
  const filePath = 'Video/newVideo.mp4'; // Cambia esto a la ruta de tu archivo
  const status = 'Aquí está mi tweet con un vídeo';
  const mediaId = await initVideo();
  if (mediaId) {
    //await postTweetWithMedia(mediaId, status);
    await appendVideo(filePath, mediaId);
    const media_last_id = await finalizeVideo(mediaId);
    await postVideo(media_last_id);
  }
}
main();


/*
async function input(prompt) {
  return new Promise((resolve, reject) => {
    readline.question(prompt, (out) => {
      readline.close();
      resolve(out);
    });
  });
}

async function requestToken() {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: requestTokenURL,
    method: 'POST'
  }));

  const req = await got(requestTokenURL, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

async function accessToken({
  oauth_token,
  oauth_token_secret
}, verifier) {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: accessTokenURL,
    method: 'POST'
  }));
  const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
  const req = await got(path, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    let result = '';
    stream.on("data", (d) => {
      result += d.toString();
    })
    stream.on("end", () => {
      resolve(result);
    })
    stream.on("error", () => {
      console.log('error')
      reject();
    })
  })
}

async function uploadMedia({
  oauth_token,
  oauth_token_secret
}) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret
  };

  const authHeader = oauth.toHeader(oauth.authorize({
    url: uploadMediaURL,
    method: 'POST'
  }, token));

  const mediaData = fs.readFileSync(pathToVideoFile);
  const req = await got(uploadMediaURL, {
    method: "POST",
    form: {
      media: mediaData.toString('base64')
    },
    headers: {
      Authorization: authHeader["Authorization"],
      'content-type': 'multipart/form-data'
    }
  });
  if (req.body) {
    return JSON.parse(req.body);
  } else {
    throw new Error('Unsuccessful media upload');
  }
}

async function getRequest({
  oauth_token,
  oauth_token_secret
}, media_id) {

  const token = {
    key: oauth_token,
    secret: oauth_token_secret
  };

  const authHeader = oauth.toHeader(oauth.authorize({
    url: endpointURL,
    method: 'POST'
  }, token));

  let reader = fs.createReadStream(pathToTextFile, {
    start: 23,
    end: 211
  });

  const data = {
    "text": await streamToString(reader),
    "media": {
      "media_ids": [media_id]
    }
  };

  const req = await got(endpointURL, {
    method: "POST",
    json: data,
    responseType: 'json',
    headers: {
      Authorization: authHeader["Authorization"],
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    }
  });
  if (req.body) {
    return req.body;
  } else {
    throw new Error('Unsuccessful request');
  }
}

(async () => {
  try {
    // Get request token
    const oAuthRequestToken = await requestToken();
    // Get authorization
    authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);
    console.log('Please go here and authorize:', authorizeURL.href);
    const pin = await input('Paste the PIN here: ');
    // Get the access token
    const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
    // Upload media
    const mediaUploadResponse = await uploadMedia(oAuthAccessToken);
    const media_id = mediaUploadResponse.media_id_string;
    // Make the request with the uploaded media
    const response = await getRequest(oAuthAccessToken, media_id);
    console.dir(response, {
      depth: null
    });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();*/