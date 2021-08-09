const chalk = require('chalk');
const { fgRGB, bgRGB } = require('./colors');

const printError = (message) => {
    console.log();
    console.log(chalk`    {${bgRGB.RDD}.${fgRGB.WHT}.bold  ERROR: } {${fgRGB.RD} ${message}}`);
    console.log();
    process.exit(0);
};

const printSuccess = (message) => {
    console.log();
    console.log(chalk`    {${bgRGB.GND}.${fgRGB.WHT}.bold  SUCCESS: } {${fgRGB.GND} ${message} }`);
    console.log();
};

module.exports = {
    printError,
    printSuccess,
};
