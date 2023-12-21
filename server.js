const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(__dirname));

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "bbc3d484dbea41f2bbae1e4e1418ec45",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

const cars = ["GT-R Nismo", "S63 AMG", "ALPINA B8", "NSX-R"];

app.get("/", (req, res) => {
  rollbar.info("User accessed the site.");
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/api/cars", (req, res) => {
  rollbar.warning("User is accessing cars infomation! Uh-oh!");
  res.status(200).send(cars);
});

app.post("/api/cars", (req, res) => {
  let { name } = req.body;
  rollbar.critical(`THERE IS AN IMPOSTER AMONG US!! THEIR NAME IS ${name}`);
  const index = cars.findIndex((car) => {
    return car === name;
  });

  try {
    if (index === -1 && name !== "") {
      cars.push(name);
      res.status(200).send(cars);
    } else if (name === "") {
      res.status(400).send("You must enter a name.");
    } else {
      res.status(400).send("That car already exists.");
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/cars/:index", (req, res) => {
  const targetIndex = +req.params.index;
  cars.splice(targetIndex, 1);
  res.status(200).send(cars);
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server listening on ${port}`));
