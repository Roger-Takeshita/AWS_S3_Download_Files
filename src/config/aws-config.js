const AWS = require('aws-sdk');
const { printError } = require('../helper/print');

const awsConfig = require(process.env.AWS_CONFIG);
const key = process.argv[2] || 'a new key';
const profileConfig = awsConfig[key];

if (!profileConfig) printError(`Key not found, please add "${key}" to aws-config.json`);

AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: profileConfig.profile,
});

AWS.config.update({ region: profileConfig.region });
AWS.config.apiVersions = {
    s3: '2006-03-01',
    codebuild: '2016-10-06',
};

module.exports = {
    AWS,
    profileConfig,
};
