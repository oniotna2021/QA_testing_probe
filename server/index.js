const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");

const app = express();
const elastic = require("./elastic");
console.log("init server");

app.options("*", cors());
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../build")));

app.post("/elastic/:indexe", elastic.searchElastic);
app.use("/static", express.static(path.join(__dirname, "../build/static")));
app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
app.use(
  "/manifest.json",
  express.static(path.join(__dirname, "../public/manifest.json"))
);

// Order of body parser matters, if imported before the proxy it could break
// the proxy funcionality, the body is onle readed in the preferences creation
// for mercadopago

// Returns the build for all routes not api related
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "../build/") });
});

app.listen(8080);
