const fs = require('fs');
const os = require('os');
const util = require('util');
const { AWS, profileConfig } = require('./config/aws-config');
const { printError, printSuccess } = require('./helper/print');

const s3 = new AWS.S3();
const writeFile = util.promisify(fs.writeFile);

const getFiles = async (array, params) => {
    const awsFolder = `${profileConfig.folder}/`;
    const files = await s3.listObjectsV2(params).promise();
    const newParams = params;
    const filesArray = [];

    files.Contents.forEach((file) => {
        const filename = file.Key.replace(awsFolder, '');
        if (filename) filesArray.push(filename);
    });

    if (!files.IsTruncated) return [...array, ...filesArray];
    newParams.ContinuationToken = files.NextContinuationToken;

    return getFiles([...array, ...filesArray], newParams);
};

const getFilesURL = async () => {
    const awsFolder = `${profileConfig.folder}/`;
    const filesArray = [];
    let firstItem = true;

    const params = {
        Bucket: profileConfig.bucket,
        Delimiter: '/',
        Prefix: awsFolder || '',
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
                const key = file.Key.replace(awsFolder, '');

                filesArray.push({ filename: key, url });
            }
        }, Promise.resolve());

        return filesArray;
    } catch (error) {
        if (error.code === 'AccessDenied') {
            printError(`S3 - Looks like you don't have permission to access ${profileConfig.bucket} bucket.`);
        }

        printError(`S3 - ${error}`);
    }
};

const getFilesS3 = async () => {
    const awsFolder = `${profileConfig.folder}/`;

    const params = {
        Bucket: profileConfig.bucket,
        Delimiter: '/',
        Prefix: awsFolder || '',
    };

    try {
        return await getFiles([], params);
    } catch (error) {
        if (error.code === 'AccessDenied') {
            printError(`S3 - Looks like you don't have permission to access ${profileConfig.bucket} bucket.`);
        }

        printError(`S3 - ${error}`);
    }
};

const downloadFilesS3 = async (files) => {
    const awsFolder = `${profileConfig.folder}/`;
    let localFolder = '';

    if (process.platform === 'win32') {
        localFolder = `${process.env.USERPROFILE}/downloads`;
    } else {
        localFolder = `${os.homedir()}/downloads`;
    }

    try {
        await files.reduce(async (promise, file) => {
            await promise;

            const params = {
                Bucket: profileConfig.bucket,
                Key: `${awsFolder}${file}`,
            };

            const data = await s3.getObject(params).promise();
            await writeFile(`${localFolder}/${file}`, data.Body);
        }, Promise.resolve());

        printSuccess('Files have been successfully downloaded', localFolder);
    } catch (error) {
        if (error.code === 'AccessDenied') {
            printError(`S3 - Looks like you don't have permission to access ${profileConfig.bucket} bucket.`);
        }

        printError(`S3 - ${error}`);
    }
};

module.exports = {
    getFilesURL,
    getFilesS3,
    downloadFilesS3,
};
