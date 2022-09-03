//const fs = require("fs");
import fs from "fs";

/*   
 *   Helper funtion that calls fs.writeFile. This function
 *   returns a promise that is resolved if fs.writeFile does
 *   not return an error. If an error is returned then the
 *   promise is rejected. It is also rejected if the file does
 *   not exist.
 */
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
