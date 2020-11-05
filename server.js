console.log("Server-side code running");

const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();

// serve files from the public directory
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// fetch the contents of a single page
app.get("/contents", (_req, res) => {
  db.collection("pages")
    .findOne()
    .then((result) => res.send(result));
});

// submit some JSON data via req.body in the following format:
// {index: <module index>, content: <module page content>}
app.post("/submit_changes", (req, res) => {
  db.collection("pages").updateOne(
    {},
    {
      $set: {
        [`modules.${req.body.index}.content`]: req.body.content,
      },
    }
  );
  res.send("success");
});
