import { readFile } from "./readFile.js";
import { createFile } from "./create.js";
import server from "./server.js";
const data = readFile('views/index.html')
data.then(function (value)  {
    console.log(`File contents:\n ${value}`);
}).catch(function (error) {
    console.log(error);
});
const create = createFile('views/test.html','<h1>Hello World</h1>');
create.then(function (message) {
    console.log(`${message}`)
}).catch(function (error) {
    console.log(`${error}`);
});