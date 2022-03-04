//const http = require("http");
import http from "http";
import ejs from "ejs";
import fs from "fs";
import { readDir } from "./readDirs.js";

import { readFile } from "./readFile.js";
import { runInNewContext } from "vm";
import { createFile } from "./createFile.js";
import { updateFile } from "./updateFile.js";
import { deleteFile } from "./deleteFile.js";
import { log } from "./logger.js";
import { exit } from "process";

const serverPort = 3000;
let baseDir = "scratchPad";

export const server = http.createServer((req, res) => {
  console.log(`--- Begin function createServer() ---`);

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
    console.log(`--- Request Error - ${err} ---`);
    res.writeHead(400, { "Content-Type": "text/html" });
    renderErrorPage(req, res, error);
  });

  // Handle Response Error's
  res.on("error", function (err) {
    console.log(`--- Response Error - ${err} ---`);
    renderErrorPage(req, res, err);
    return;
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
        log(req.method, req.url, res.statusCode);
        renderHomePage(req, res);
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/indexStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        serveStyleSheets(req, res, "indexStyle.css");
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/readFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        serveStyleSheets(req, res, "readFileStyle.css");
        console.log(`--- End Case ${urlToRoute} Route --- `);
        break;
      case "/styles/addFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        serveStyleSheets(req, res, "addFileStyle.css");
        console.log(`--- End Case ${urlToRoute} Route --- `);
        break;
      case "/styles/updateFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route`);
        log(req.method, req.url, res.statusCode);
        serveStyleSheets(req, res, "updateFileStyle.css");
        console.log(`--- End Case ${urlToRoute} Route`);
        break;
      case "/styles/appendFileStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route`);
        log(req.method, req.url, res.statusCode);
        serveStyleSheets(req, res, "appendFileStyle.css");
        console.log(`--- End Case ${urlToRoute} Route`);
        break;
      case "/styles/errorStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        serveStyleSheets(req, res, "errorStyle.css");
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/form-submission":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        switch (req.method) {
          case "POST":
            console.log(`Begin ${req.method} Method ${req.url}`);
            let postParams = new URLSearchParams(chunks.toString());
            processFormSubmissionRequest(req, res, postParams);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
          case "GET":
            console.log(`Begin ${req.method} Method ${req.url}`);
            res.emit("error", `${req.url} ${req.method} Method Not Allowed!`);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
        }
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/form-submission-add-file":
        console.log(`Begin ${req.method} Method ${req.url}`);
        log(req.method, req.url, res.statusCode);
        switch (req.method) {
          case "POST":
            console.log(`Begin ${req.method} Method ${req.url}`);
            let postParams = new URLSearchParams(chunks.toString());
            console.log(`Post Parameters = ${postParams}`);
            processFormSubmissionAddFileRequest(req, res, postParams);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
          case "GET":
            console.log(`Begin ${req.method} Method ${req.url}`);
            res.emit("error", `${req.url} ${req.method} Method Not Allowed!`);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
          default:
            console.log(`Begin ${req.method} Method ${req.url}`);
            res.emit("error", `${req.url} ${req.method} Method Not Allowed!`);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
        }
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/form-submission-update-file": {
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        switch (req.method) {
          case "POST":
            console.log(`Begin ${req.method} Method ${req.url}`);
            let postParams = new URLSearchParams(chunks.toString());
            processFormSubmissionUpdateFileRequest(req, res, postParams);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
          case "GET":
            console.log(`Begin ${req.method} Method ${req.url}`);
            res.emit("error", `${req.url} ${req.method} Method Not Allowed!`);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
          default:
            console.log(`Begin ${req.method} Method ${req.url}`);
            res.emit("error", `${req.url} ${req.method} Method Not Allowed!`);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
        }
        break;
      }
      case "form-submission-append-file":
        switch (req.method) {
          case "POST":
            console.log(`Begin ${req.method} Method ${req.url}`);
            let postParams = new URLSearchParams(chunks.toString());
            processFormSubmissionUpdateFileRequest(req, res, postParams);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
          case "GET":
            console.log(`Begin ${req.method} Method ${req.url}`);
            res.emit("error", `${req.url} ${req.method} Method Not Allowed!`);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
          default:
            console.log(`Begin ${req.method} Method ${req.url}`);
            res.emit("error", `${req.url} ${req.method} Method Not Allowed!`);
            console.log(`End ${req.method} Method ${req.url}`);
            break;
        }
        break;
      default:
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        res.emit("error", `URL "${req.url}" Not Found On This Server`);
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

function renderHomePage(req, res, error) {
  const template = fs.readFileSync(`./views/index.ejs`, "utf-8");
  readDir(baseDir)
    .then(function (message) {
      // Omit "Read Directories: " text
      let listing = message.substring(message.indexOf(":") + 2);
      // Replace all commas with new lines
      listing = listing.replace(/,/g, "\n");

      readFile(`${baseDir}/HelloWorld.txt`)
        .then(function (message) {
          let fileContents = message;
          let html = ejs.render(template, {
            dirPath: baseDir,
            dirList: listing,
            fileContents: message,
            errorMessage: error,
          });
          console.log("here" + message);
          res.end(html);
        })
        .catch(function (error) {
          res.emit("error", error);
        });

      //      res.write(html)
      //    res.end()
    })
    .catch(function (error) {});
}

// Render Pages Function
// This function will render an ejs template based on the
// page name passed to it. fileName is required but err can
// be null or spaces.
function renderPages(req, res, page, fileName, err) {
  console.log(`--- Begin Function renderPages() ---`);
  switch (page) {
    case "index": {
      break;
    }
    case "readFile": {
      console.log(`--- Begin Case "readFile" ---`);
      const template = fs.readFileSync(`./views/readFile.ejs`, "utf-8");
      readFile(`${baseDir}/${fileName}`)
        .then(function (message) {
          let fileContents = message;
          let html = ejs.render(template, {
            fileName: fileName,
            fileContents: message,
          });
          res.end(html);
        })
        .catch(function (error) {
          console.log(
            "An error occurred in function renderReadFileResponse readFile catch"
          );
        });
      console.log(`--- End Case "readFile" ---`);
      break;
    }
    case "addFile": {
      console.log(`--- Begin Case "addFile" ---`);
      const template = fs.readFileSync(`./views/addFile.ejs`, "utf-8");
      let html = ejs.render(template, {
        fileName: fileName,
      });
      res.end(html);
      console.log(`--- End Case "addFile" ---`);
      break;
    }
    case "updateFile": {
      const template = fs.readFileSync(`./views/updateFile.ejs`, "utf-8");
      readFile(`${baseDir}/${fileName}`)
        .then(function (message) {
          let fileContents = message;
          let html = ejs.render(template, {
            fileName: fileName,
            fileContents: message,
          });
          res.end(html);
        })
        .catch(function (error) {
          console.log(
            "An error occurred in function renderReadFileResponse readFile catch"
          );
        });
      break;
    }
    case "appendFile": {
      const template = fs.readFileSync(`./views/appendFile.ejs`, "utf-8");
      readFile(`${baseDir}/${fileName}`)
        .then(function (message) {
          let fileContents = message;
          let html = ejs.render(template, {
            fileName: fileName,
            fileContents: message,
          });
          res.end(html);
        })
        .catch(function (error) {
          console.log(
            "An error occurred in function renderReadFileResponse readFile catch"
          );
        });
      break;
    }
    case "deleteFile": {
      break;
    }
  }
  console.log(`--- End Function renderPages() ---`);
}

// Serve stylesheets
// This function reads stylesheets and writes them back
// to the requesting url based on the stylesheet variable
function serveStyleSheets(req, res, stylesheet) {
  console.log(`---Begin Function serveStyleSheets() ---`);
  res.writeHead(200, { "Content-Type": "text/css" });
  switch (stylesheet) {
    case "indexStyle.css": {
      let fileStream = fs.createReadStream(`./styles/indexStyle.css`, "utf-8");
      let css = fs.readFileSync(`./styles/indexStyle.css`, "utf-8");
      res.write(css);
      break;
    }
    case "addFileStyle.css": {
      let fileStream = fs.createReadStream(
        `./styles/addFileStyle.css`,
        "utf-8"
      );
      let css = fs.readFileSync(`./styles/addFileStyle.css`, "utf-8");
      res.write(css);
      break;
    }
    case "readFileStyle.css": {
      let fileStream = fs.createReadStream(
        `./styles/readFileStyle.css`,
        "utf-8"
      );
      let css = fs.readFileSync(`./styles/readFileStyle.css`, "utf-8");
      res.write(css);
      break;
    }
    case "updateFileStyle.css": {
      let fileStream = fs.createReadStream(
        `./styles/updateFileStyle.css`,
        "utf-8"
      );
      let css = fs.readFileSync(`./styles/updateFileStyle.css`, "utf-8");
      res.write(css);
      break;
    }
    case "errorStyle.css": {
      let fileStream = fs.createReadStream(`./styles/errorStyle.css`, "utf-8");
      let css = fs.readFileSync(`./styles/errorStyle.css`, "utf-8");
      res.write(css);
      break;
    }
  }
  res.end();
  console.log(`---End Function serveStyleSheets() ---`);
}

// Function to process incomming request from the index page
function processFormSubmissionRequest(req, res, postParams) {
  console.log(`--- Begin Function processFormSubmissionRequest() ---`);
  console.log(`Request Body: ${postParams}`);
  let selectOption = postParams.get("file-action");
  let fileName = postParams.get("file-name");
  switch (selectOption) {
    case "Read":
      // Does the file exist ?
      console.log(`--- Begin  Case "Read" ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        //renderReadFileResponse(req, res, fileName);
        renderPages(req, res, "readFile", fileName, null);
      } else {
        console.log(`${baseDir}/File ${fileName} Does not exist!`);
        renderErrorPage(req, res, `File "${fileName}" Not Found!`);
      }
      console.log(`--- End form-submission Case Read ---`);
      break;
    case "Add":
      // Add file then render index page
      console.log(`--- Begin Case "Add" ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        renderErrorPage(req, res, `File ${fileName} Already Exists!`);
      } else {
        console.log(`${baseDir}/${fileName} Does not exist!`);
        //renderAddFileResponse(req, res, fileName);
        renderPages(req, res, "addFile", fileName, null);
      }
      console.log(`--- End form-submission Case Add ---`);
      break;
    case "Update":
      // Update file then render index page
      // Does the file exist ?
      console.log(`--- Begin Case "Update" ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        //renderUpdateFileResponse(req, res, fileName);
        renderPages(req, res, "updateFile", fileName, null);
      } else {
        console.log(`${baseDir}/File "${fileName}" Does not exist!`);
        renderErrorPage(req, res, `File "${fileName}" Does Not Exist!`);
      }
      console.log(`--- End form-submission Case Update ---`);
      break;
    case "Append":
      console.log(`--- Begin Case "Update" ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        //renderUpdateFileResponse(req, res, fileName);
        renderPages(req, res, "appendFile", fileName, null);
      } else {
        console.log(`${baseDir}/File "${fileName}" Does not exist!`);
        renderErrorPage(req, res, `File "${fileName}" Does Not Exist!`);
      }
      console.log(`--- End form-submission Case Update ---`);
    case "Delete":
      console.log(`--- Begin Case "Delete" ---`);
      // Delete file then render index page
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        processFormDeleteFileRequest(req, res, postParams);
      } else {
        console.log(`${baseDir}/File "${fileName}" Does not exist!`);
        renderErrorPage(req, res, `File "${fileName}" Does Not Exist!`);
      }
      console.log(`--- End form-submission Case Delete ---`);
      break;
  }
  console.log(`${selectOption}`);
  console.log(`--- End Function processPostRequest() ---`);
}

// Function to process an add file request
function processFormSubmissionAddFileRequest(req, res, postParams) {
  console.log(`--- Begin Function processFormSubmissionAddFileRequest() ---`);
  let fileName = postParams.get("file-name");
  console.log(`File Name = '${fileName}'`);
  let fileContents = postParams.get("file-contents");
  console.log(`File Contents = ${fileContents}`);
  createFile(`${baseDir}/${fileName}`, fileContents)
    .then(function (message) {
      res.writeHead(302, {
        location: "/",
      });
      res.end();
    })
    .catch(function (error) {
      res.emit("error", error);
    });
  console.log(`--- End Function processFormSubmissionAddFileRequest() ---`);
}

// Function to process an update file request
// User is allowed to overwrite the file with whatever contents
// they enter in the text area.
function processFormSubmissionUpdateFileRequest(req, res, postParams) {
  console.log(
    `--- Begin Function processFormSubmissionUpdateFileRequest() ---`
  );
  let fileName = postParams.get("file-name");
  console.log(`File Name = ${fileName}`);
  let fileContents = postParams.get("file-contents");
  console.log(`File Contents = ${fileContents}`);
  updateFile(`${baseDir}/${fileName}`, fileContents)
    .then(function (message) {
      console.log(`--- Update File Return Message: ${message} ---`);
      res.writeHead(302, {
        location: "/",
      });
      res.end();
    })
    .catch(function (error) {
      renderErrorPage(req, res, error);
    });
  console.log(`--- End Function processFormSubmissionUpdateFileRequest() ---`);
}

// Function to process a delete file request.
// file will be deleted then a redirect to the index page.
function processFormDeleteFileRequest(req, res, postParams) {
  console.log(
    `--- Begin Function processFormSubmissionDeleteFileRequest() ---`
  );
  let fileName = postParams.get("file-name");
  console.log(`File Name = ${fileName}`);
  deleteFile(`${baseDir}/${fileName}`)
    .then(function (message) {
      console.log(`--- Delete Message ${message} ---`);
      res.writeHead(302, {
        location: "/",
      });
      res.end();
    })
    .catch(function (error) {
      console.log(`--- Delete Error ${error} ---`);
      renderErrorPage(req, res, error);
    });
  console.log(`--- End Function processFormSubmissionDeleteFileRequest() ---`);
}

// Function to render an error page based on the error
// in the err variable.
function renderErrorPage(req, res, err) {
  console.log(`--- Begin Function renderErrorPage() ---`);
  console.log(err.toString());
  const template = fs.readFileSync(`./views/error.ejs`, "utf-8");
  let html = ejs.render(template, {
    errorText: err.toString(),
  });
  res.end(html);
  console.log(`--- End Function renderErrorPage() ---`);
}
