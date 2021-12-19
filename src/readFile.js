//const fs = require("fs");
import fs from "fs";

export const readFile = function(fileName) {
    if(fs.existsSync(fileName)) {
        console.log(`${fileName} exists.`);
        fs.readFile(fileName, function (err, data) {
            if(err) {
                console.log(`An error has occurred reading file ${fileName}.`);
                console.log(`Error: ${err}`);
                throw err;
            }
            if(data) {
                console.log(`File ${fileName} successfully read`);
                console.log(`Data ${data.toString()}`);
                return data.toString();
            }
        });
    }
    else {
        console.log(`${fileName} does not exist.`);
    }
}