import fs from "fs";

/*   
 *   Helper funtion that calls fs.readdir. This function
 *   returns a promise that is resolved if fs.readdir does
 *   not return an error. If an error is returned then the
 *   promise is rejected. It is also rejected if the path does
 *   not exist.
 */
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
