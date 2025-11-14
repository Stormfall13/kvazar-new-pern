const express = require("express");
const Dop = require("../models/Dop");
const { Op } = require("sequelize");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Все роуты требуют аутентификации
router.use(authMiddleware);

// 📌 1. Создание записи Dop
router.post("/", async (req, res) => {
    try {
        const { 
            date, 
            timeText,
            reglament, 
            executor, 
            amount, 
            typeWork, 
            typeTest,
            recommen,
            errors,
            critic,
            recomenPoint,
            errorsPoint,
            criticPoint,
            generalPoint,
            counting,
            iteration,
            deadlines,
            point,
            inspector,
            departament,
            delayTester,
            delayExecutor,
            pointsRemove,
            dispute,
            commentError,
            linkReport,
            reportPeriods
        } = req.body;

        // // Валидация обязательных полей
        // if (!date || !executor || !typeWork) {
        //     return res.status(400).json({ message: "Поля date, executor, typeWork обязательны" });
        // }

        const dopWork = await Dop.create({
            date,
            timeText,
            reglament, 
            executor, 
            amount, 
            typeWork, 
            typeTest,
            recommen,
            errors,
            critic,
            recomenPoint,
            errorsPoint,
            criticPoint,
            generalPoint,
            counting,
            iteration,
            deadlines,
            point,
            inspector,
            departament,
            delayTester,
            delayExecutor,
            pointsRemove,
            dispute,
            commentError,
            linkReport,
            reportPeriods
        });

        res.status(201).json(dopWork);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 2. Получение всех записей с фильтрацией
router.get("/", async (req, res) => {
    try {
        const { 
            executor, 
            typeWork, 
            departament,
            dateFrom,
            dateTo 
        } = req.query;

        const whereClause = {};
        
        if (executor) {
            whereClause.executor = {
                [Op.iLike]: `%${executor}%`
            };
        }
        
        if (typeWork) {
            whereClause.typeWork = typeWork;
        }
        
        if (departament) {
            whereClause.departament = departament;
        }
        
        if (dateFrom || dateTo) {
            whereClause.date = {};
            if (dateFrom) whereClause.date[Op.gte] = new Date(dateFrom);
            if (dateTo) whereClause.date[Op.lte] = new Date(dateTo);
        }

        const dops = await Dop.findAll({
            where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
            order: [['date', 'DESC']]
        });

        res.json(dops);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 3. Получение одной записи по ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dopWork = await Dop.findByPk(id);

        if (!dopWork) {
            return res.status(404).json({ message: "Запись не найдена" });
        }

        res.json(dopWork);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 4. Обновление записи
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const dopWork = await Dop.findByPk(id);
        if (!dopWork) {
            return res.status(404).json({ message: "Запись не найдена" });
        }

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                dopWork[key] = updateData[key];
            }
        });

        await dopWork.save();
        res.json({ message: "Запись обновлена", dopWork });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 5. Удаление записи
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const dopWork = await Dop.findByPk(id);
        if (!dopWork) {
            return res.status(404).json({ message: "Запись не найдена" });
        }

        await dopWork.destroy();
        res.json({ message: "Запись удалена" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 6. Глобальный поиск
router.get("/search/global", async (req, res) => {
    const { query } = req.query;
    
    if (!query) return res.status(400).json({ message: "Пустой запрос" });
    
    try {
        const results = await Dop.findAll({
            where: {
                [Op.or]: [
                    { executor: { [Op.iLike]: `%${query}%` } },
                    { typeWork: { [Op.iLike]: `%${query}%` } },
                    { departament: { [Op.iLike]: `%${query}%` } },
                    { inspector: { [Op.iLike]: `%${query}%` } },
                    { commentError: { [Op.iLike]: `%${query}%` } }
                ]
            },
            order: [['date', 'DESC']]
        });
        
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Ошибка поиска", error: err.message });
    }
});

// 📌 7. Получение записей по исполнителю
router.get("/executor/:executorName", async (req, res) => {
    try {
        const { executorName } = req.params;
        
        const dops = await Dop.findAll({
            where: {
                executor: {
                    [Op.iLike]: `%${executorName}%`
                }
            },
            order: [['date', 'DESC']]
        });

        res.json(dops);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 8. Критические ошибки
router.get("/filters/critical", async (req, res) => {
    try {
        const dops = await Dop.findAll({
            where: { 
                critic: true 
            },
            order: [['date', 'DESC']]
        });
        res.json(dops);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// 📌 9. Disputes
router.get("/filters/disputes", async (req, res) => {
    try {
        const dops = await Dop.findAll({
            where: { 
                dispute: true 
            },
            order: [['date', 'DESC']]
        });
        res.json(dops);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

module.exports = router;