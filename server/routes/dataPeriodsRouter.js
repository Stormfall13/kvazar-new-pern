const express = require("express");
const DataPeriods = require('../models/DataPeriods');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Все роуты требуют аутентификации
router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { 
      startDate,
      endDate,
    } = req.body
    const datePeriods = await DataPeriods.create({
      startDate,
      endDate,
    })
    return res.json(datePeriods)
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
})

router.get("/", async (req, res) => {
  try {
    const datePeriodsAll = await DataPeriods.findAll()
    return res.json(datePeriodsAll)
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
})

// 📌 Получение одной даты по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datePeriods = await DataPeriods.findByPk(id);
    
    if (!datePeriods) {
      return res.status(404).json({ message: "Дата не найдена" });
    }
    
    return res.json(datePeriods);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// 📌 Редактирование даты
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      startDate,
      endDate,
    } = req.body;

    const datePeriods = await DataPeriods.findByPk(id);
    
    if (!datePeriods) {
      return res.status(404).json({ message: "Период не найден" });
    }

    // Обновляем данные
    await datePeriods.update({
      startDate: startDate || datePeriods.startDate,
      endDate: endDate || datePeriods.endDate,
    });

    return res.json(datePeriods);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// 📌 Удаление даты
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datePeriods = await DataPeriods.findByPk(id);
    
    if (!datePeriods) {
      return res.status(404).json({ message: "Период не найден" });
    }

    await datePeriods.destroy();
    return res.json({ message: "Период успешно удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});


module.exports = router;