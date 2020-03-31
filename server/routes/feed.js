const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../util/isAuth");

router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  isAuth,
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
  isAuth,
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

router.delete("/post/:id", isAuth, feedController.deletePost);

router.get("/user-status", isAuth, feedController.getUserStatus);

router.post(
  "/user-status",
  isAuth,
  [
    body("status", "Invalid status")
      .trim()
      .not()
      .isEmpty()
  ],
  feedController.updateUserStatus
);

module.exports = router;
