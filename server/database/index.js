const Sequelize = require("sequelize");

const sequelize = new Sequelize("posts_rest_api", "", "", {
  dialect: "postgres",
  host: "localhost",
  logging: false
});

module.exports = sequelize;
