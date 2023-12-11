'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carriage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Carriage.belongsTo(models.Train, {
        foreignKey: 'trainId',
      });
      Carriage.hasMany(models.Seat, {
        foreignKey: 'carriageId',
      });
    }
  }
  Carriage.init({
    trainId: {
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
    carriageNumber: {
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
  }, {
    sequelize,
    modelName: 'Carriage',
  });
  return Carriage;
};