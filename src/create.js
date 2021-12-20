//const fs = require("fs");
import fs from "fs";

export function createFile(fileName, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fileName, data, 'utf-8', function(error) {
        reject(error);
    });
    resolve(`${fileName} written successfully!`);
  });
}
