const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const authenticate = require("../middleware/authenticate");

router.get("/posts", authenticate, feedController.getPosts);

router.post(
  "/post",
  authenticate,
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
  authenticate,
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

router.delete("/post/:id", authenticate, feedController.deletePost);

router.get("/user-status", authenticate, feedController.getUserStatus);

router.post(
  "/user-status",
  authenticate,
  [
    body("status", "Invalid status")
      .trim()
      .not()
      .isEmpty()
  ],
  feedController.updateUserStatus
);

module.exports = router;
