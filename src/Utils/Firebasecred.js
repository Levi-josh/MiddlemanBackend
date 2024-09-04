const admin = require('firebase-admin');
// const path = require('path')
// const fs = require('fs');

// const serviceAccountPath = path.resolve(__dirname, '../../../firebasecred/Serviceaccout.json');
// const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "middleman-5eccd.appspot.com",
});

// Export the configured admin and bucket
const bucket = admin.storage().bucket();

module.exports = { admin, bucket };