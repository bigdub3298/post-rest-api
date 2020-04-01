require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const multer = require("./middleware/multer");
const handleError = require("./middleware/error");
const { initializeSocketIO } = require("./util/socket");

const sequelize = require("./database");
const User = require("./models/user");
const Post = require("./models/post");

const initializeExpress = () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(multer.config());
  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    next();
  });

  app.use("/feed", feedRoutes);
  app.use("/auth", authRoutes);

  app.use(handleError);

  Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
  User.hasMany(Post);

  sequelize
    // .sync({ force: true })
    .sync()
    .then(_result => {
      const server = app.listen(8080, () =>
        console.log("Listening on port 8080")
      );

      const io = initializeSocketIO(server);
      io.on("connection", socket => {
        console.log("a user connected!");
      });
    })
    .catch(err => console.log(err));
};

initializeExpress();
