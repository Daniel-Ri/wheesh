'use strict';
const {
  Model
} = require('sequelize');
const { hash } = require('../utils/handlePassword');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Passenger, {
        foreignKey: {
          name: 'userId'
        },
      });
      
      User.hasMany(models.Order, {
        foreignKey: {
          name: 'userId',
        },
      });
    }
  }
  User.init({
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING, 
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', hash(value));
      }
    },
    role: {
      defaultValue: 'user',
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING 
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};