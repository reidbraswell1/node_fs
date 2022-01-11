//const http = require("http");
import http from "http";
import ejs from "ejs";
import fs from "fs";
import { readDir } from "./readDirs.js";

const serverPort = 3000;
let dirPath = "scratchPad";

export const server = http.createServer((req, res) => {
  const template = fs.readFileSync(`./views/index.ejs`, "utf-8");
  let listing = readDirs(dirPath) + "Test";
  console.log(`${listing}`);
  console.log(typeof listing);
  let html = ejs.render(template, { dirList: `Listing:${listing}Apple` });
  res.write(html);
  res.end();
});

server.listen(serverPort, function (callback) {
  console.log(
    "Server running at url http://" +
      require("os").hostname() +
      ":" +
      serverPort
  );
});
console.log(`Server running on port ${server.address().port}`);

function readDirs(path) {
  console.log(`Path ${path}`);
  let dirs = "";
  readDir(path)
    .then(function (message) {
      console.log(`${message}`);
      dirs = message.substring(message.indexOf(":")+2);
      console.log(dirs);
      return dirs;
    })
    .catch(function (error) {
      console.log(error);
    });
    //return dirs;
}
