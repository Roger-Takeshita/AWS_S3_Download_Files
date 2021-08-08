const inquirer = require('inquirer');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus'));

const Phone = [
    {
        name: 'XiaoMi',
        value: 'MI',
        short: 'MI',
        disabled: false,
        type: 'cellphone',
    },
    {
        name: 'Google',
        value: 'Google',
        short: 'Google',
        disabled: true,
        type: 'cellphone',
    },
    {
        name: 'HUAWEI',
        value: 'HUAWEI',
        short: 'HUAWEI',
        disabled: false,
        type: 'cellphone',
    },
    {
        name: 'iPhone',
        value: 'iPhone',
        short: 'iPhone',
        disabled: false,
        type: 'cellphone',
    },
];

const iPhone = [
    { name: 'iPhone 6s', type: 'name', disabled: true },
    { name: 'iPhone 8 plus', type: 'name', disabled: true },
    { name: 'iPhone X', type: 'name', disabled: true },
];

const XiaoMi = [
    { name: 'MI note', type: 'name' },
    { name: 'MI plus', type: 'name' },
    { name: 'Mi 3', type: 'name' },
    { name: 'Mi 4', type: 'name' },
    { name: 'Mi 5', type: 'name' },
    { name: 'Mi 6', type: 'name' },
    { name: 'Mi 8', type: 'name' },
];

const MiNote = [{ name: 'Mi note I', type: 'name' }, { name: 'Mi note II' }, { name: 'Mi note III' }];

const Note = [{ name: 1 }, { name: 2 }];

const MiPlus = [{ name: 'Mi 3 plus' }, { name: 'Mi 4 plus' }, { name: 'Mi 5 plus' }];

inquirer
    .prompt([
        {
            type: 'checkbox-plus',
            name: 'phone',
            message: 'select cellphone?',
            pageSize: 4,
            highlight: true,
            default: ['iPhone', 'MI'],
            footer: 'move up/down to select',
            header: 'press space to select',
            searching: 'searching....',
            noresult: 'nothing..',
            validate: (answer) => {
                if (answer.length === 0) {
                    return 'You must choose at least one phone.';
                }

                return true;
            },
            source: () => Promise.resolve(Phone),
            subsource: (choice) => {
                if (choice.name === 'iPhone') {
                    return Promise.resolve(iPhone);
                }
                if (choice.name === 'XiaoMi') {
                    return Promise.resolve(XiaoMi);
                }
                if (choice.name === 'MI note') {
                    return Promise.resolve(MiNote);
                }
                if (choice.name === 'MI plus') {
                    return Promise.resolve(MiPlus);
                }
                if (choice.name === 'Mi note I') {
                    return Promise.resolve(Note);
                }
                return Promise.resolve([]);
            },
        },
    ])
    .then((answers) => {
        console.log(answers.phone);
    })
    .catch(console.log);
