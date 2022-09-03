//const fs = require("fs");
import fs from "fs";
import { realpath } from "fs/promises";

/*   
 *   Helper funtion that calls fs.unlink. This function
 *   returns a promise that is resolved if fs.unlink does
 *   not return an error. If an error is returned then the
 *   promise is rejected. It is also rejected if the file does
 *   not exist.
 */
export function deleteFile(fileName) {
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(fileName)) {
      fs.unlink(fileName, function (err) {
        if (err) {
          console.log(`${fileName} could NOT be removed.`);
          console.log(`Unlink error: ${err}`);
          reject(error);
        }
      });
      resolve(`${fileName} was successfully deleted.`);
    } else {
      console.log(`${fileName} NOT found for deletion.`);
      reject(`${fileName} NOT found for deletion.`);
    }
  });
}
