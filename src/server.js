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

  // Handle Response Error's
  res.on("error", (err) => {
    console.log(`Response Error - ${err}`);
    res.writeHead(500, { "Content-Type": "text/html" });
    renderErrorPage(req, res, err);
  });

  // Assemble data from body of request
  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", () => {
    console.log(`Chunks`);
    console.log(chunks.toString());
    switch (urlToRoute) {
      case "/":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        renderHomePage(req, res);
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/indexStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        indexStyle(req, res);
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/form-submission":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        switch (req.method) {
          case "POST":
            console.log(`Begin POST Method`);
            processPostRequest(req,res, chunks);
            console.log(`End POST Method`);
            break;
          case "GET":
            console.log("Begin GET Method");
            break;
        }
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
    }
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

function renderHomePage(req, res) {
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
          console.log("here" + message);
          res.write(html);
          res.end();
        })
        .catch(function (error) {});

      //      res.write(html)
      //    res.end()
    })
    .catch(function (error) {});
}

// Serve stylesheet information for homepage
function indexStyle(req, res) {
  console.log(`--- Begin Function indexStyle() ---`);
  const styleSheet = "indexStyle.css";

  let fileStream = fs.createReadStream(`./styles/${styleSheet}`, "utf-8");
  let css = fs.readFileSync(`./styles/${styleSheet}`, "utf-8");
  res.writeHead(200, { "Content-Type": "text/css" });
  res.write(css);
  res.end();
  console.log(`--- End Function indexStyle() ---`);
}

function processPostRequest(req, res, reqBody) {
  console.log(`--- Begin Function processPostRequest() ---`);
  console.log(`Request Body: ${reqBody}`);
  let params = new URLSearchParams(reqBody.toString());
  let selectOption = params.get("file-action");
  switch(selectOption) {
    case "Read":
      break;
    case "Add":
      break;
    case "Update":
      break;
    case "Delete":
      break;
  }
  console.log(`${selectOption}`);
  console.log(`--- End Function processPostRequest() ---`);
}
