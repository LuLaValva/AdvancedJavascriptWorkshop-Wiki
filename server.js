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
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
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

// Zulfikar Ahmed (Display list of elements)
// Evan O'Donnell (Filter the list based on a query)
app.get("/", async (req, res) => {
  search_element = req.query["question"];

  // Find ALL page entries in the database
  let entries = await (
    await pagesdb.find({}, { endpoint: 1, title: 1, _id: 0 })
  ).toArray();

  if (search_element) {
    entries = entries.filter((entry) => {
      return entry.title.toLowerCase().match(search_element.toLowerCase());
    });
  }

  // make array of pages with title and link
  const pages = entries.map((entry) => ({
    title: entry.title,
    link: "/page/" + entry.endpoint,
  }));

  res.render("pug/menu", {
    pages: pages,
  });
});

// Lucas LaValva
app.get("/page/:pagetitle", async (req, res) => {
  const pageinfo = await pagesdb.findOne({ endpoint: req.params.pagetitle });

  if (pageinfo) {
    res.render("pug/standard_page", pageinfo);
  } else {
    // Nana Adu-abankro
    res.render("pug/404notfound", { title: req.params.pagetitle });
  }
});

// James Reick
app.get("/newarticle", (req, res) => {
  res.render("pug/make_new_article");
});

// Nana Adu-abankro
app.get("/404notfound", (req, res) => {
  res.render("pug/404notfound", { Title: "None" });
});

// James Reick
app.get("/newArticleToDB", (req, res) => {
  let endpoint = req.query["title"].replace(" ", "_").toLowerCase();
  pagesdb.insertOne({
    endpoint: endpoint,
    title: req.query["title"],
    description: "",
    modules: [],
  });

  res.redirect(`/page/${endpoint}`);
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
  pagesdb.updateOne(
    { endpoint: req.params.pagetitle },
    {
      $push: {
        modules: { name: "Default Title", content: "Default Content" },
      },
    }
  );
  res.send("success");
});

// Matt Bergen
app.post("/page/:pagetitle/remove_module", async (req, res) => {
  req.body.index;
  /*
    Removing by a specific index is weird.
    Because you can't $pull by a specific index, we have to do it in two steps:
      1) Set that index to null
      2) Remove all indicies which are currently null
    
    Source for this strategy:
    https://stackoverflow.com/a/4588909
  */
  await pagesdb.updateOne(
    { endpoint: req.params.pagetitle },
    { $unset: { [`modules.${req.body.index}`]: 1 } }
  );
  await pagesdb.updateOne(
    { endpoint: req.params.pagetitle },
    { $pull: { modules: null } }
  );
  res.send("success");
});
