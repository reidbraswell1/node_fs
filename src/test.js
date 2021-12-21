// Testing functions 
// const createFile = require("./createFile.js");
import { createFile } from "./createFile.js";

import { updateFile } from "./updateFile.js";

// const readFile = require("./readFile.js");
import { readFile } from "./readFile.js";

// const deleteFile = require("./deleteFile.js");
import { deleteFile } from "./deleteFile.js";

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