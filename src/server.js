//const http = require("http");
import http from "http";
import ejs from "ejs";
import fs from "fs";
import { readDir } from "./readDirs.js";

import { readFile } from "./readFile.js";
import { runInNewContext } from "vm";

const serverPort = 3000;
let dirPath = "scratchPad";

export const server = http.createServer((req, res) => {
  console.log("Begin createServer");
  
  let urlToRoute = "";
  let chunks = [];
  // Get the base url without parameters to route the request
  if (req.url.indexOf("?") == -1) {
    urlToRoute = req.url;
  } else {
    urlToRoute = req.url.substring(0, req.url.indexOf("?"));
  }

  let postObject;
  let data = "";
  // Handle Request Error's
  req.on("error", (err) => {
    console.log(`Request Error - ${err}`);
    res.writeHead(400, { "Content-Type": "text/html" });
    renderErrorPage(req, res, error);
  });

  
  const template = fs.readFileSync(`./views/index.ejs`, "utf-8");
  readDir(dirPath)
    .then(function (message) {
      // Omit "Read Directories: " text
      let listing = message.substring(message.indexOf(":") + 2);
      // Replace all commas with new lines
      listing = listing.replace(/,/g, "\n");
      
      readFile("scratchPad/test-file_1.html")
        .then(function (message) {
          let fileContents = message;
          let html = ejs.render(template, {
            dirPath: dirPath,
            dirList: listing,
            fileContents: message,
          });
          console.log("here" + message)
          res.write(html)
          res.end()
        })
        .catch(function (error) {

        })
        
//      res.write(html)
  //    res.end()
      })
    .catch(function (error) {

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
