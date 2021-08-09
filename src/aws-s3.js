const fs = require('fs');
const os = require('os');
const util = require('util');
const { AWS, profileConfig } = require('./config/aws-config');
const { printError, printSuccess } = require('./helper/print');

const getFilesURL = async () => {
    const s3 = new AWS.S3();
    const filesArray = [];
    let firstItem = true;

    const params = {
        Bucket: profileConfig.bucket,
        Delimiter: '/',
        Prefix: profileConfig.path || '',
    };

    try {
        const files = await s3.listObjectsV2(params).promise();

        await files.Contents.reduce(async (promise, file) => {
            await promise;

            const urlParams = {
                Bucket: profileConfig.bucket,
                Key: file.Key,
                Expires: 20,
            };

            if (firstItem) {
                firstItem = false;
            } else {
                const url = await s3.getSignedUrlPromise('getObject', urlParams);
                const key = file.Key.replace(profileConfig.path, '');

                filesArray.push({ filename: key, url });
            }
        }, Promise.resolve());

        return filesArray;
    } catch (error) {
        if (error.code === 'AccessDenied') {
            return printError(`S3 - Looks like you don't have permission to access ${profileConfig.bucket} bucket.`);
        }

        printError(`S3 - ${error}`);
    }
};

const getFilesS3 = async () => {
    const s3 = new AWS.S3();
    let firstItem = true;

    const params = {
        Bucket: profileConfig.bucket,
        Delimiter: '/',
        Prefix: profileConfig.path || '',
    };

    try {
        const files = await s3.listObjectsV2(params).promise();

        const filesArray = files.Contents.map((file) => {
            if (firstItem) {
                firstItem = false;
            } else {
                return file.Key.replace(profileConfig.path, '');
            }
        });

        return filesArray;
    } catch (error) {
        if (error.code === 'AccessDenied') {
            return printError(`S3 - Looks like you don't have permission to access ${profileConfig.bucket} bucket.`);
        }

        printError(`S3 - ${error}`);
    }
};

const downloadFilesS3 = async (files) => {
    const s3 = new AWS.S3();
    const writeFile = util.promisify(fs.writeFile);
    let folder = '';

    if (process.platform === 'win32') {
        folder = `${process.env.USERPROFILE}/downloads`;
    } else {
        folder = `${os.homedir()}/downloads`;
    }

    try {
        await files.reduce(async (promise, file) => {
            await promise;

            const params = {
                Bucket: profileConfig.bucket,
                Key: `${profileConfig.path}${file}`,
            };

            const data = await s3.getObject(params).promise();
            await writeFile(`${folder}/${file}`, data.Body);
        }, Promise.resolve());

        printSuccess('Files downloaded successfully!');
    } catch (error) {
        if (error.code === 'AccessDenied') {
            return printError(`S3 - Looks like you don't have permission to access ${profileConfig.bucket} bucket.`);
        }

        printError(`S3 - ${error}`);
    }
};

module.exports = {
    getFilesURL,
    getFilesS3,
    downloadFilesS3,
};
