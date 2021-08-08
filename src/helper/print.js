const chalk = require('chalk');

const printError = (errorMessage) => {
    console.log();
    console.log(chalk`    {bgRed  ERROR: } {red ${errorMessage}}`);
    console.log();
    process.exit(0);
};

module.exports = {
    printError,
};
