#!/usr/bin/env node

const { getFilesS3, downloadFilesS3 } = require('./aws-s3');
const { printError } = require('./helper/print');
const { inquirerFiles } = require('./helper/inquirer');
const { profileConfig } = require('./config/aws-config');

const getBucketFiles = async () => {
    try {
        const files = await getFilesS3();

        if (profileConfig.sortResult === 'desc') files.sort((a, b) => b.localeCompare(a));
        const selectedFiles = await inquirerFiles(files);
        await downloadFilesS3(selectedFiles);
    } catch (error) {
        printError(error);
    }
};

getBucketFiles();
