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
      case "/styles/readFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        readFileStyle(req, res);
        console.log(`--- End Case ${urlToRoute} Route --- `);
      case "/styles/updateFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route`);
        updateFileStyle(req, res);
        console.log(`--- Begin Case ${urlToRoute} Route`);
      case "/form-submission":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        switch (req.method) {
          case "POST":
            console.log(`Begin POST Method`);
            let postParams = new URLSearchParams(chunks.toString());
            processFormSubmissionPostRequest(req, res, postParams);
            console.log(`End POST Method`);
            break;
          case "GET":
            console.log(`Begin GET Method ${req.url}`);
            let getParams = new URLSearchParams(req.url);
            processFormSubmissionGetRequest(req, res, getParams);
            console.log(`End GET Method ${req.url}`);
            break;   
        }
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/form-submission-update-file":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        switch (req.method) {
          case "POST":
            console.log(`Begin POST Method`);
            console.log(`End POST Method`);
            break;
          case "GET":
            console.log(`Begin GET Method`);
            console.log(`End GET Method`);
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

// Serve stylesheet information for readFile response
function readFileStyle(req, res) {
  console.log(`--- Begin Function readFileStyle() ---`);
  const styleSheet = "readFileStyle.css";

  let fileStream = fs.createReadStream(`./styles/${styleSheet}`, "utf-8");
  let css = fs.readFileSync(`./styles/${styleSheet}`, "utf-8");
  res.writeHead(200, { "Content-Type": "text/css" });
  res.write(css);
  res.end();
  console.log(`--- End Function readFileStyle() ---`);
}
// Serve stylesheet information for updateFile response
function updateFileStyle(req, res) {
  console.log(`--- Begin Function updateFileStyle() ---`);
  const styleSheet = "updateFileStyle.css";

  let fileStream = fs.createReadStream(`./styles/${styleSheet}`, "utf-8");
  let css = fs.readFileSync(`./styles/${styleSheet}`, "utf-8");
  res.writeHead(200, { "Content-Type": "text/css" });
  res.write(css);
  res.end();
  console.log(`--- End Function updateFileStyle() ---`);
}


function processFormSubmissionPostRequest(req, res, postParams) {
  console.log(`--- Begin Function processPostRequest() ---`);
  console.log(`Request Body: ${postParams}`);
  const baseDir = "scratchPad";
  let selectOption = postParams.get("file-action");
  let fileName = postParams.get("file-name");
  switch (selectOption) {
    case "Read":
      // Does the file exist ?
      console.log(__dirname);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        renderReadFileResponse(req, res, fileName);
      } else {
        console.log(`${baseDir}/${fileName} Does not exist!`);
      }
      break;
    case "Add":
      // Add file then render index page
      break;
    case "Update":
      // Update file then render index page
      // Does the file exist ?
      console.log(__dirname);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        renderUpdateFileResponse(req, res, fileName);
      } else {
        console.log(`${baseDir}/${fileName} Does not exist!`);
      }
      break;
    case "Delete":
      // Delete file then render index page
      break;
  }
  console.log(`${selectOption}`);
  console.log(`--- End Function processPostRequest() ---`);
}

function formSumissionGetRequest(req, res, getParams) {

}

function renderReadFileResponse(req, res, fileName) {
  console.log(`--- Begin Function renderFileResponse() ---`);
  const template = fs.readFileSync(`./views/readFile.ejs`, "utf-8");
  const baseDir = "scratchPad";
  readFile(`${baseDir}/${fileName}`)
    .then(function (message) {
      let fileContents = message;
      let html = ejs.render(template, {
        fileName: fileName,
        fileContents: message,
      });
      console.log("here readFile" + message);
      res.write(html);
      res.end();
    })
    .catch(function (error) {
      console.log("An error occurred in function renderReadFileResponse readFile catch");
    });
  console.log(`--- End Function renderFileResponse() ---`);
}

function renderUpdateFileResponse(req, res, fileName) {
  console.log(`--- Begin Function renderFileResponse() ---`);
  const template = fs.readFileSync(`./views/updateFile.ejs`, "utf-8");
  const baseDir = "scratchPad";
  readFile(`${baseDir}/${fileName}`)
    .then(function (message) {
      let fileContents = message;
      let html = ejs.render(template, {
        fileName: fileName,
        fileContents: message,
      });
      console.log("here readFile" + message);
      res.write(html);
      res.end();
    })
    .catch(function (error) {
      console.log("An error occurred in function renderReadFileResponse readFile catch");
    });
  console.log(`--- End Function renderUpdateFileResponse() ---`);
}
