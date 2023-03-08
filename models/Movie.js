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
        allowNull: false
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
        allowNull: false
    },
    Certificate: {
        type: DataTypes.STRING,
        allowNull: false
        },
    Runtime: {
        type: DataTypes.STRING,
        allowNull: false
        },
    Directors: {
        type: DataTypes.STRING,
        allowNull: false
        },
    Stars: {
        type: DataTypes.STRING,
        allowNull: false
        },
    Genre: {
        type: DataTypes.STRING,
        allowNull: false
        },
    Filming_location: {
        type: DataTypes.STRING,
        allowNull: false
        },
    Budget: {
        type: DataTypes.STRING,
        allowNull: false
        },
    Income: {
        type: DataTypes.STRING,
        allowNull: false
        },
    Country_of_origin: {
        type: DataTypes.STRING,
        allowNull: false
        }
    },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'movie'
  }
);

module.exports = Movie;
