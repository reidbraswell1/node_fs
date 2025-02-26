//const http = require("http");
import http from "http";
import ejs from "ejs";
import fs, { read, readFileSync } from "fs";
import { readDir } from "./readDirs.js";

import { readFile } from "./readFile.js";
import { runInNewContext } from "vm";
import { createFile } from "./createFile.js";
import { updateFile } from "./updateFile.js";
import { appendFile } from "./appendFile.js";
import { deleteFile } from "./deleteFile.js";
import { log } from "./logger.js";
import { exit } from "process";
import { executionAsyncId } from "async_hooks";

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
        renderPages(req, res, "index");
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/about":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        renderPages(req, res, "about");
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/indexStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        serveStyleSheets(req, res, "indexStyle.css");
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/aboutStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        serveStyleSheets(req, res, "aboutStyle.css");
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
      case "/form-submission-update-file":
        {
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
        }
        console.log(`--- End Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        break;
      case "/form-submission-append-file":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        log(req.method, req.url, res.statusCode);
        switch (req.method) {
          case "POST":
            console.log(`Begin ${req.method} Method ${req.url}`);
            let postParams = new URLSearchParams(chunks.toString());
            processFormSubmissionAppendFileRequest(req, res, postParams);
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
        log(req.method, req.url, res.statusCode);
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


/*  
 * Render Pages Function
 * This function will render an ejs template based on the
 * page name passed to it. fileName is required but err can
 * be null or spaces.
 */
function renderPages(req, res, page, fileName, err) {
  console.log(`--- Begin Function renderPages() ---`);
  switch (page) {
    case "index":
      console.log(`--- Begin Case "index" ---`);
      try {
        const template = fs.readFileSync(`./views/index.ejs`, "utf-8");
        readDir(baseDir)
          .then(function (message) {
            console.log("here 55");
            // Omit "Read Directories: " text
            let listing = message.substring(message.indexOf(":") + 2);
            // Replace all commas with new lines
            listing = listing.replace(/,/g, "\n");
            let html = ejs.render(template, {
              dirPath: baseDir,
              dirList: listing,
            });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
          })
          .catch(function (error) {
            console.log(`Error "index reder": ${error.toString()}`);
            res.emit("error", error.toString());
          });
      } catch (error) {
        res.emit("error", `Error "index reder": ${error.toString()}`);
      }
      console.log(`--- End Case "index" ---`);
      break;
    case "about":
      console.log(`--- Begin Case "about" ---`);
      try {
        const htmlFile = fs.readFileSync(`./views/about.html`, "utf-8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlFile);
      } catch (error) {
        console.log(`Error "about render": ${error.toString()}`);
        res.emit("error", `Error "about render": ${error.toString()}`);
      }
      console.log(`--- End Case "about" ---`);
      break;
    case "readFile": {
      console.log(`--- Begin Case "readFile" ---`);
      try {
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
            console.log(`Error "readFile render": ${error.toString()}`);
            res.emit("error", `Error "readFile render":${error.toString()}`);
          });
      } catch (error) {
        res.emit("error", error.toString());
      }
      console.log(`--- End Case "readFile" ---`);
      break;
    }
    case "addFile": {
      console.log(`--- Begin Case "addFile" ---`);
      try {
        const template = fs.readFileSync(`./views/addFile.ejs`, "utf-8");
        let html = ejs.render(template, {
          fileName: fileName,
        });
        res.end(html);
      } catch (error) {
        console.log(`Error "addFile render": ${error.toString()}`);
        res.emit("error", `Error "addFile render": ${error.toString()}`);
      }
      console.log(`--- End Case "addFile" ---`);
      break;
    }
    case "updateFile":
      console.log(`--- Begin Case "updateFile" ---`);
      try {
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
            console.log(`Error "updateFile render": ${error.toString()}`);
            res.emit("error", `Error "updateFile render": ${error.toString()}`);
          });
      } catch (error) {
        res.emit("error", `Error "updateFile render": ${error.toString()}`);
      }
      console.log(`--- End Case "updateFile" ---`);
      break;
    case "appendFile":
      console.log(`--- Begin Case "appendFile" ---`);
      try {
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
            console.log(`Error "appendFile render": ${error.toString()}`);
          });
      } catch (error) {
        res.emit("error", `Error appendFile render: ${error.toString()}`);
      }
      console.log(`--- End Case "appendFile" ---`);
      break;
    case "deleteFile":
      console.log(`--- Begin Case "deleteFile" ---`);
      console.log(`--- End Case "deleteFile" ---`);
      break;
  }
  console.log(`--- End Function renderPages() ---`);
}

/*
 * Serve stylesheets
 * This function reads stylesheets and writes them back
 * to the requesting url based on the stylesheet variable
 */
function serveStyleSheets(req, res, stylesheet) {
  console.log(`---Begin Function serveStyleSheets() ---`);
  res.writeHead(200, { "Content-Type": "text/css" });
  switch (stylesheet) {
    case "indexStyle.css":
      console.log(`--- Beagin Case "indexStyle.css" ---`);
      try {
        let css = fs.readFileSync(`./styles/indexStyle.css`, "utf-8");
        res.write(css);
      } catch (error) {
        res.emit("error", error.toString());
      }
      console.log(`--- End Case "indexStyle.css" ---`);
      break;
    case "aboutStyle.css":
      console.log(`--- Beagin Case "aboutStyle.css" ---`);
      try {
        let css = fs.readFileSync(`./styles/aboutStyle.css`, "utf-8");
        res.write(css);
      } catch (error) {
        res.emit("error", error.toString());
      }
      console.log(`--- End Case "aboutStyle.css" ---`);
      break;
    case "addFileStyle.css":
      console.log(`--- End Case "addFileStyle.css" ---`);
      try {
        let css = fs.readFileSync(`./styles/addFileStyle.css`, "utf-8");
        res.write(css);
      } catch (error) {
        res.emit("error", error.toString());
      }
      console.log(`--- End Case "addFileStyle.css" ---`);
      break;
    case "appendFileStyle.css":
      console.log(`--- End Case "appendFileStyle.css" ---`);
      try {
        let css = fs.readFileSync(`./styles/appendFileStyle.css`, "utf-8");
        res.write(css);
      } catch (error) {
        res.emit("error", error.toString());
      }
      console.log(`--- End Case "appendFileStyle.css" ---`);
      break;
    case "readFileStyle.css":
      console.log(`--- Beagin Case "readFileStyle.css" ---`);
      try {
        let css = fs.readFileSync(`./styles/readFileStyle.css`, "utf-8");
        res.write(css);
      } catch (error) {
        res.emit("error", error.toString());
      }
      console.log(`--- End Case "readFileStyle.css" ---`);
      break;
    case "updateFileStyle.css":
      console.log(`--- Beagin Case "updateFileStyle.css" ---`);
      try {
        let css = fs.readFileSync(`./styles/updateFileStyle.css`, "utf-8");
        res.write(css);
      } catch (error) {
        res.emit("error", error.toString());
      }
      console.log(`--- End Case "updateFileStyle.css" ---`);
      break;
    case "errorStyle.css":
      console.log(`--- Beagin Case "errorFileStyle.css" ---`);
      try {
        let css = fs.readFileSync(`./styles/errorStyle.css`, "utf-8");
        res.write(css);
      } catch (error) {
        res.emit("error", error.toString());
      }
      console.log(`--- End Case "errorFileStyle.css" ---`);
      break;
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
      console.log(`--- End Case "Read" ---`);
      break;
    case "Add":
      // Add file then render index page
      console.log(`--- Begin Case "Add" ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        renderErrorPage(req, res, `File ${fileName} Already Exists!`);
      } else {
        console.log(`${baseDir}/${fileName} Does not exist!`);
        renderPages(req, res, "addFile", fileName, null);
      }
      console.log(`--- End Case Add ---`);
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
      console.log(`--- End Case "Update" ---`);
      break;
    case "Append":
      console.log(`--- Begin Case "Append" ---`);
      if (fs.existsSync(`${baseDir}/${fileName}`)) {
        console.log(`${baseDir}/${fileName} Exists!`);
        renderPages(req, res, "appendFile", fileName, null);
      } else {
        console.log(`${baseDir}/File "${fileName}" Does not exist!`);
        renderErrorPage(req, res, `File "${fileName}" Does Not Exist!`);
      }
      console.log(`--- End Case "Append" ---`);
      break;
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
      console.log(`--- End Case "Delete" ---`);
      break;
  }
  console.log(`${selectOption}`);
  console.log(`--- End Function processFormSubmissionRequest() ---`);
}

// Function to process an add file request
function processFormSubmissionAddFileRequest(req, res, postParams) {
  console.log(`--- Begin Function processFormSubmissionAddFileRequest() ---`);
  let fileName = postParams.get("file-name");
  console.log(`File Name = '${fileName}'`);
  let fileContents = postParams.get("file-contents");
  console.log(`File Contents = ${fileContents}`);
  createFile(`${baseDir}/${fileName}`, `${fileContents}\n`)
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

/*
 *  Function to process an update file request
 *  User is allowed to overwrite the file with whatever contents
 *  they enter in the text area.
 */ 
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

/* 
 *  Function to process an append file request
 *  User is allowed to append text to the end of the file with
 *  whatever contents they enter in the text area.
 */
function processFormSubmissionAppendFileRequest(req, res, postParams) {
  console.log(
    `--- Begin Function processFormSubmissionAppendFileRequest() ---`
  );
  let fileName = postParams.get("file-name");
  console.log(`File Name = ${fileName}`);
  let fileContents = postParams.get("file-contents");
  console.log(`File Contents = ${fileContents}`);
  appendFile(`${baseDir}/${fileName}`, `${fileContents}\n`)
    .then(function (message) {
      console.log(`--- Append File Return Message: ${message} ---`);
      res.writeHead(302, {
        location: "/",
      });
      res.end();
    })
    .catch(function (error) {
      renderErrorPage(req, res, error);
    });
  console.log(`--- End Function processFormSubmissionAppendFileRequest() ---`);
}

/* 
 *  Function to process a delete file request.
 *  file will be deleted then a redirect to the index page.
 */
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

/*  Function to render an error page based on the error
 *  in the err variable.
 */
function renderErrorPage(req, res, err) {
  console.log(`--- Begin Function renderErrorPage() ---`);
  console.log(err.toString());
  try {
    const template = fs.readFileSync(`./views/error.ejs`, "utf-8");
    let html = ejs.render(template, {
      errorText: err.toString(),
    });
    res.end(html);
  } catch (error) {
    res.emit("error", error.toString());
  }
  console.log(`--- End Function renderErrorPage() ---`);
}
