const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(__dirname));

const cars = ["GT-R Nismo", "S63 AMG", "ALPINA B8", "NSX"];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/api/cars", (req, res) => {
  res.status(200).send(cars);
});

app.post("/api/cars", (req, res) => {
  let { name } = req.body;
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
