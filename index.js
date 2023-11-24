const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const request = require("request");
const app = express();
const server = createServer(app);
const io = new Server(server);

let url =
  "https://api.apify.com/v2/key-value-stores/EaCBL1JNntjR3EakU/records/LATEST?disableRedirect=true";

let options = { json: true };

app.use(express.static(__dirname + "/public"));

request(url, options, (error, res, body) => {
  if (error) {
    return console.log(error);
  }

  if (!error && res.statusCode == 200) {
    // do something with JSON, using the 'body' variable
    io.on("connection", async (socket) => {
      io.emit("send-data", body);
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
