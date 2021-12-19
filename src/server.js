//const http = require("http");
import http from "http";
import ejs from "ejs";

const serverPort = 3000;

export const server = http.createServer((req, res) => {
  let html = ejs.render("<h1><%=heading%></h1>", {heading:"hello"});
  res.write(html);
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
