const { AWS, profileConfig } = require('./config/aws-config');
const { printError } = require('./helper/print');

const getFiles = async () => {
    const params = {
        Bucket: profileConfig.bucket,
        Delimiter: '/',
        Prefix: profileConfig.path || '',
    };

    try {
        const s3 = new AWS.S3();
        const files = await s3.listObjectsV2(params).promise();
        const filesArry = [];
        let firstItem = true;

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

                filesArry.push({ filename: key, url });
            }
        }, Promise.resolve());

        return filesArry;
    } catch (error) {
        if (error.code === 'AccessDenied') {
            return printError(`S3 - Looks like you don't have permission to access ${profileConfig.bucket} bucket.`);
        }

        return printError(`S3 - ${error}`);
    }
};

module.exports = {
    getFiles,
};
