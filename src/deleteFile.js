//const fs = require("fs");
import fs from "fs";
import { realpath } from "fs/promises";

export function deleteFile(fileName) {
  // Return a promise that is resolved if when fs.unlink returns without an error.
  // If an error is returned reject with the error message.
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
