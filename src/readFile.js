//const fs = require("fs");
import fs from "fs";

// Async function returns a promise
export const readFile = function (fileName) {
  // Return a promise that is resolved if when fs.readFile returns data read from 
  // the file but rejected if the file does not exist or there is a problem 
  // reading the file.
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
