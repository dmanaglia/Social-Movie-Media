const sequelize = require('../config/connection');
const { User, Review, Movie } = require('../models');

const userData = require('./userData.json');
const movieData = require('./movieData.json');
const reviewData = require('./reviewData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // COMMENTED OUT SO HEROKU DOESN'T USE THESE
  // await User.bulkCreate(userData, {
  //   individualHooks: true,
  //   returning: true,
  // });

  await Movie.bulkCreate(movieData, {
    individualHooks: true,
    returning: true,
  });

  // COMMENTED OUT SO HEROKU DOESN'T USE THESE
  // await Review.bulkCreate(reviewData, {
  //   individualHooks: true,
  //   returning: true,
  // });

  process.exit(0);
};

seedDatabase();
