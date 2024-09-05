const admin = require('firebase-admin');
// // const path = require('path')
// const fs = require('fs');

// const serviceAccountPath = path.resolve(__dirname, '../../../firebasecred/Serviceaccout.json');
// const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  storageBucket: "middleman-5eccd.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };