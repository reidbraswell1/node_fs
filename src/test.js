// Testing functions 
// const cf = require("./createFile.js");
import { createFile } from "./createFile.js";

// const uf = require("./updateFile.js");
import { updateFile } from "./updateFile.js";

// const rf = require("./readFile.js");
import { readFile } from "./readFile.js";

// const df = require("./deleteFile.js");
import { deleteFile } from "./deleteFile.js";

// const rd = require("./readDirs")
import { readDir } from "./readDirs.js";

export function testCreateFile(testFile, data) {
    createFile(testFile, data)
    .then(function (message) {
        console.log(`${message}`);
    })
    .catch(function (error) {

    });
}
export function testUpdateFile(testFile, data2) {
    updateFile(testFile, data2)
    .then(function (message) {
        console.log(`${message}`)
    }).catch(function (error) {
        console.log(`${error}`);
    });
}
export function testReadFile(testFile) {
    readFile(testFile)
    .then(function (message) {
        console.log(message);
    }).catch(function (error) {
        console.log(error);
    }); 
}
export function testDeleteFile(testFile) {
    deleteFile(testFile)
    .then(function (message) {
        console.log(`${message}`);
    }).catch(function (error) {
        console.log(`${error}`);
    });
}

export function testReadDirectories(path) {
    console.log(`Path ${path}`);
    readDir(path)
    .then(function (message) {
        console.log(`${message}`);
    }).catch(function(error) {
        console.log(error);
    });
}