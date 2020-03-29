const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const feedRoutes = require("./routes/feed");

const sequelize = require("./database");
const User = require("./models/user");
const Post = require("./models/post");

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpStatusCode).json({ error: error.message });
});

Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Post);

sequelize
  // .sync({ force: true })
  .sync()
  .then(_ => User.findByPk(1))
  .then(user => {
    if (!user) {
      return User.create({ name: "Wesley Austin" });
    }
    return user;
  })
  .then(_ => {
    app.listen(8080, () => console.log("Listening on port 8080"));
  })
  .catch(err => console.log(err));
