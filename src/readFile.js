//const fs = require("fs");
import fs from "fs";

/*   
 *   Helper funtion that calls fs.append. This function
 *   returns a promise that is resolved if fs.append does
 *   not return an error. If an error is returned then the
 *   promise is rejected. It is also rejected if the file does
 *   not exist.
 */
export const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(fileName)) {
      console.log(`${fileName} exists. Reading file.`);
      fs.readFile(fileName, function (err, data) {
        if (err) {
          console.log(`An error has occurred reading file ${fileName}.`);
          console.log(`Error: ${err}`);
          reject(err);
        }
        if (data) {
          console.log(`File ${fileName} successfully read`);
          resolve(data.toString());
        }
      });
    } else {
      console.log(`${fileName} does not exist.`);
      reject(`${fileName} does not exit.`);
    }
  });
};
