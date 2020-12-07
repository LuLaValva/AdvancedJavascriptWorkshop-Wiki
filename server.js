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
app.get("/", async (req, res) => {
  // Find ALL pages, but only grab the `endpoint` and the `title`
  // List all of the titles out with Pug as links (a href=/page/endpoint)
  res.render("pug/menu");
});

app.get("/page/:pagetitle", async (req, res) => {
  const pageinfo = await pagesdb.findOne({ endpoint: req.params.pagetitle });

  if (pageinfo) {
    res.render("pug/standard_page", pageinfo);
  } else {
    res.redirect("/404notfound");
  }
});

app.get("/404notfound", (req, res) => {
  res.render("pug/404notfound");
});

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
