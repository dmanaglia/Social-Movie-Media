const sequelize = require('../config/connection');
const { User, Review, Movie } = require('../models');

const userData = require('./userData.json');
const movieData = require('./movieData.json');
const reviewData = require('./reviewData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const movies = await Movie.bulkCreate(movieData, {
    individualHooks: true,
    returning: true,
  });

  for (const review of reviewData) {
    await Review.create({
      ...review,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
