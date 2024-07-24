const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');
// Reemplaza estos valores con tus propias credenciales de Twitter

const consumerKey = 'i0NVGo12wixVEUWxMB7YToN0v';
const consumerSecret = 'tzqRcGPsgEntD5hVX1T1l5ko2xgHGEX8FMqx1dO19jQyimtaAf';
const accessToken = '1811327010787971073-oUTun779t0evj1LmNY6TY5gOcd0lum';
const accessTokenSecret = 'z79zZ8qHQYIdhrlAHcLFhwYRXKPaitq4GzxcsUrteMYgw';

const oauth = OAuth({
  consumer: {
    key: consumerKey,
    secret: consumerSecret,
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
async function verifyCredentials() {
  const url = 'https://api.twitter.com/1.1/account/verify_credentials.json';
  const request_data = {
    url: url,
    method: 'GET',
  };
  const headers = oauth.toHeader(oauth.authorize(request_data, token));
  try {
    const response = await axios.get(url, { headers });
    console.log('Authenticated as:', response.data.screen_name);
  } catch (error) {
    console.error('Error verifying credentials:', error.response.data);
  }
}
verifyCredentials();