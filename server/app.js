const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const feedRoutes = require("./routes/feed");

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpStatusCode).json({ error: error.message });
});

app.listen(8080);
