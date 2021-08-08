#!/usr/bin/env node

const { getFiles } = require('./aws-s3');
const { printError } = require('./helper/print');

const getBucketFiles = async () => {
    if (process.argv.length > 2 && process.argv.length <= 3) {
        const files = await getFiles();
        files.sort((a, b) => a.filename.localeCompare(b.filename));
        for (let i = 0; i < 5; i += 1) {
            console.log(files[i]);
        }
    } else {
        printError('Please provide an aws profile.');
        console.log();
    }
};

getBucketFiles();
