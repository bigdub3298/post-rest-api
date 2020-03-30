const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const fileHelper = require("../util/file");

exports.getPosts = (req, res, next) => {
  const POSTS_PER_PAGE = 2;
  const page = req.query.page || 1;
  let totalPosts;

  Post.count()
    .then(count => {
      totalPosts = count;

      return Post.findAll({
        offset: POSTS_PER_PAGE * (page - 1),
        limit: POSTS_PER_PAGE,
        order: [["id", "ASC"]],
        include: User
      });
    })
    .then(posts => {
      res.status(200).json({
        message: "Fetch posts successful",
        posts,
        postsPerPage: POSTS_PER_PAGE,
        totalPosts
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
        const error = new Error("Post does not exist.");
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
    const error = new Error(errors.array()[0].msg);
    error.data = errors.array();
    error.httpStatusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided.");
    error.httpStatusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  const imageUrl = req.file.path;

  req.user
    .createPost({ title, content, imageUrl })
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

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.data = errors.array();
    error.httpStatusCode = 422;
    throw error;
  }

  const { id } = req.params;
  const { title, content } = req.body;
  const image = req.file;

  req.user
    .getPosts({ where: { id }, include: User })
    .then(posts => {
      if (posts.length === 0) {
        const error = new Error("Post does not exist.");
        error.status(404);
        throw error;
      }

      const post = posts[0];
      post.title = title;
      post.content = content;
      if (image) {
        fileHelper.deleteFile(post.imageUrl);
        post.imageUrl = image.path;
      }
      return post.save();
    })
    .then(updatedPost => {
      res
        .status(200)
        .json({ message: "Update post successful.", post: updatedPost });
    })
    .catch(err => {
      if (!err.httpStatusCode) err.httpStatusCode = 500;
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const { id } = req.params;

  req.user
    .getPosts({ where: { id } })
    .then(posts => {
      if (posts.length === 0) {
        const error = new Error("Post does not exist.");
        error.httpStatusCode(404);
        throw error;
      }

      const post = posts[0];
      fileHelper.deleteFile(post.imageUrl);
      return post.destroy();
    })
    .then(post => {
      console.log(post);
      res.status(200).json({ message: "Delete post successful." });
    })
    .catch(err => {
      if (!err.httpStatusCode) err.httpStatusCode = 500;
      next(err);
    });
};
