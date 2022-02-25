import server from "./server.js";
import { testCreateFile, testDeleteFile, testReadFile, testUpdateFile, testReadDirs } from "./test.js";


const testFile = "scratchPad/HelloWorld.txt";
const data = "Hello World!!";
const data2 = "Welcome to the NodeJS File System Exercise";
const testDirName = "scratchPad";

testCreateFile(testFile, data);
testUpdateFile(testFile, data2);
testReadFile(testFile);
testDeleteFile(testFile);
testReadDirs(testDirName);
testCreateFile(testFile, data);