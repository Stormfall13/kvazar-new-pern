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

// 📌 Получение одного исполнителя по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const executor = await Executor.findByPk(id);
    
    if (!executor) {
      return res.status(404).json({ message: "Исполнитель не найден" });
    }
    
    return res.json(executor);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// 📌 Редактирование исполнителя
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      executorName,
      executorTypeWork,
      executorDepartament
    } = req.body;

    const executor = await Executor.findByPk(id);
    
    if (!executor) {
      return res.status(404).json({ message: "Исполнитель не найден" });
    }

    // Обновляем данные
    await executor.update({
      executorName: executorName || executor.executorName,
      executorTypeWork: executorTypeWork || executor.executorTypeWork,
      executorDepartament: executorDepartament || executor.executorDepartament
    });

    return res.json(executor);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// 📌 Удаление исполнителя
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const executor = await Executor.findByPk(id);
    
    if (!executor) {
      return res.status(404).json({ message: "Исполнитель не найден" });
    }

    await executor.destroy();
    return res.json({ message: "Исполнитель успешно удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});


module.exports = router;