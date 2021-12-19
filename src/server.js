//const http = require("http");
import http from "http";

const serverPort = 3000;

export const server = http.createServer((req, res) => {

});

server.listen(serverPort, function (err) {
    console.log(`Error starting server at port ${serverPort}.`);
    console.log(`Error = ${err}`);
});
console.log(`Server running on port ${server.address().port}`);