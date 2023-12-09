const Joi = require("joi");
const { Op } = require("sequelize");

const { Station, sequelize } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");

exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    return res.status(200).json({ data: stations, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}