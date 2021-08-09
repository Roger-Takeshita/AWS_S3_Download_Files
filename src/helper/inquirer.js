const inquirer = require('inquirer');
const { printError } = require('./print');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus'));

const inquirerFiles = async (files) => {
    const menu = [];
    const maxFiles = 10;

    for (let i = 0; i < maxFiles; i += 1) {
        menu.push({
            name: files[i].filename,
            value: files[i].url,
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
                pageSize: 10,
                highlight: true,
                default: [menu[0].name],
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
