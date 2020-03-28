const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const feedRoutes = require("./routes/feed");

app.use(bodyParser.json());

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpStatusCode).json({ error: error.message });
});

app.listen(8080);
