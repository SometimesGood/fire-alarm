const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
require("dotenv").config();
app.set("view engine", "ejs");

// twilio credentials for messaging phone
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const twilioClient = require("twilio")(accountSid, authToken);

app.use("/assets", express.static("assets"));

app.get("/", (req, res) => {
  res.render("index", { name: "Leo" });
});

server.listen(3002, () => {
  console.log("server running");
});

// mongoose + model
const mongoose = require("mongoose");
const fireWarningModel = require("./model");

// connect to mongodb & listen for requests
const username = "admin";
const password = "gWgJ9jBAFWCwzYbT";
const cluster = "clusterwot.wmrsc";
const dbname = "WoT";

const dbURI = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected to db"))
  .catch((err) => console.log(err));

//stackoverflow.com/questions/67827256/while-using-change-stream-in-mongodb-with-socket-io-the-on-change-is-getting

io.on("connection", (socket) => {
  const insert_pipeline = [{ $match: { operationType: "insert" } }];

  fireWarningModel.watch(insert_pipeline).on("change", (mongoDBdata) => {
    io.emit("dataBaseChange", mongoDBdata.fullDocument);
  });

  socket.on("userResponse", (messageToSend) => {
    console.log("inside final backend");
    console.log(messageToSend);

    twilioClient.messages
      .create({
        body: messageToSend,
        from: "+13187883038",
        to: "+4746915365",
      })
      .then((message) => console.log(message.sid));
  });

  io.emit("end");
});

console.log(new Date(), "Inserting doc with data from raspberry PI");
