//const fs = require("fs");
import fs from "fs";

export function appendFile(fileName, data) {
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(fileName)) {
      console.log(`${fileName} exists updating`);
      fs.appendFile(fileName, data, "utf-8", function (err) {
        if (err) {
          reject(`Unable to append file ${fileName}`);
        }
        else {
            resolve(`${fileName} was appended to.`);
        }
      });
    }
    else {
        reject(`Unable to append file. ${fileName} does not exist!`);
    }
  });
}
