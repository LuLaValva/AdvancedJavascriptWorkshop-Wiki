const express = require("express");
const MongoClient = require("mongodb").MongoClient;

/*
    set up express and views
*/
const app = express();
app.set("view engine", "pug");
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
    Connect to Mongo Database and start the application
*/
let db;
let pagesdb;
const url = "mongodb://127.0.0.1/27017";
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err);
  }
  db = client.db("WikiDB");
  pagesdb = db.collection("pages");

  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
});

/*
    Configure Webhooks
*/

// Ahmed
app.get("/", async (req, res) => {
  // Find ALL pages, but only grab the `endpoint` and the `title`
  // List all of the titles out with Pug as links (a href=/page/endpoint)
  res.render("pug/menu");
});

// Lucas LaValva
app.get("/page/:pagetitle", async (req, res) => {
  const pageinfo = await pagesdb.findOne({ endpoint: req.params.pagetitle });

  if (pageinfo) {
    res.render("pug/standard_page", pageinfo);
  } else {
    // TODO: Add information about the page that wasn't found
    // Maybe have automatic redirect or a button to go back to main menu
    res.render("pug/404notfound", { title: req.params.pagetitle });
  }
});

// James Reick
app.get("/newarticle", (req, res) => {
  // Make title and description, then send it via a fetch to /newArticleToDB
  res.render("pug/make_new_article");
  // after receiving "success" from "/newArticleToDB", redirect to /page/<new endpoint>
});

// Nana
app.get("/404notfound", (req, res) => {
  res.render("pug/404notfound", {Title: "None"});
});

// James Reick
app.post("/newArticleToDB", (req, res) => {
  // Save the JSON stuff to the database
  // Maybe generate a "endpoint" from the title
  //     (convert to all lowercase, underscores instead of spaces)
  res.send("success");
});

// Lucas LaValva
app.post("/page/:pagetitle/update_module", (req, res) => {
  let titleItem, contentItem;
  if (req.body.index == -1) {
    //Module index of -1 refers to the title  and description
    titleItem = "title";
    contentItem = "description";
  } else {
    titleItem = `modules.${req.body.index}.name`;
    contentItem = `modules.${req.body.index}.content`;
  }
  pagesdb.updateOne(
    { endpoint: req.params.pagetitle },
    {
      $set: {
        [titleItem]: req.body.name,
        [contentItem]: req.body.content,
      },
    }
  );
  res.send("success");
});

// Matt Bergen
app.post("/page/:pagetitle/add_new_module", (req, res) => {
  /*
    Find the mongo command that adds a new item to a list.
    Append an item to the end of the "modules" array
    The item should look like this (for now):
        {
          name: "Default Name",
          content: "Default Content"
        }
    I think that's it
  */
  res.send("success");
});

// Matt Bergen
app.post("/page/:pagetitle/remove_module", (req, res) => {
  /*
    Remove a module from the list of modules
  */
  res.send("success");
});
