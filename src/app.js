import { readFile } from "./readFile.js";
import server from "./server.js";
const data = readFile('views/index.html');
console.log(`File contents: ${data}`);