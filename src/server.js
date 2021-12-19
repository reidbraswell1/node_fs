//const http = require("http");
import http from "http";

const serverPort = 3000;

export const server = http.createServer((req, res) => {
  res.write("<h1>test</h1");
  res.end();
});

server.listen(serverPort, function (callback) {
  console.log(
    "Server running at url http://" +
      require("os").hostname() +
      ":" +
      serverPort
  );
});
console.log(`Server running on port ${server.address().port}`);
