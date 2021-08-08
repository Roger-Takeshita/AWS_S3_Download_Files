const { AWS, profile } = require('./config/aws-config');
const { printError } = require('./helper/print');

const getFiles = async () => {
    const params = {
        Bucket: profile.bucket,
        Delimiter: '/',
        Prefix: profile.path || '',
        MaxKeys: 6,
    };

    try {
        const s3 = new AWS.S3();
        const files = await s3.listObjectsV2(params).promise();
        const urls = [];
        let firstItem = true;
        let folder = '';

        await files.Contents.reduce(async (promise, file) => {
            await promise;

            const urlParams = {
                Bucket: profile.bucket,
                Key: file.Key,
                Expires: 10,
            };

            if (firstItem) {
                firstItem = false;
                folder = file.Key;
            } else {
                const url = await s3.getSignedUrlPromise('getObject', urlParams);
                urls.push({ filename: file.Key.replace(folder, ''), url });
            }
        }, Promise.resolve());

        return urls;
    } catch (error) {
        if (error.code === 'AccessDenied') {
            return printError(`S3 - Looks like you don't have permission to access ${profile.bucket} bucket.`);
        }

        return printError(`S3 - ${error}`);
    }
};

module.exports = {
    getFiles,
};
