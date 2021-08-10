#!/usr/bin/env node

const { getFilesS3, downloadFilesS3 } = require('./aws-s3');
const { printError } = require('./helper/print');
const { inquirerFiles } = require('./helper/inquirer');
const { profileConfig } = require('./config/aws-config');

const getBucketFiles = async () => {
    try {
        const filter = process.argv[3];
        let files = await getFilesS3();

        if (profileConfig.sortResult === 'desc') files.sort((a, b) => b.localeCompare(a));
        if (filter) {
            const re = new RegExp(filter, 'gi');
            files = files.filter((item) => item.match(re));
        }

        const selectedFiles = await inquirerFiles(files);
        await downloadFilesS3(selectedFiles);
    } catch (error) {
        printError(error);
    }
};

getBucketFiles();
