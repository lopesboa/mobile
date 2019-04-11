const fs = require('fs');

const {S3} = require('aws-sdk');

const {
  ACCESS_KEY_ID: accessKeyId,
  SECRET_ACCESS_KEY: secretAccessKey,
  KEYSTORE_FILE: keystoreFile
} = process.env || {};

if (!accessKeyId) {
  throw new Error('ACCESS_KEY_ID environment variable missing.');
}

if (!secretAccessKey) {
  throw new Error('SECRET_ACCESS_KEY environment variable missing.');
}

if (!keystoreFile) {
  throw new Error('KEYSTORE_FILE environment variable missing.');
}

const s3 = new S3({
  accessKeyId,
  secretAccessKey
});

const params = {
  Bucket: 'secure.coorpacademy.com',
  Key: 'cert/mobile/coorpacademy.jks'
};

// eslint-disable-next-line no-console
console.log('Pulling this file on Amazon S3:', params);

s3.getObject(params, (e, data) => {
  if (e) {
    throw e;
  }

  fs.writeFileSync(keystoreFile, data.Body);
});
