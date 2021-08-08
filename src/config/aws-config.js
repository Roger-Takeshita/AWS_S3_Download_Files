const AWS = require('aws-sdk');
const profiles = require('./profiles.json');
const { printError } = require('../helper/print');

const profileName = process.argv[2] || 'a new profile';
const profile = profiles[profileName];

if (!profile) printError(`Profile not found, please add ${profileName} to profiles.json`);

AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: profileName,
});

AWS.config.update({ region: profile.region });
AWS.config.apiVersions = {
    s3: '2006-03-01',
    codebuild: '2016-10-06',
};

module.exports = {
    AWS,
    profile,
};
