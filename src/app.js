import server from "./server.js";
import { testCreateFile, testDeleteFile, testReadFile, testAppendFile, testUpdateFile, testReadDirs } from "./test.js";


const testFile = "scratchPad/HelloWorld-1.txt";
const testFile2 = "scratchPad/HelloWorld-2.txt";
const data = "Hello World!!\n";
const data2 = "Welcome to the NodeJS File System Exercise!!\n";
const testDirName = "scratchPad";

testCreateFile(testFile, data);
testUpdateFile(testFile, data2);
testReadFile(testFile);
testDeleteFile(testFile);
testReadDirs(testDirName);
testCreateFile(testFile, data);
testCreateFile(testFile2, data);
testAppendFile(testFile2, data2);