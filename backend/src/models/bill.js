const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Bill = sequelize.define("Bill", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  productName: {
    type: DataTypes.STRING,
    allowNull: true
  },

  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  warrantyPeriod: {
    type: DataTypes.STRING,
    allowNull: true
  },

  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  storeName: {
    type: DataTypes.STRING,
    allowNull: true
  },

  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Bill;
