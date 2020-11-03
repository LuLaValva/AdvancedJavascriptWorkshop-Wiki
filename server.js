console.log("Server-side code running");

const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();

// serve files from the public directory
app.use(express.static("public"));

// connect to the db and start the express server
let db;

// URL of the localhost database using the command `mongod`
const url = "mongodb://127.0.0.1:27017";

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log(err);
  }

  // grabbed database by name from the client
  db = client.db("wiki_clone");

  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log("listening on 8080");
  });
});

// serve the homepage
app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// add a document to the DB collection recording the click event
// app.post("/clicked", (_req, _res) => {
//   const click = { clickTime: new Date() };
//   console.log(click);
//   db.collection("test").findOneAndUpdate(
//     { name: "clicks" },
//     { $inc: { count: 1 } }
//   );
// });

app.get("/contents", (_req, res) => {
  db.collection("pages")
    .findOne()
    .then((result) => res.send(result));
});

app.post("/submit_changes", (req, res) => {
  // TODO
  db.collection("pages").updateOne(
    {},
    { $set: { "modules.0.content": "test" } }
  );
});

// get the click data from the database
// app.get("/clicks", (req, res) => {
//   db.collection("test")
//     .findOne({ name: "clicks" })
//     .then((result) => {
//       res.send(result);
//     });
// });
