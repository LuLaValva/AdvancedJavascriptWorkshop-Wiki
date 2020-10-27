console.log("Server-side code running");

const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();

// serve files from the public directory
app.use(express.static("public"));

// connect to the db and start the express server
let db;

// Replace the URL below with the URL for your database
const url = "mongodb://127.0.0.1:27017";

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log(err);
  }

  // grabbed database name from the client
  db = client.db("testdb");

  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log("listening on 8080");
  });
});

// serve the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// add a document to the DB collection recording the click event
app.post("/clicked", (req, res) => {
  const click = { clickTime: new Date() };
  console.log(click);
  db.collection("test").findOneAndUpdate(
    { name: "clicks" },
    { $inc: { count: 1 } }
  );
});

// get the click data from the database
app.get("/clicks", (req, res) => {
  db.collection("test")
    .findOne({ name: "clicks" })
    .then((result) => {
      res.send(result);
    });
});
