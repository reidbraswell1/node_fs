//const fs = require("fs");
import fs from "fs";

export function updateFile(fileName, data) {
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(fileName)) {
      console.log(`${fileName} exists updating`);
      fs.writeFile(fileName, data, "utf-8", function (err) {
        if (err) {
          reject(`Unable to update file ${fileName}`);
        }
        else {
            resolve(`${fileName} was updated`);
        }
      });
    }
    else {
        reject(`Unable to update file. ${fileName} does not exist`);
    }
  });
}
