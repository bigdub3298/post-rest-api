const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  Post.findAll({ order: [["id", "ASC"]], include: User })
    .then(posts => {
      res.status(200).json({
        message: "Fetch posts successful",
        posts
      });
    })
    .catch(err => {
      if (!err.httpStatusCode) err.httpStatusCode = 500;
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const { id } = req.params;

  Post.findByPk(id, { include: User })
    .then(post => {
      if (!post) {
        const error = new Error("Post does not exits.");
        error.httpStatusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Fetch post successful.", post });
    })
    .catch(err => {
      if (!err.httpStatusCode) err.httpStatusCode = 500;
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Create post validation failed.");
    error.httpStatusCode = 422;
    throw error;
  }

  const { title, content } = req.body;

  req.user
    .createPost({ title, content, imageUrl: "images/duck.jpg" })
    .then(post => {
      if (!post) {
        throw new Error("Create post failed");
      }

      res.status(201).json({
        messages: "Create post successful.",
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          user: req.user,
          createdAt: post.createdAt
        }
      });
    })
    .catch(err => {
      if (!err.httpStatusCode) err.httpStatusCode = 500;
      next(err);
    });
};
