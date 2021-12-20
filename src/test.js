// Testing functions 
// const createFile = require("./createFile.js");
import { createFile } from "./createFile.js";

// const readFile = require("./readFile.js");
import { readFile } from "./readFile.js";

export function testCreateFile(testFile, data) {
    createFile(testFile, data)
    .then(function (message) {
        console.log(`${message}`);
    })
    .catch(function (error) {

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
export function testDeleteFile() {

}