const fs = require('fs');

const readHTMLFile = (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
        if (err) {
            callback(err);
        } else {
            callback(null, html);
        }
    });
};

module.exports = {
    readHTMLFile,
};
