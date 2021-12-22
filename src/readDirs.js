import fs from "fs";

export function readDir(path) {
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(path)) {
      fs.readdir(path, "utf-8", function (err, files) {
        if (err) {
          reject(err);
        }
        resolve(`Read Directories: ${files}`);
      });
    } else {
        reject(`${dir} not found`);
    }
  });
}
