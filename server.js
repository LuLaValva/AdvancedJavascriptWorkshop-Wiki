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
const url = "mongodb://127.0.0.1/27017";
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err);
  }
  db = client.db("WikiDB");

  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
});

/*
    Configure Webhooks
*/
app.get("/", async (req, res) => {
  res.render("pug/menu");
});

app.get("/page/:pagetitle", async (req, res) => {
  const pageinfo = await db
    .collection("pages")
    .findOne({ endpoint: req.params.pagetitle });

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
  db.collection("pages").updateOne(
    { endpoint: req.params.pagetitle },
    {
      $set: {
        [`modules.${req.body.index}.name`]: req.body.name,
        [`modules.${req.body.index}.content`]: req.body.content,
      },
    }
  );
  res.send("success");
});
