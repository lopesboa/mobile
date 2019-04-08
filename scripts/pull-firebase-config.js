// @flow

const fs = require('fs');
const path = require('path');

const {S3} = require('aws-sdk');

const IOS_CONFIG_FILE = path.resolve('ios', 'GoogleService-Info.plist');
const ANDROID_CONFIG_FILE = path.resolve('android', 'app', 'google-services.json');

const {ACCESS_KEY_ID: accessKeyId, SECRET_ACCESS_KEY: secretAccessKey} = process.env || {};

if (!accessKeyId) {
  throw new Error('ACCESS_KEY_ID environment variable missing.');
}

if (!secretAccessKey) {
  throw new Error('SECRET_ACCESS_KEY environment variable missing.');
}

const pullConfigFile = (key: string, outputFile: string) => {
  const s3 = new S3({
    accessKeyId,
    secretAccessKey
  });

  const params = {
    Bucket: 'secure.coorpacademy.com',
    Key: key
  };

  // eslint-disable-next-line no-console
  console.log('Pulling this file on Amazon S3:', params);

  s3.getObject(params, (e, data) => {
    if (e) {
      throw e;
    }

    fs.writeFileSync(outputFile, data.Body);
  });
};

pullConfigFile('firebase/mobile/GoogleService-Info.plist', IOS_CONFIG_FILE);
pullConfigFile('firebase/mobile/google-services.json', ANDROID_CONFIG_FILE);
