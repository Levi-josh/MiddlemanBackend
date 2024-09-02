const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Parse GOOGLE_APPLICATION_CREDENTIALS from environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "middleman-5eccd.appspot.com",
});

// Export the configured admin and bucket
const bucket = admin.storage().bucket();

module.exports = { admin, bucket };