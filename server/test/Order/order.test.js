const request = require('supertest');
const Redis = require("ioredis-mock");
const { Op } = require("sequelize");
const app = require('../../index');
const { Schedule, User, Passenger, Order, Train, Carriage, Seat, Payment, sequelize } = require('../../models/index');
const { up: upUser, down: downUser } = require('../../seeders/20231205021723-user');
const { up: upPassenger, down: downPassenger } = require('../../seeders/20231205023546-passenger');
const { up: upStation, down: downStation } = require('../../seeders/20231208023152-station');
const { up: upScheduleDay, down: downScheduleDay } = require('../../seeders/20231208040653-scheduleDay');
const { up: upTrain, down: downTrain } = require('../../seeders/20231208041837-train');
const { up: upSchedule, down: downSchedule } = require('../../seeders/20231208043910-schedule');
const { up: upSchedulePrice, down: downSchedulePrice } = require('../../seeders/20231208070828-schedulePrice');
const { up: upCarriage, down: downCarriage } = require('../../seeders/20231211040055-carriage');
const { up: upSeat, down: downSeat } = require('../../seeders/20231211041822-seat');
const { up: upOrder, down: downOrder } = require('../../seeders/20231211054219-order');
const { up: upOrderedSeat, down: downOrderedSeat } = require('../../seeders/20231211063308-orderedSeat');
const { up: upPayment, down: downPayment } = require('../../seeders/20231213090332-payment');
const { queryInterface } = sequelize;

const mockRedisClient = new Redis();
jest.mock("ioredis", () => require("ioredis-mock"));

beforeAll(async () => {
  await upUser(queryInterface, sequelize);
  await upPassenger(queryInterface, sequelize);
  await upStation(queryInterface, sequelize);
  await upScheduleDay(queryInterface, sequelize);
  await upTrain(queryInterface, sequelize);
  await upSchedule(queryInterface, sequelize);
  await upSchedulePrice(queryInterface, sequelize);
  await upCarriage(queryInterface, sequelize);
  await upSeat(queryInterface, sequelize);
  await upOrder(queryInterface, sequelize);
  await upOrderedSeat(queryInterface, sequelize);
  await upPayment(queryInterface, sequelize);
}, 15000);

afterAll(async () => {
  await downUser(queryInterface, sequelize);
  await downPassenger(queryInterface, sequelize);
  await downStation(queryInterface, sequelize);
  await downScheduleDay(queryInterface, sequelize);
  await downTrain(queryInterface, sequelize);
  await downSchedule(queryInterface, sequelize);
  await downSchedulePrice(queryInterface, sequelize);
  await downCarriage(queryInterface, sequelize);
  await downSeat(queryInterface, sequelize);
  await downOrder(queryInterface, sequelize);
  await downOrderedSeat(queryInterface, sequelize);
  await downPayment(queryInterface, sequelize);
});

describe('Create Order', () => {
  beforeEach(() => {
    mockRedisClient.flushall();
  });

  test('Success create order with status 201', async () => {
    let response;
    let order;
    const whichOrderTomorrow = 2; // second order
    const dummyUser = {
      usernameOrEmail: 'johndoe',
      password: '123456',
    };
    const passengerIds = [2, 3] // passenger ids of this user

    try {
      const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const tomorrowSchedules = await Schedule.findAll({
        where: {
          departureTime: {[Op.gte]: tomorrow},
        },
        order: [
          ['departureTime', 'ASC']
        ],
        include: [
          {
            model: Train,
            attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
            include: [
              {
                model: Carriage,
                attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
                include: [
                  {
                    model: Seat,
                    attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
                  }
                ]
              }
            ]
          },
        ],
      });
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);
      
      const schedule = tomorrowSchedules[whichOrderTomorrow - 1];
      const businessSeatIdsOfFirstCarriage = 
        schedule
          .Train
          .Carriages[0]
          .Seats.filter((seat) => seat.seatClass === 'business').map((seat) => seat.id);
      const choosenSeats = [];
      choosenSeats.push(businessSeatIdsOfFirstCarriage[0]);
      choosenSeats.push(businessSeatIdsOfFirstCarriage[1]);

      const inputs = {
        scheduleId: schedule.id,
        orderedSeats: 
          passengerIds.map((passengerId, idx) => ({seatId: choosenSeats[idx], passengerId})),
      };

      response =
        await request(app)
          .post('/api/order')
          .set('authorization', `Bearer ${loginResponse.body.token}`)
          .send(inputs);

      order = await Order.findOne({
        where: {
          userId: loginResponse.body.user.id,
          scheduleId: schedule.id,
        },
      });

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);
    expect(order).not.toBeNull();
  });

  test('Success create second order with status 201', async () => {
    let response;
    let order;
    const departureStationId = 3;
    const whichOrderTomorrowGoBack = 5;
    const dummyUser = {
      usernameOrEmail: 'johndoe',
      password: '123456',
    };
    const passengerIds = [2, 3] // passenger ids of this user

    try {
      const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const tomorrowSchedules = await Schedule.findAll({
        where: {
          departureTime: {[Op.gte]: tomorrow},
          departureStationId,
        },
        order: [
          ['departureTime', 'ASC']
        ],
        include: [
          {
            model: Train,
            attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
            include: [
              {
                model: Carriage,
                attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
                include: [
                  {
                    model: Seat,
                    attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
                  }
                ]
              }
            ]
          },
        ],
      });
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);
      
      const schedule = tomorrowSchedules[whichOrderTomorrowGoBack - 1];
      const businessSeatIdsOfFirstCarriage = 
        schedule
          .Train
          .Carriages[0]
          .Seats.filter((seat) => seat.seatClass === 'business').map((seat) => seat.id);
      const choosenSeats = [];
      choosenSeats.push(businessSeatIdsOfFirstCarriage[0]);
      choosenSeats.push(businessSeatIdsOfFirstCarriage[1]);

      const inputs = {
        scheduleId: schedule.id,
        orderedSeats: 
          passengerIds.map((passengerId, idx) => ({seatId: choosenSeats[idx], passengerId})),
      };

      response =
        await request(app)
          .post('/api/order')
          .set('authorization', `Bearer ${loginResponse.body.token}`)
          .send(inputs);

      order = await Order.findOne({
        where: {
          userId: loginResponse.body.user.id,
          scheduleId: schedule.id,
        },
      });

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);
    expect(order).not.toBeNull();
  })
});

describe('Get Unpaid Orders', () => {
  test('Success get unpaid orders with status 200', async () => {
    let response;
    const userId = 2;
    const dummyUser = {
      usernameOrEmail: 'johndoe',
      password: '123456',
    };

    try {
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      response =
        await request(app)
          .get('/api/order/unpaid')
          .set('authorization', `Bearer ${loginResponse.body.token}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    data.forEach((obj) => {
      expect(obj).toHaveProperty("id");
      expect(obj.userId).toEqual(userId);
      expect(obj).toHaveProperty("isNotified");
      expect(obj).toHaveProperty("createdAt");
      expect(obj).toHaveProperty("Payment");
      expect(obj).toHaveProperty("Schedule");
      expect(obj).toHaveProperty("OrderedSeats");
    });
  });
});

describe('Get Paid Orders', () => {
  test('Success get paid orders with status 200', async () => {
    let response;
    const userId = 2;
    const dummyUser = {
      usernameOrEmail: 'johndoe',
      password: '123456',
    };

    try {
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      response =
        await request(app)
          .get('/api/order/paid')
          .set('authorization', `Bearer ${loginResponse.body.token}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    data.forEach((obj) => {
      expect(obj).toHaveProperty("id");
      expect(obj.userId).toEqual(userId);
      expect(obj).toHaveProperty("isNotified");
      expect(obj).toHaveProperty("createdAt");
      expect(obj).toHaveProperty("Payment");
      expect(obj).toHaveProperty("Schedule");
      expect(obj).toHaveProperty("OrderedSeats");
    });
  });
});

describe('Get History Orders', () => {
  test('Success get history orders with status 200', async () => {
    let response;
    const userId = 2;
    const dummyUser = {
      usernameOrEmail: 'johndoe',
      password: '123456',
    };

    try {
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      response =
        await request(app)
          .get('/api/order/history')
          .set('authorization', `Bearer ${loginResponse.body.token}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    data.forEach((obj) => {
      expect(obj).toHaveProperty("id");
      expect(obj.userId).toEqual(userId);
      expect(obj).toHaveProperty("isNotified");
      expect(obj).toHaveProperty("createdAt");
      expect(obj).toHaveProperty("Payment");
      expect(obj).toHaveProperty("Schedule");
      expect(obj).toHaveProperty("OrderedSeats");
    });
  });
});

describe('Get Order', () => {
  test('Success get paid order data with status 200', async () => {
    let response;
    const userId = 2;
    const dummyUser = {
      usernameOrEmail: 'johndoe',
      password: '123456',
    };

    try {
      const order = await Order.findOne({ 
        where: { userId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          }
        ]
      });

      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      response =
        await request(app)
          .get(`/api/order/${order.id}`)
          .set('authorization', `Bearer ${loginResponse.body.token}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    expect(data).toHaveProperty("id");
    expect(data.userId).toEqual(userId);
    expect(data).toHaveProperty("isNotified");
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("Payment");
    expect(data).toHaveProperty("Schedule");
    expect(data).toHaveProperty("OrderedSeats");
    data.OrderedSeats.forEach((obj) => {
      expect(obj).toHaveProperty("secret");
    })
  });

  test('Success get unpaid order data with status 200', async () => {
    let response;
    const userId = 2;
    const dummyUser = {
      usernameOrEmail: 'johndoe',
      password: '123456',
    };

    try {
      const order = await Order.findOne({ 
        where: { userId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: false,
            }
          }
        ]
      });

      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      response =
        await request(app)
          .get(`/api/order/${order.id}`)
          .set('authorization', `Bearer ${loginResponse.body.token}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    expect(data).toHaveProperty("id");
    expect(data.userId).toEqual(userId);
    expect(data).toHaveProperty("isNotified");
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("Payment");
    expect(data).toHaveProperty("Schedule");
    expect(data).toHaveProperty("OrderedSeats");
    data.OrderedSeats.forEach((obj) => {
      expect(obj).not.toHaveProperty("secret");
    })
  });
});

