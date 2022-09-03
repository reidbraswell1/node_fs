//const fs = require("fs");
import fs from "fs";

/*   
 *   Helper funtion that calls fs.writeFile. This function
 *   returns a promise that is resolved if fs.writeFile does
 *   not return an error. If an error is returned then the
 *   promise is rejected.
 */
export function createFile(fileName, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fileName, data, 'utf-8', function(error) {
        reject(error);
    });
    resolve(`${fileName} written successfully!`);
  });
}
