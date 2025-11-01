const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Executor = sequelize.define('executorTable', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, // ID
    executorName: {type: DataTypes.STRING},                               // Имя и фамилия исполнителя
    executorDepartament: {type: DataTypes.STRING}                         // Отдел 
})

module.exports = Executor;