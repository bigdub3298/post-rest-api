exports.getPosts = (req, res, next) => {
  res
    .status(200)
    .json({
      posts: [{ title: "My First Post", content: "This is my first post!" }]
    });
};
