const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/FavoriteController");
const authMiddleware = require("../middlewares/authMiddleware");

// ➕ Добавить Dop работу в избранное
router.post("/add/:dopId", authMiddleware, favoriteController.addToFavorites);

// ❌ Удалить Dop работу из избранного
router.delete("/remove/:dopId", authMiddleware, favoriteController.removeFromFavorites);

// 📥 Полуть все избранные Dop работы текущего пользователя
router.get("/", authMiddleware, favoriteController.getUserFavorites);

// ✅ Проверить, в избранном ли Dop работа
router.get("/check/:dopId", authMiddleware, favoriteController.checkFavorite);

module.exports = router;