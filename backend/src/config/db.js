const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("warrantyDB", "postgres", "root@123", {
  host: "localhost",
  port: 5433,
  dialect: "postgres",
});

module.exports = sequelize;
