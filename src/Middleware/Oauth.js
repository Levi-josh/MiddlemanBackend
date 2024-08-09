const axios = require('axios');

const checkGoogleAccessToken = async (req, res, next) => {
    // const accessToken = req.headers.authorization;
  
    // if (!accessToken) {
    //   return res.status(401).json({ message: 'Access token is missing' });
    // }
  
    try {
      // Make a request to Google's token info endpoint to validate the access token
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
        params: { access_token: accessToken }
      });
  
      // If the token is valid, proceed to the next middleware
      next();
    } catch (error) {
      // If there's an error or the token is invalid, return an error response
      console.error('Error validating access token:', error.response.data);
      return res.status(401).json({ message: 'Invalid access token' });
    }
  };

  module.exports = checkGoogleAccessToken 