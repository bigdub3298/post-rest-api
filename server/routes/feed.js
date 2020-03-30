const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

router.get("/posts", feedController.getPosts);

router.post(
  "/post",
  [
    body("title", "Title must be at least 5 characters")
      .trim()
      .isLength({ min: 5 }),
    body("content", "Title must be at least 5 characters")
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

router.get("/post/:id", feedController.getPost);

router.put(
  "/post/:id",
  [
    body("title", "Title must be at least 5 characters")
      .trim()
      .isLength({ min: 5 }),
    body("content", "Title must be at least 5 characters")
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);

router.delete("/post/:id", feedController.deletePost);

module.exports = router;
