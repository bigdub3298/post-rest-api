const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const feedRoutes = require("./routes/feed");

const sequelize = require("./database");
const User = require("./models/user");
const Post = require("./models/post");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (acceptedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

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
  const status = error.httpStatusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
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
