const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Movie extends Model {}

Movie.init(
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
    Title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Rating: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        },
    Year: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Month: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Certificate: {
        type: DataTypes.STRING,
        allowNull: true
        },
    Runtime: {
        type: DataTypes.STRING,
        allowNull: true
        },
    Directors: {
        type: DataTypes.STRING,
        allowNull: true
        },
    Stars: {
        type: DataTypes.STRING,
        allowNull: true
        },
    Genre: {
        type: DataTypes.STRING,
        allowNull: true
        },
    Filming_location: {
        type: DataTypes.STRING,
        allowNull: true
        },
    Budget: {
        type: DataTypes.STRING,
        allowNull: true
        },
    Income: {
        type: DataTypes.STRING,
        allowNull: true
        },
    Country_of_origin: {
        type: DataTypes.STRING,
        allowNull: true
        }
    },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'movie'
  }
);

module.exports = Movie;
