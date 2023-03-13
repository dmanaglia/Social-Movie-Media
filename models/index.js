// Require the 3 tables
const User = require('./User');
const Review = require('./Review');
const Movie = require('./Movie');

// Associations for the tables and foreign key assignment
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

// Exporting the 3 tables
module.exports = {
  User,
  Review,
  Movie
};