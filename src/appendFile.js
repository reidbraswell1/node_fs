//const fs = require("fs");
import fs from "fs";

/*   
 *   Helper funtion that calls fs.append. This function
 *   returns a promise that is resolved if fs.append does
 *   not return an error. If an error is returned then the
 *   promise is rejected. It is also rejected if the file does
 *   not exist.
 */
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
