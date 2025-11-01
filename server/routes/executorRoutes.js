const express = require("express");
const Executor = require('../models/Executor');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Все роуты требуют аутентификации
router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { 
      executorName,
      executorTypeWork,
      executorDepartament
    } = req.body
    const executor = await Executor.create({
      executorName,
      executorTypeWork,
      executorDepartament
    })
    return res.json(executor)
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
})

router.get("/", async (req, res) => {
  try {
    const executorAll = await Executor.findAll()
    return res.json(executorAll)
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
})


module.exports = router;