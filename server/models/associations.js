const User = require('./User');
const Dop = require('./Dop');
const Favorites = require('./Favorites');

// Ассоциации
Favorites.belongsTo(User, { foreignKey: 'userId' });
Favorites.belongsTo(Dop, { foreignKey: 'dopId' });

User.hasMany(Favorites, { foreignKey: 'userId' });
Dop.hasMany(Favorites, { foreignKey: 'dopId' });

console.log('✅ Ассоциации моделей установлены');

module.exports = {
  User,
  Dop,
  Favorites
};