const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Dop = sequelize.define("DopWorkTable", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, // ID
    date: {type: DataTypes.DATEONLY, defaultValue: Date.now()},         // Отметка даты
    timeText: {type: DataTypes.STRING},                                 // Отметка времени
    reglament: {type: DataTypes.STRING},                                // Ссылка на регламент
    executor: {type: DataTypes.STRING},                                 // Исполнители
    amount: {type: DataTypes.STRING},                                   // Кол-во доп. работ в реге
    typeWork: {type: DataTypes.STRING},                                 // Вид работ
    typeTest: {type: DataTypes.STRING},                                 // Вид проверки
    recommen: {type: DataTypes.INTEGER, defaultValue: 0},               // Рекомендации
    errors: {type: DataTypes.INTEGER, defaultValue: 0},                 // Ошибки
    critic: {type: DataTypes.INTEGER, defaultValue: 0},                 // Критические ошибки
    recomenPoint: {type: DataTypes.FLOAT, defaultValue: 0},           // Рекомендации КОЭФФИЦЕНТ
    errorsPoint: {type: DataTypes.FLOAT, defaultValue: 0},            // Ошибки КОЭФФИЦЕНТ
    criticPoint: {type: DataTypes.FLOAT, defaultValue: 0},            // Критические ошибки КОЭФФИЦЕНТ
    generalPoint: {type: DataTypes.FLOAT, defaultValue: 0},           // Общий балл КОЭФФИЦЕНТОВ
    counting: {type: DataTypes.TEXT},                                   // Отчет
    iteration: {type: DataTypes.INTEGER, defaultValue: 0},              // Итерации
    point: {type: DataTypes.FLOAT},                                     // Баллы
    inspector: {type: DataTypes.STRING},                                // Проверяющий
    departament: {type: DataTypes.STRING},                              // Отдел
    delayTester: {type: DataTypes.STRING},                              // Просрочка тестировщика
    delayExecutor: {type: DataTypes.STRING},                            // Просрочка исполнителя
    pointsRemove: {type: DataTypes.INTEGER, defaultValue: 0},           // Снятые баллы
    dispute: {type: DataTypes.INTEGER, defaultValue: 0},                // Спор
    commentError: {type: DataTypes.STRING},                             // Комментарий ошибки
    linkReport: {type: DataTypes.STRING},                               // ссылка для отчета
    reportPeriods: {type: DataTypes.DATEONLY},                          // Дата отчета
})

module.exports = Dop;