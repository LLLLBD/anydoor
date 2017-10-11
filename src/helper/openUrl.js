const { exec } = require('child_process');

module.exports = url => {
    switch (process.platform) {
        case 'darwin':
            exec(`open ${url}`);    //mac
            break;
        case 'win32':
            exec(`start ${url}`);   //win
            break;
    }
}
