const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DataPeriods = sequelize.define("DataPeriods", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},  // ID
  startDate: {type: DataTypes.STRING},
  endDate: {type: DataTypes.STRING},
})

module.exports = DataPeriods;