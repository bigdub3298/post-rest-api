const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  Post.findAll({ order: [["id", "ASC"]], include: User })
    .then(posts => {
      res.status(200).json({
        posts
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      messages: "Create post validation failed.",
      errors: errors.array()
    });
  }

  const { title, content } = req.body;

  req.user
    .createPost({ title, content, imageUrl: "temp" })
    .then(post => {
      if (!post) {
        throw new Error("Post creation failed");
      }

      res.status(201).json({
        messages: "Post creation successful.",
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
