const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../models/index');
const { queryInterface } = sequelize;

