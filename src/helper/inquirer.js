const inquirer = require('inquirer');
const { printError } = require('./print');
const { profileConfig } = require('../config/aws-config');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus'));

const inquirerFiles = async (files) => {
    const menu = [];
    const maxFiles = profileConfig.limit;

    for (let i = 0; i < maxFiles; i += 1) {
        menu.push({
            name: files[i],
            value: files[i],
            disabled: false,
            type: 'url',
        });
    }

    try {
        const answers = await inquirer.prompt([
            {
                type: 'checkbox-plus',
                name: 'files',
                message: 'Select your files:',
                pageSize: profileConfig.limit,
                highlight: true,
                footer: 'move up/down to select',
                header: 'press space to select',
                searching: 'searching....',
                noresult: 'nothing..',
                validate: (answer) => {
                    if (answer.length === 0) return 'You must choose at least one file.';
                    return true;
                },
                source: () => Promise.resolve(menu),
            },
        ]);
        return answers.files;
    } catch (error) {
        return printError(error);
    }
};

module.exports = {
    inquirerFiles,
};
