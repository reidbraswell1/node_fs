import { readFile } from "./readFile.js";
import server from "./server.js";
const data = readFile('views/index.html')
data.then(function (value)  {
    console.log(`File contents:\n ${value}`);
}).catch(function (error) {
    console.log(error);
});