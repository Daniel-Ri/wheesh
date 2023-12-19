const Joi = require("joi");
const { Op } = require("sequelize");

const { Passenger, sequelize } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");

exports.getMyPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.findAll(
      { where: {userId: req.user.id}, 
      attributes: { exclude: [ 'createdAt', 'updatedAt'] }}
    );

    return res.status(200).json({ data: passengers, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getPassenger = async (req, res) => {
  try {
    const { passengerId } = req.params;

    const foundPassenger = await Passenger.findByPk(passengerId, {
      attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
    });
    if (!foundPassenger)
      return handleClientError(res, 404, 'Passenger Not Found');

    if (foundPassenger.userId != req.user.id)
      return handleClientError(res, 400, 'Not Authorized');

    return res.status(200).json({ data: foundPassenger, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.createPassenger = async (req, res) => {
  try {
    const { gender, dateOfBirth, idCard, name, email } = req.body;
    const scheme = Joi.object({
      gender: Joi.string().valid('Male', 'Female').required(),
      dateOfBirth: Joi.date().required().custom((value, helpers) => {
        const inputDate = new Date(value);

        // Calculate the date 17 years ago
        const seventeenYearsAgo = new Date();
        seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);

        // Check if the input date is less than or equal to 17 years ago
        if (inputDate <= seventeenYearsAgo) {
          return value; // Validation passes
        } else {
          return helpers.error('date.lessThanOrEqual17YearsAgo'); // Validation fails
        }
      }),
      idCard: Joi.string().length(16).required().custom((value, helpers) => {
        if (/^[0-9]+$/.test(value)) {
          return value;
        } else {
          return helpers.error('idCard.invalidFormat');
        }
      }),
      name: Joi.string().required(),
      email: Joi.string().email(),
    }).messages({
      'date.lessThanOrEqual17YearsAgo': 'You must be at least 17 years old',
      'idCard.invalidFormat': 'ID Card is in invalid format'
    });

    const { error } = scheme.validate(req.body);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const myPassengersData = await Passenger.findAll({
      where: { userId: req.user.id }
    });

    if (myPassengersData.length >= 15)
      return handleClientError(res, 400, `You have reached the limit of creating passengers`);

    const existingIdCard = myPassengersData.find(
      (element) => element.userId == req.user.id && element.idCard == idCard
    );
    if (existingIdCard)
      return handleClientError(res, 400, 'You have already added this ID Card');

    const newPassenger = await Passenger.create({
      gender, dateOfBirth, idCard, name, email, userId: req.user.id, isUser: false
    });

    return res.status(201).json({ data: newPassenger, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.updatePassenger = async (req, res) => {
  try {
    const { passengerId } = req.params;

    const { gender, dateOfBirth, idCard, name, email } = req.body;
    const scheme = Joi.object({
      gender: Joi.string().valid('Male', 'Female'),
      dateOfBirth: Joi.date().custom((value, helpers) => {
        const inputDate = new Date(value);

        // Calculate the date 17 years ago
        const seventeenYearsAgo = new Date();
        seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);

        // Check if the input date is less than or equal to 17 years ago
        if (inputDate <= seventeenYearsAgo) {
          return value; // Validation passes
        } else {
          return helpers.error('date.lessThanOrEqual17YearsAgo'); // Validation fails
        }
      }),
      idCard: Joi.string().length(16).custom((value, helpers) => {
        if (/^[0-9]+$/.test(value)) {
          return value;
        } else {
          return helpers.error('idCard.invalidFormat');
        }
      }),
      name: Joi.string(),
      email: Joi.string().email(),
    }).messages({
      'date.lessThanOrEqual17YearsAgo': 'You must be at least 17 years old',
      'idCard.invalidFormat': 'ID Card is in invalid format'
    });

    const { error } = scheme.validate(req.body);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundPassenger = await Passenger.findByPk(passengerId, {
      attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
    });
    if (!foundPassenger)
      return handleClientError(res, 404, 'Passenger Not Found');

    if (foundPassenger.userId != req.user.id)
      return handleClientError(res, 400, 'Not Authorized');

    if (foundPassenger.isUser)
      return handleClientError(res, 400, "You cannot change your data with this endpoint");

    if (gender)
      foundPassenger.gender = gender;

    if (dateOfBirth)
      foundPassenger.dateOfBirth = dateOfBirth;

    if (idCard) {
      const existingIdCard = await Passenger.findOne({
        where: { userId: req.user.id, idCard, id: {[Op.not]: passengerId} }
      });
      if (existingIdCard)
        return handleClientError(res, 400, 'You have already added this ID Card');

      foundPassenger.idCard = idCard;
    }

    if (name)
      foundPassenger.name = name;

    if (email)
      foundPassenger.email = email;

    await foundPassenger.save();
    return res.status(200).json({ data: foundPassenger, status: 'Success' });
    
  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.deletePassenger = async (req, res) => {
  try {
    const { passengerId } = req.params;

    const foundPassenger = await Passenger.findByPk(passengerId, {
      attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
    });
    if (!foundPassenger)
      return handleClientError(res, 404, 'Passenger Not Found');

    if (foundPassenger.userId != req.user.id)
      return handleClientError(res, 400, 'Not Authorized');

    if (foundPassenger.isUser)
      return handleClientError(res, 400, "You cannot delete your data with this endpoint");

    await Passenger.destroy({ where: { id: passengerId } });
    return res.status(200).json({ message: `Successfully delete ${foundPassenger.name}` });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}