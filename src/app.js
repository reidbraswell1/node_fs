import server from "./server.js";
import { testCreateFile, testDeleteFile, testReadFile, testUpdateFile } from "./test.js";


const testFile = "views/test.html";
const data = "<h1>Test H1</h1><h2>Test H2</h2>";
const data2 = "<h3>Test H3</h3>";

testCreateFile(testFile, data);
testUpdateFile(testFile, data2);
testReadFile(testFile);
testDeleteFile(testFile);