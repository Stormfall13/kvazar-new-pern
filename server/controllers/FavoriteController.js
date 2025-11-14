const Favorite = require('../models/Favorites');
const Dop = require('../models/Dop');

// ➕ Добавить в избранное
const addToFavorites = async (req, res) => {
    const userId = req.user.userId;
    const { dopId } = req.params;

    try {
        // Проверка: уже в избранном?
        const existing = await Favorite.findOne({ where: { userId, dopId } });
        if (existing) {
        return res.status(400).json({ message: "Уже в избранном" });
        }

        // Проверяем существует ли Dop запись
        const dopWork = await Dop.findByPk(dopId);
        if (!dopWork) {
            return res.status(404).json({ message: "Запись не найдена" });
        }

        const favorite = await Favorite.create({ userId, dopId });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
};

// ❌ Удалить из избранного
const removeFromFavorites = async (req, res) => {
    const userId = req.user.userId;
    const { dopId } = req.params;

    try {
        const deleted = await Favorite.destroy({ where: { userId, dopId } });
        if (!deleted) {
        return res.status(404).json({ message: "Не найдено в избранном" });
        }

        res.json({ message: "Удалено из избранного" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
};

// 📥 Получить все избранные Dop работы пользователя
const getUserFavorites = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Временное решение - получи ID и затем загрузи Dop отдельно
      const favorites = await Favorite.findAll({
        where: { userId },
        attributes: ['dopId'] // Только ID Dop записей
      });

      // Загрузи Dop записи по ID
      const dopIds = favorites.map(f => f.dopId).filter(id => id);
      const favoriteDops = await Dop.findAll({
        where: { id: dopIds },
          attributes: [
            'id', 'date', 'reglament', 'executor', 'amount', 'typeWork', 'typeTest',
            'recommen', 'errors', 'critic', 'counting', 'iteration', 'point',
            'inspector', 'departament', 'delayTester', 'delayExecutor', 'pointsRemove',
            'dispute', 'commentError', 'linkReport', 'reportPeriods'
          ]
      });
  
      res.json(favoriteDops);
    } catch (error) {
      res.status(500).json({ 
        message: "Ошибка сервера", 
        error: error.message
      });
    }
};

// ✅ Проверить, в избранном ли
const checkFavorite = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { dopId } = req.params;
  
      const favorite = await Favorite.findOne({
        where: { userId, dopId }
      });
  
      res.json({ isFavorite: !!favorite });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavorite
};