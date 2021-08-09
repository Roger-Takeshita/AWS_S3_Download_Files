#!/usr/bin/env node

const { getFilesS3, downloadFilesS3 } = require('./aws-s3');
const { printError } = require('./helper/print');
const { inquirerFiles } = require('./helper/inquirer');

const getBucketFiles = async () => {
    if (process.argv.length > 2 && process.argv.length <= 3) {
        const files = await getFilesS3();

        files.sort((a, b) => a.localeCompare(b));
        const selectedFiles = await inquirerFiles(files);
        downloadFilesS3(selectedFiles);
    } else {
        printError('Please provide an aws profile.');
    }
};

getBucketFiles();
