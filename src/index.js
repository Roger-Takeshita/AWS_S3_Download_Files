#!/usr/bin/env node

const { getFiles } = require('./aws-s3');
const { printError } = require('./helper/print');

const getBucketFiles = async () => {
    if (process.argv.length > 2 && process.argv.length <= 3) {
        const files = await getFiles();
        console.log(files);
    } else {
        printError('Please provide an aws profile.');
        console.log();
    }
};

getBucketFiles();
