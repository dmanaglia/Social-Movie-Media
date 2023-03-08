const User = require('./User');
const Review = require('./Review');
const Movie = require('./Movie');

Review.belongsTo(User, {
  foreignKey: 'userId',
});

Review.belongsTo(Movie, {
  foreignKey:'movieId',
});

User.hasMany(Review, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Movie.hasMany(Review, {
  foreignKey:'movieId',
  onDelete: 'CASCADE'
});

module.exports = {
  User,
  Review,
  Movie
};