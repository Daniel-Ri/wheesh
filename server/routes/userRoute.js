const express = require('express');
const { login, register, getProfile, updateProfile, sendEmailToken, changePassword, changeEmail } = require('../controllers/userController');
const authentication = require('../middlewares/authentication');
const userRoute = express.Router();

userRoute.post('/login', login);
userRoute.post('/register', register);
userRoute.post('/sendEmailToken', sendEmailToken);

userRoute.use(authentication);
userRoute.get('/', getProfile);
userRoute.put('/', updateProfile);
userRoute.put('/changePassword', changePassword);
userRoute.put('/changeEmail', changeEmail);

module.exports = userRoute;