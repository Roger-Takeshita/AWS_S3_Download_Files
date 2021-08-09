#!/usr/bin/env node

const { getFiles } = require('./aws-s3');
const { printError } = require('./helper/print');
const { inquirerFiles } = require('./helper/inquirer');

const getBucketFiles = async () => {
    if (process.argv.length > 2 && process.argv.length <= 3) {
        const files = await getFiles();

        files.sort((a, b) => a.filename.localeCompare(b.filename));
        const selectedFiles = await inquirerFiles(files);
        console.log(selectedFiles);
    } else {
        printError('Please provide an aws profile.');
    }
};

getBucketFiles();
