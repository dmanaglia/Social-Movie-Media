// Require Sequelize and Sequelize Object
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Review table extending for Model from Sequelize
class Review extends Model {}

// Review table with its columns
Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
      },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      }},
    movieId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'movie',
        key: 'id',
      } 
    }
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'review'
  }
);

module.exports = Review;
