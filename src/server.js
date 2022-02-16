//const http = require("http");
import http from "http";
import ejs from "ejs";
import fs from "fs";
import { readDir } from "./readDirs.js";

import { readFile } from "./readFile.js";
import { runInNewContext } from "vm";
import { createFile } from "./createFile.js";

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
        serveStyleSheets(req, res, "indexStyle.css");
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/readFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        serveStyleSheets(req, res, "readFileStyle.css");
        console.log(`--- End Case ${urlToRoute} Route --- `);
      case "/styles/addFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        serveStyleSheets(req, res, "addFileStyle.css");
        console.log(`--- End Case ${urlToRoute} Route --- `);
      case "/styles/updateFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route`);
        serveStyleSheets(req, res, "updateFileStyle.css");
        console.log(`--- Begin Case ${urlToRoute} Route`);
      case "/form-submission":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        switch (req.method) {
          case "POST":
            console.log(`Begin POST Method`);
            let postParams = new URLSearchParams(chunks.toString());
            processFormSubmissionRequest(req, res, postParams);
            console.log(`End POST Method`);
            break;
          case "GET":
            console.log(`Begin GET Method ${req.url}`);
            let getParams = new URLSearchParams(req.url);
            processFormSubmissionRequest(req, res, getParams);
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
            let postParams = new URLSearchParams(chunks.toString());
            processFormSubmissionUpdateFileRequest(req, res, postParams);
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

// Serve stylesheets
function serveStyleSheets(req, res, stylesheet) {
  console.log(`---Begin Function serveStyleSheets() ---`);
  res.writeHead(200, { "Content-Type": "text/css" });
  switch (stylesheet) {
    case "indexStyle.css": 
      {
        let fileStream = fs.createReadStream(`./styles/indexStyle.css`, "utf-8");
        let css = fs.readFileSync(`./styles/indexStyle.css`, "utf-8");
        res.write(css);
      }
      break;
    case "addFileStyle.css":
      {
        let fileStream = fs.createReadStream(`./styles/addFileStyle.css`, "utf-8");
        let css = fs.readFileSync(`./styles/addFileStyle.css`, "utf-8");
        res.write(css);
      }
      break;
    case "readFileStyle.css":
      {
        let fileStream = fs.createReadStream(`./styles/readFileStyle.css`, "utf-8");
        let css = fs.readFileSync(`./styles/readFileStyle.css`, "utf-8");
        res.write(css);
        break;
      }
    case "updateFileStyle.css":
      {
        let fileStream = fs.createReadStream(`./styles/updateFileStyle.css`, "utf-8");
        let css = fs.readFileSync(`./styles/updateFileStyle.css`, "utf-8");
        res.write(css);
      }
      break;
  }
  res.end();
  console.log(`---End Function serveStyleSheets() ---`);
}

function processFormSubmissionRequest(req, res, postParams) {
  console.log(`--- Begin Function processPostRequest() ---`);
  console.log(`Request Body: ${postParams}`);
  const baseDir = "scratchPad";
  let selectOption = postParams.get("file-action");
  let fileName = postParams.get("file-name");
  switch (selectOption) {
    case "Read":
      // Does the file exist ?
      console.log(`--- Begin form-submission Case Read ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        renderReadFileResponse(req, res, fileName);
      } else {
        console.log(`${baseDir}/${fileName} Does not exist!`);
      }
      console.log(`--- End form-submission Case Read ---`);
      break;
    case "Add":
      // Add file then render index page
      console.log(`--- Begin form-submission Case Add ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
      } else {
        console.log(`${baseDir}/${fileName} Does not exist!`);
        renderAddFileResponse(req, res, fileName);
      }
      console.log(`--- End form-submission Case Add ---`);
      break;
    case "Update":
      // Update file then render index page
      // Does the file exist ?
      console.log(`--- Begin form-submission Case Update ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        renderUpdateFileResponse(req, res, fileName);
      } else {
        console.log(`${baseDir}/${fileName} Does not exist!`);
      }
      console.log(`--- End form-submission Case Update ---`)
      break;
    case "Delete":
      // Delete file then render index page
      break;
  }
  console.log(`${selectOption}`);
  console.log(`--- End Function processPostRequest() ---`);
}

function processFormSubmissionUpdateFileRequest(req, res, postParams) {
  console.log(`--- Begin Function processFormSubmissionUpdateFileRequest() ---`);
  let fileName = postParams.get("file-name");
  console.log(`File Name = ${fileName}`);
  let fileContents = postParams.get("file-contents");
  console.log(`File Contents = ${fileContents}`);
  const baseDir = "scratchPad";
  createFile(`${baseDir}/${fileName}`, fileContents) 
    .then(function (message) {
      res.writeHead(302, {
        location: "/",
      });
      res.end();
  
  })
    .catch(function (error) {

  });
  console.log(`--- End Function processFormSubmissionUpdateFileRequest() ---`);
  
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

function renderAddFileResponse(req, res, fileName) {
  console.log(`--- Begin Function renderAddFileResponse() ---`);
  const template = fs.readFileSync(`./views/addFile.ejs`, "utf-8");
  const baseDir = "scratchPad";
  let html = ejs.render(template, {
    fileName: fileName
  });
  res.write(html);
  res.end();
  console.log(`--- End Function renderAddFileResponse() ---`);
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

function renderErrorPage(req, res, err) {
  console.log(err);
}
