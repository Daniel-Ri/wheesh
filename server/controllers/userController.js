const Joi = require("joi");
const { Op } = require("sequelize");

const { EmailToken, User, Passenger, sequelize } = require("../models");
const { compare } = require("../utils/handlePassword");
const { signToken, generateRandomToken } = require("../utils/handleToken");
const { handleClientError, handleServerError } = require("../utils/handleError");
const { transporter, generateMailOptionsForNewEmail, generateMailOptionsForUpdateEmail } = require("../utils/handleMail");

exports.login = async(req, res) => {
  try {
    const dataReq = req.body;
    const scheme = Joi.object({
      usernameOrEmail: Joi.string().required(),
      password: Joi.string().required()
    });

    const { error } = scheme.validate(dataReq);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })
    
    const foundUser = await User.findOne({ 
      where: {
        [Op.or]: [
          {username: dataReq.usernameOrEmail},
          {email: dataReq.usernameOrEmail},
        ]
      },
      attributes: { exclude: [ 'createdAt', 'updatedAt'] }
    });
    if (!foundUser) {
      return handleClientError(res, 400, "Username or password is invalid");
    }

    const hashPassword = foundUser.password;
    if (!compare(dataReq.password, hashPassword))
      return handleClientError(res, 400, "Username or password is invalid");
    
    const token = signToken(foundUser.id, 'user');

    const formattedUser = foundUser.toJSON();
    formattedUser.role = 'user';
    delete formattedUser.password;

    return res.status(200).json({ token, user: formattedUser, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.sendEmailToken = async(req, res) => {
  try {
    const { email, action } = req.body;
    const scheme = Joi.object({
      email: Joi.string().email().required(),
      action: Joi.string().valid('create', 'update').required(),
    });

    const { error } = scheme.validate(req.body);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message });

    const existingEmailInUser = await User.findOne({
      where: {email}
    });
    if (existingEmailInUser)
      return handleClientError(res, 400, "Email already exist!");

    const randomToken = generateRandomToken();
    const currentTime = new Date();
    const expiredAt = new Date(currentTime.getTime() + 5 * 60000);

    const foundEmailToken = await EmailToken.findOne({ where: {email} });
    if (foundEmailToken) {
      foundEmailToken.token = randomToken;
      foundEmailToken.expiredAt = expiredAt;
      await foundEmailToken.save();

    } else {
      await EmailToken.create({
        email,
        token: randomToken,
        expiredAt,
      });

    }

    if (action === 'create') {
      const mailOptions = generateMailOptionsForNewEmail(email, randomToken);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return handleServerError(res);
        }
        console.log('Email sent: ' + info.response);
      });
    } else { // update
      const mailOptions = generateMailOptionsForUpdateEmail(email, randomToken);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return handleServerError(res);
        }
        console.log('Email sent: ' + info.response);
      });
    }

    return res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.register = async(req, res) => {
  try {
    const newData = req.body;
    const scheme = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
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
      email: Joi.string().email().required(),
      emailToken: Joi.string().required(),
    }).messages({
      'date.lessThanOrEqual17YearsAgo': 'You must be at least 17 years old',
      'idCard.invalidFormat': 'ID Card is in invalid format'
    });

    const { error } = scheme.validate(newData);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const existingUsername = await User.findOne({
      where: {username: newData.username}
    });
    if (existingUsername)
      return handleClientError(res, 400, "Username already exist!");

    const foundEmailToken = await EmailToken.findOne({
      where: {
        email: newData.email,
        token: newData.emailToken,
        expiredAt: {[Op.gte]: new Date()}
      }
    });
    if (!foundEmailToken)
      return handleClientError(res, 400, "Email token is expired or invalid!");

    await sequelize.transaction(async(t) => {
      const newUser = await User.create(
        {
          username: newData.username,
          email: newData.email,
          password: newData.password,  
        },
        { transaction: t }
      );

      await Passenger.create(
        {
          userId: newUser.id,
          isUser: true,
          gender: newData.gender,
          dateOfBirth: newData.dateOfBirth,
          idCard: newData.idCard,
          name: newData.name,
          email: newData.email,
        },
        { transaction: t }
      );

      await EmailToken.destroy({
        where: {email: newData.email},
        transaction: t
      });

      const reloadedUser = await User.findByPk(newUser.id, {
        attributes: { exclude: [ 'password', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: Passenger,
            attributes: { exclude: [ 'createdAt', 'updatedAt'] }
          }
        ],
        transaction: t
      })
      return res.status(201).json({ data: reloadedUser, status: 'Success' });
    });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getProfile = async(req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: [ 'password', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: Passenger,
          attributes: { exclude: [ 'createdAt', 'updatedAt'] },
          where: {
            isUser: true
          }
        }
      ]
    })
    return res.status(200).json({ data: user, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.updateProfile = async(req, res) => {
  try {
    const { username, gender, dateOfBirth, idCard, name } = req.body;
    const scheme = Joi.object({
      username: Joi.string(),
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

    const foundUser = await User.findByPk(req.user.id);
    const foundPassenger = await Passenger.findOne({
      where: {userId: req.user.id, isUser: true}
    });

    if (username) {
      const existingUsername = await User.findOne({
        where: {username, [Op.not]: [{id: req.user.id}]}
      });
      if (existingUsername)
        return handleClientError(res, 400, "Username already exist!");
      foundUser.username = username;
    }

    if (gender)
      foundPassenger.gender = gender;

    if (dateOfBirth)
      foundPassenger.dateOfBirth = dateOfBirth;

    if (idCard)
      foundPassenger.idCard = idCard;

    if (name)
      foundPassenger.name = name;

    await sequelize.transaction(async(t) => {
      await foundUser.save({ transaction: t });
      await foundPassenger.save({ transaction: t });

      const reloadedUser = await User.findByPk(req.user.id, {
        attributes: { exclude: [ 'password', 'createdAt', 'updatedAt'] },
        transaction: t
      });

      const formateedUser = reloadedUser.toJSON();
      formateedUser.role = 'user';

      return res.status(200).json({ data: formateedUser, status: 'Success' });
    });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const scheme = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
    });

    const { error } = scheme.validate(req.body);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundUser = await User.findByPk(req.user.id);

    const passwordMatch = compare(oldPassword, foundUser.password);
    if (!passwordMatch)
      return handleClientError(res, 401, 'Invalid old password');

    foundUser.password = newPassword;
    await foundUser.save();

    return res.status(200).json({ message: 'Change password successfully' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
} 