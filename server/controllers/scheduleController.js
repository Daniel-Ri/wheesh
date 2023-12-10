const Joi = require("joi");
const { Op } = require("sequelize");

const { Schedule, Station, Train, sequelize } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");

exports.getLatestDateSchedule = async(req, res) => {
  try {
    const latestSchedule = await Schedule.findOne({
      order: [['departureTime', 'DESC']]
    });

    const latestDateSchedule = latestSchedule.departureTime;

    return res.status(200).json({data: latestDateSchedule, status: 'Success'});
  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getSchedules = async(req, res) => {
  try {
    const { departureStationId, arrivalStationId, date } = req.params;
    const startLimit = new Date((new Date(date)).setHours(0, 0, 0, 0));
    const endLimit = new Date(startLimit.getTime() + 24 * 60 * 60 * 1000);

    const foundDepartureStation = await Station.findByPk(departureStationId);
    if (!foundDepartureStation)
      return handleClientError(res, 400, "Departure Station Not Found");

    const foundArrivalStation = await Station.findByPk(arrivalStationId);
    if (!foundArrivalStation)
      return handleClientError(res, 400, "Arrival Station Not Found");

    const schedules = await Schedule.findAll({
      where: {
        departureStationId,
        arrivalStationId,
        [Op.and]: [
          {departureTime: {[Op.gte]: startLimit}},
          {departureTime: {[Op.lt]: endLimit}}
        ],
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Station,
          as: 'departureStation',
          attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
        },
        {
          model: Station,
          as: 'arrivalStation',
          attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
        },
      ]
    });

    return res.status(200).json({data: schedules, status: 'Success'});

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}