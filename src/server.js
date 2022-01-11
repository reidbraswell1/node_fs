//const http = require("http");
import http from "http";
import ejs from "ejs";
import fs from "fs";
import { readDir } from "./readDirs.js";

const serverPort = 3000;
let dirPath = "scratchPad";

export const server = http.createServer((req, res) => {
  const template = fs.readFileSync(`./views/index.ejs`, "utf-8");
  readDir(dirPath)
  .then(function (message) {
    // Omit "Read Directories: " text
    let listing = message.substring(message.indexOf(":")+2);
    // Replace all commas with new lines
    listing = listing.replace(/,/g,"\n");
    let html = ejs.render(template, { dirPath: dirPath, dirList: listing });
    res.write(html);
    res.end();
  })
  .catch(function (error) {
    console.log(error);
  });
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